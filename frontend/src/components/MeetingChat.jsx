import { useState } from "react";
import { Send, X } from "lucide-react";

function MeetingChat({ onClose }) {
  const [message, setMessage] = useState("");

  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: "Alex",
      text: "Hello everyone!",
      own: false,
    },
    {
      id: 2,
      sender: "Demo User",
      text: "Hello! Good to see everyone.",
      own: true,
    },
  ]);

  const sendMessage = () => {
    const trimmedMessage = message.trim();

    if (!trimmedMessage) return;

    const newMessage = {
      id: Date.now(),
      sender: "Demo User",
      text: trimmedMessage,
      own: true,
    };

    setMessages((prevMessages) => [
      ...prevMessages,
      newMessage,
    ]);

    setMessage("");
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      sendMessage();
    }
  };

  return (
    <aside className="absolute right-0 top-0 z-20 flex h-full w-80 flex-col border-l border-white/10 bg-[#172033]">

      {/* Header */}
      <div className="flex items-center justify-between border-b border-white/10 p-5">

        <div>
          <h2 className="font-semibold">
            Meeting Chat
          </h2>

          <p className="mt-1 text-xs text-slate-400">
            Messages from this meeting
          </p>
        </div>

        <button
          onClick={onClose}
          className="rounded-lg p-2 text-slate-400 transition hover:bg-white/10 hover:text-white"
        >
          <X size={18} />
        </button>

      </div>

      {/* Messages */}
      <div className="flex-1 space-y-4 overflow-y-auto p-5">

        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${
              msg.own ? "justify-end" : "justify-start"
            }`}
          >

            <div
              className={`max-w-[80%] rounded-xl px-3 py-2 ${
                msg.own
                  ? "bg-[#0F766E]"
                  : "bg-white/10"
              }`}
            >

              <p className="text-xs text-slate-300">
                {msg.sender}
              </p>

              <p className="mt-1 break-words text-sm">
                {msg.text}
              </p>

            </div>

          </div>
        ))}

      </div>

      {/* Input */}
      <div className="border-t border-white/10 p-4">

        <div className="flex items-center gap-2">

          <input
            type="text"
            value={message}
            onChange={(event) => setMessage(event.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type a message..."
            className="min-w-0 flex-1 rounded-lg bg-white/10 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-400 focus:ring-1 focus:ring-[#14B8A6]"
          />

          <button
            onClick={sendMessage}
            disabled={!message.trim()}
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-[#0F766E] transition hover:bg-[#134E4A] disabled:cursor-not-allowed disabled:opacity-40"
          >
            <Send size={18} />
          </button>

        </div>

      </div>

    </aside>
  );
}

export default MeetingChat;