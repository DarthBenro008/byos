import { useEffect, useState } from "preact/hooks";

function ChatWindow({
  sendMessageFunction,
  data = [
    { sender: "none", msg: "welcome to this party!" },
    { sender: "Joe Mamma", msg: "Joined the chat" },
  ],
  username = "Joe Mamma",
  title = "Joe Mamma",
  url = "something went wrong",
}) {
  const [message, setMessage] = useState("");
  const handleChange = (event) => {
    setMessage(event.target.value);
  };

  useEffect(() => {
    console.log(data);
  });

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      submit();
    }
  };

  const submit = () => {
    if (message === "") {
      return;
    }
    sendMessageFunction(message);
  };
  return (
    <div
      key={data.length}
      className="dark grid grid-flow-row auto-rows-max justify-items-stretch bg-zinc-800 text-white h-screen"
    >
      <div className="">
        <div className="relative flex items-center p-3 border-b border-amber-700">
          <img
            className="object-cover w-10 rounded-full"
            src="https://img.freepik.com/free-vector/cute-cat-hole-cartoon-vector-icon-illustration-animal-nature-icon-concept-isolated-premium-vector-flat-cartoon-style_138676-4236.jpg?w=740&t=st=1666293750~exp=1666294350~hmac=d38d09dacce8d024f8d3f14a928fda27494c6b901ceee0f502693a671f271691"
            alt="username"
            onClick={() => {
              alert(
                `Send this to your friend: https://${window.location.hostname}/${url}`
              );
            }}
          />
          <span className="block ml-2 font-bold ">{title}</span>
          {/* <span className="absolute w-3 h-3 bg-green-600 rounded-full left-10 top-3" /> */}
        </div>
      </div>

      <div className="">
        <div className="w-full p-6 overflow-y-auto tall:h-[40rem] md:h-[36rem]">
          <ul className="space-y-2">
            {data.map((message, index) => {
              if (message.sender === username) {
                return (
                  <li key={index} className="flex justify-end">
                    <div className="relative max-w-xl px-4 py-2 text-gray-700 bg-gray-100 rounded shadow">
                      <span className="block">{message.msg}</span>
                    </div>
                  </li>
                );
              }
              return (
                <li key={index} className="flex justify-start">
                  <div className="relative max-w-xl px-4 py-2 text-black bg-orange-500 rounded shadow">
                    <span className="block">{message.msg}</span>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </div>

      <div className="w-full">
        <div className="flex items-center justify-between w-full p-2 border-t pt-5 border-amber-700">
          <input
            autoComplete="off"
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            type="text"
            placeholder="Message"
            className="block w-full py-2 pl-4 mx-3 bg-gray-100 rounded-full outline-none focus:text-gray-700"
            name="message"
            required
          />
          <button type="submit" onClick={submit}>
            <svg
              className="w-5 h-5 text-gray-500 origin-center transform rotate-90"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}

export default ChatWindow;
