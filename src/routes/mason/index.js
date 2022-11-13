/* eslint-disable react-hooks/rules-of-hooks */
import { Peer } from "peerjs";
import { useEffect, useState, useRef } from "preact/hooks";
import { Media, Video, AspectRatio } from "@vidstack/player-react";
import UsernameModal from "../../components/UsernameModal";
import ChatWindow from "../../components/Chat";
import { useSnackbar } from "notistack";

const mason = ({ id }) => {
  const v2Ref = useRef(null);
  const [status, setStatus] = useState(false);
  const [refCon, setRefCon] = useState(null);
  const [username, setUsername] = useState(null);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [sub, setSub] = useState("");
  const msgRef = useRef(messages);
  const { enqueueSnackbar } = useSnackbar();

  msgRef.current = messages;

  const setName = (username) => {
    localStorage.setItem("username", username);
    setUsername(username);
  };

  const msgHub = (data) => {
    switch (data.cmd) {
      case "sub":
        setSub(data.msg.msg);
        break;
      case "text":
        setMessages([...msgRef.current, data.msg]);
    }
  };

  const errorSnack = (message) => {
    enqueueSnackbar(message, {
      variant: "error",
      anchorOrigin: { vertical: "top", horizontal: "left" },
      persist: true,
    });
  };

  const successSnack = (message) => {
    enqueueSnackbar(message, {
      variant: "info",
      anchorOrigin: { vertical: "top", horizontal: "left" },
      autoHideDuration: 2000,
      preventDuplicate: true,
    });
  };

  useEffect(() => {
    const username = localStorage.getItem("username");
    if (username) {
      setUsername(username);
      createPeer();
    }
  }, []);

  const createPeer = () => {
    console.log("creating peer");
    const peer = new Peer();

    // Specifying how to act on incoming call
    peer.on("call", (call) => {
      console.log("incoming call");
      setStatus(true);
      call.answer();
      call.on("stream", (stream) => {
        successSnack("You have joined a party! Please click on play button");
        const video = v2Ref.current;
        if (video) {
          if ("srcObject" in video) {
            video.srcObject = stream;
          } else {
            video.src = window.URL.createObjectURL(stream);
          }
        } else {
          console.log("Video not ready");
        }
      });
    });

    peer.on("error", (error) => {
      errorSnack(`Something went wrong! with error: ${error}`);
      console.log(`Connection to peer error: ${error}`);
    });

    // Connect to ID
    peer.on("open", (self) => {
      console.log(`Mason ID: ${self}`);
      console.log(`connecting to ${id}`);
      const conn = peer.connect(id, {
        reliable: true,
        metadata: { username: localStorage.getItem("username") },
      });
      setMessages([
        ...msgRef.current,
        { sender: username, msg: "You have joined the party!" },
      ]);
      setRefCon(conn);
      conn.on("data", (data) => {
        console.log("message from home", data);
        // setMessages([...msgRef.current, { sender: "f", msg: data }]);
        msgHub(data);
      });
      conn.on("error", (err) => {
        errorSnack(`Something went wrong! with error: ${err}`);
        // alert(`Error: ${err}\n Please contact hey@benro.dev`);
      });
    });
  };

  const Player = () => {
    return (
      <Media>
        <AspectRatio ratio="16/9">
          <Video autoplay controls>
            <video
              id="video_tag"
              className="h-screen"
              ref={v2Ref}
              controls
              preload="none"
              data-video="0"
            />
          </Video>
        </AspectRatio>
      </Media>
    );
  };

  const sendMsg = (outgoingMessage) => {
    if (refCon) {
      refCon.send(outgoingMessage);
      setMessages([...messages, { sender: username, msg: outgoingMessage }]);
    } else {
      console.error("Error sending message: Connection not active?");
    }
  };

  const loader = () => {
    return (
      <div className="flex w-full h-screen items-center justify-center">
        <button
          disabled
          type="button"
          class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 inline-flex items-center"
        >
          <svg
            role="status"
            class="inline mr-3 w-4 h-4 text-white animate-spin"
            viewBox="0 0 100 101"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
              fill="#E5E7EB"
            />
            <path
              d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
              fill="currentColor"
            />
          </svg>
          Loading...
        </button>
      </div>
    );
  };

  const mainApp = () => {
    return (
      <div className="grid grid-cols-12">
        <div className="flex col-span-10 h-screen relative">
          {Player()}
          <div className="absolute z-10 bg-clip-content bottom-20 break-words font-mono text-base w-full text-center text-white/75">
            <span className="bg-clip-content bg-zinc-800/50 p-2">{sub}</span>
          </div>
        </div>
        <div className="col-span-2">
          <ChatWindow
            message={message}
            setMessage={setMessage}
            username={username}
            title={`${username}'s Party`}
            sendMessageFunction={sendMsg}
            data={messages}
            url={id}
          />
        </div>
      </div>
    );
  };

  return (
    <div className="h-screen bg-gray-800">
      {status ? mainApp() : loader()}
      {username ? <div /> : <UsernameModal submissionFunction={setName} />}
    </div>
  );
};

export default mason;
