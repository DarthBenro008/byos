import { useEffect, useState, useRef } from "preact/hooks";
import { Peer } from "peerjs";
import { Media, Video, AspectRatio } from "@vidstack/player-react";
import UsernameModal from "../../components/UsernameModal";
import ChatWindow from "../../components/Chat";
import { useSnackbar } from "notistack";
import copy from "copy-to-clipboard";
import "./styles.css";

const Home = () => {
  const [file, setFile] = useState(null);
  const [filePath, setFilePath] = useState(null);
  const [peerId, setPeerId] = useState(null);
  const [refCon, setRefCon] = useState(null);
  const [username, setUsername] = useState(null);
  const [messages, setMessages] = useState([]);
  const v1Ref = useRef({});
  const msgRef = useRef(messages);
  const { enqueueSnackbar } = useSnackbar();

  msgRef.current = messages;

  const successSnack = (message) => {
    enqueueSnackbar(message, {
      variant: "info",
      anchorOrigin: { vertical: "top", horizontal: "left" },
      autoHideDuration: 2000
    });
  };

  const handleFileChange = (events) => {
    events.preventDefault();
    setFile(events.target.files[0]);
    const path = URL.createObjectURL(events.target.files[0]);
    setFilePath(path);
  };

  const setName = (username) => {
    localStorage.setItem("username", username);
    setUsername(username);
  };

  useEffect(() => {
    createPeer();
  }, [filePath]);

  useEffect(() => {
    const username = localStorage.getItem("username");
    if (username) {
      setUsername(username);
    }
  }, []);

  const createPeer = () => {
    if (!filePath) {
      return;
    }

    console.log("sanity passed");
    const peer = new Peer();
    // Setting Peer Id to the user
    peer.on("open", (id) => {
      successSnack(
        `The URL you need to send to your friend has been copied to your clipboard!`
      );
      copy(`https://${window.location.hostname}/${id}`);
      setPeerId(id);
    });

    peer.on("disconnected", () => {
      setMessages([
        ...msgRef.current,
        { sender: "f", msg: "Friend has discconected" },
      ]);
    });

    peer.on("close", () => {
      setMessages([
        ...msgRef.current,
        { sender: "f", msg: "Friend has discconected" },
      ]);
    });

    peer.on("connection", (connection) => {
      connection.on("close", () => {
        setMessages([
          ...msgRef.current,
          { sender: "f", msg: "Friend has discconected" },
        ]);
      });

      //On establishing connection with mason
      connection.on("open", () => {
        setRefCon(connection);
        //Listening any messages from mason
        connection.on("data", (data) => {
          console.log(`message from mason: ${data}`);
          setMessages([
            ...msgRef.current,
            { sender: connection.id, msg: data },
          ]);
        });

        console.log(`mason connecting ${connection.peer}`);
        setMessages([
          ...msgRef.current,
          { sender: connection.id, msg: "Your friend is here!" },
        ]);

        if (v1Ref.current) {
          peer.call(connection.peer, v1Ref.current.captureStream());
        } else {
          console.log("Video not ready");
        }
      });
    });
  };

  const sendMsg = (outgoingMessage) => {
    if (refCon) {
      console.log(`sending ${outgoingMessage}`);
      refCon.send(outgoingMessage);
      setMessages([...messages, { sender: username, msg: outgoingMessage }]);
    } else {
      console.error("Error sending message: Connection not active?");
    }
  };

  const Player = () => {
    return (
      <Media>
        <AspectRatio ratio="16/9">
          <Video autoplay controls>
            <video
              className="h-screen"
              ref={v1Ref}
              controls
              src={filePath}
              preload="none"
              data-video="0"
            />
          </Video>
        </AspectRatio>
      </Media>
    );
  };

  const FileSelection = () => {
    return (
      <div className="flex w-full h-screen items-center justify-center bg-grey-lighter">
        <label className="w-64 flex flex-col items-center px-4 py-6 bg-white text-blue rounded-lg shadow-lg tracking-wide text-center border border-blue cursor-pointer hover:bg-gray-800 hover:text-blue-500">
          <svg
            className="w-8 h-8"
            fill="currentColor"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
          >
            <path d="M16.88 9.1A4 4 0 0 1 16 17H5a5 5 0 0 1-1-9.9V7a3 3 0 0 1 4.52-2.59A4.98 4.98 0 0 1 17 8c0 .38-.04.74-.12 1.1zM11 11h3l-4-4-4 4h3v3h2v-3z" />
          </svg>
          <span className="mt-2 text-base leading-normal">
            Select a file to continue!
          </span>
          <input
            type="file"
            id="file-input"
            className="hidden"
            onChange={handleFileChange}
            accept="video/*"
          />
        </label>
      </div>
    );
  };

  const mainApp = () => {
    return (
      <div className="grid grid-cols-12 bg-gray-800">
        <div className="flex col-span-10 h-screen">{Player()}</div>
        <div className="col-span-2">
          <ChatWindow
            username={username}
            title={`${username}'s Party`}
            sendMessageFunction={sendMsg}
            data={messages}
            url={peerId}
          />
        </div>
      </div>
    );
  };

  return (
    <div className="bg-gray-800 h-screen">
      {username ? (
        file ? (
          mainApp()
        ) : (
          FileSelection()
        )
      ) : (
        <UsernameModal submissionFunction={setName} />
      )}
    </div>
  );
};

export default Home;
