import { useEffect, useState, useRef } from "preact/hooks";
import { Peer } from "peerjs";

const Home = () => {
  const [file, setFile] = useState(null);
  const [filePath, setFilePath] = useState(null);
  const [peerId, setPeerId] = useState(null);
  const v1Ref = useRef({});

  const handleFileChange = (events) => {
    events.preventDefault();
    setFile(events.target.files[0]);
    const path = URL.createObjectURL(events.target.files[0]);
    setFilePath(path);
    console.log(path);
  };

  useEffect(() => {
    console.log("nice");
    createPeer();
  }, [filePath]);

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
      //Listening any messages from mason
      connection.on("data", (data) =>
        console.log(`message from mason: ${data}`)
      );

      //On establishing connection with mason
      connection.on("open", () => {
		console.log(`mason connecting ${connection.peer}`)
        if (v1Ref.current) {
          peer.call(connection.peer, v1Ref.current.captureStream());
        } else {
          console.log("Video not ready");
        }
      });
    });
  };

  return (
    <div>
      {file ? (
        <video autoplay controls src={filePath} ref={v1Ref} />
      ) : (
        <input
          type="file"
          id="file-input"
          onChange={handleFileChange}
          accept="video/*"
        />
      )}
      <br />
      {peerId ? peerId : <div />}
    </div>
  );
};

export default Home;
