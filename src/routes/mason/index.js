/* eslint-disable react-hooks/rules-of-hooks */
import { Peer } from "peerjs";
import { useEffect, useState, useRef } from "preact/hooks";
import { Media, Video, AspectRatio } from "@vidstack/player-react";
import UsernameModal from "../../components/UsernameModal";
import ChatWindow from "../../components/Chat";

const mason = ({ id }) => {
  const v2Ref = useRef(null);
  const [status, setStatus] = useState(false);
  const [refCon, setRefCon] = useState(null);
  const [username, setUsername] = useState(null);
  const [messages, setMessages] = useState([]);
  const msgRef = useRef(messages);

  msgRef.current = messages;

  const setName = (username) => {
    localStorage.setItem("username", username);
    setUsername(username);
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
      console.log(`Connection to peer error: ${error}`);
      alert(`Major F\n${error}\nPlease contact hey@benro.dev`);
    });

    peer.on("connection", (conn) => {
      console.log("conn in");
      if (refCon) conn.close();
      else setRefCon(refCon);
      conn.on("data", (data) => {
        console.log(data);
      });
      conn.send("Sending other peer a message");
    });

    // Connect to ID
    peer.on("open", (self) => {
      console.log(`Mason ID: ${self}`);
      console.log(`connecting to ${id}`);
      const conn = peer.connect(id, {
        reliable: true,
        metadata: { username: localStorage.getItem("username") },
      });
      setRefCon(conn);
      conn.on("data", (data) => {
        console.log("message from home", data);
        setMessages([...msgRef.current, { sender: "f", msg: data }]);
      });
      conn.on("error", (err) =>
        alert(`Error: ${err}\n Please contact hey@benro.dev`)
      );
    });
  };

  const Player = () => {
    return (
      <Media>
        <AspectRatio ratio="16/9">
          <Video autoplay controls>
            <video
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
      console.log(`sending ${outgoingMessage}`);
      console.log("sender", messages);
      refCon.send(outgoingMessage);
      setMessages([...messages, { sender: username, msg: outgoingMessage }]);
    } else {
      console.error("Error sending message: Connection not active?");
    }
  };

  return (
    <div>
      <div className="grid grid-cols-12">
        <div className="flex col-span-10 h-screen">
          {status ? Player() : <div />}
        </div>
        <div className="col-span-2">
          <ChatWindow
            username={username}
            title={`${username}'s Party`}
            sendMessageFunction={sendMsg}
            data={messages}
            url={id}
          />
        </div>
      </div>

      {username ? <div /> : <UsernameModal submissionFunction={setName} />}
    </div>
  );
};

export default mason;
