import { Peer } from "peerjs";
import { useEffect, useState, useRef } from "preact/hooks";
import { Media, Video, AspectRatio } from "@vidstack/player-react";
import "./styles.css";

const mason = ({ id }) => {
  const v2Ref = useRef(null);
  const [status, setStatus] = useState(false);

  useEffect(() => {
    createPeer();
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

    peer.on("error", (error) =>
      console.log(`Connection to peer error: ${error}`)
    );

    // Connect to ID

    peer.on("open", (self) => {
      console.log(`Mason ID: ${self}`);
      console.log(`connecting to ${id}`);
      const conn = peer.connect(id);
      conn.on("connection", (connection) => {
        connection.on("open", () => {
          console.log("connection established");
        });
      });
      conn.on("error", (err) => console.log(`cannot establish ${err}`));
    });
  };

  const Player = () => {
    return (
      <Media>
        <AspectRatio ratio="16/9">
          <Video autoplay controls>
            <video ref={v2Ref} controls preload="none" data-video="0" />
          </Video>
        </AspectRatio>
      </Media>
    );
  };

  return (
    <div>
      Hello {id}
      <br />
      {status ? Player() : <div />}
    </div>
  );
};

export default mason;
