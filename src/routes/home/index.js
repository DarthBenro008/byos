import { useEffect, useState, useRef } from "preact/hooks";
import { Peer } from "peerjs";
import { Media, Video, AspectRatio } from "@vidstack/player-react";
import UsernameModal from "../../components/UsernameModal";
import "./styles.css";

const Home = () => {
  const [file, setFile] = useState(null);
  const [filePath, setFilePath] = useState(null);
  const [peerId, setPeerId] = useState(null);
  const [refCon, setRefCon] = useState(null);
  const [username, setUsername] = useState(null);
  const v1Ref = useRef({});

  const handleFileChange = (events) => {
    events.preventDefault();
    setFile(events.target.files[0]);
    const path = URL.createObjectURL(events.target.files[0]);
    setFilePath(path);
    console.log(path);
  };

  const setName = (username) => {
    localStorage.setItem("username", username);
    setUsername(username);
  };

  useEffect(() => {
    console.log("filepath useEffect");
    createPeer();
  }, [filePath]);

  useEffect(() => {
    const username = localStorage.getItem("username");
    if (username) {
      setUsername(username);
    }
  }, []);

  const createPeer = () => {
    console.log("triggering peer");
    if (!filePath) {
      return;
    }

    console.log("sanity passed");
    const peer = new Peer();
    // Setting Peer Id to the user
    peer.on("open", (id) => {
      console.log(id);
      setPeerId(id);
    });

    peer.on("connection", (connection) => {
      //On establishing connection with mason
      connection.on("open", () => {
        setRefCon(connection);
        //Listening any messages from mason
        connection.on("data", (data) =>
          console.log(`message from mason: ${data}`)
        );

        console.log(`mason connecting ${connection.peer}`);

        if (v1Ref.current) {
          peer.call(connection.peer, v1Ref.current.captureStream());
        } else {
          console.log("Video not ready");
        }
      });
    });
  };

  const sendMsg = (msg) => {
    console.log("snedMsgIn");
    if (refCon) {
      refCon.send(msg);
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
      <input
        type="file"
        id="file-input"
        onChange={handleFileChange}
        accept="video/*"
      />
    );
  };

  return (
    <div>
      <div className="grid grid-cols-12">
        <div className="flex col-span-10 h-screen">
          {file ? Player() : FileSelection()}
        </div>
        <div className="col-span-2">02</div>
      </div>

      {username ? <div /> : <UsernameModal submissionFunction={setName} />}
    </div>
  );
};

export default Home;
