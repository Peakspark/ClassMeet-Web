import { useState } from "react";
import { Send, X } from "lucide-react";

function MeetingChat({
  messages = [],
  socket,
  meetingId,
  onClose,
}) {
  const [message, setMessage] = useState("");

  const sendMessage = (e) => {
    e.preventDefault();

    const text = message.trim();

    if (!text || !socket) return;

    socket.emit("send-message", {
      meetingId,
      message: text,
      sender: "You",
    });

    setMessage("");
  };

  return (
    <div className="absolute right-0 top-0 z-20 flex h-full w-80 flex-col border-l border-white/10 bg-[#111827]">

      {/* HEADER */}
      <div className="flex items-center justify-between border-b border-white/10 px-4 py-4">

        <div>
          <h2 className="font-semibold">
            Messages
          </h2>

          <p className="text-xs text-slate-400">
            Meeting chat
          </p>
        </div>

        <button
          onClick={onClose}
          className="rounded-lg p-2 hover:bg-white/10"
        >
          <X size={18} />
        </button>

      </div>

      {/* MESSAGES */}
      <div className="flex-1 space-y-3 overflow-y-auto p-4">

        {messages.length === 0 && (
          <div className="flex h-full items-center justify-center text-center text-sm text-slate-500">
            No messages yet.
            <br />
            Start the conversation.
          </div>
        )}

        {messages.map((item) => {
          const isMe =
            item.socketId === socket?.id;

          return (
            <div
              key={item.id}
              className={`flex ${
                isMe
                  ? "justify-end"
                  : "justify-start"
              }`}
            >
              <div
                className={`max-w-[80%] rounded-xl px-3 py-2 ${
                  isMe
                    ? "bg-[#14B8A6] text-white"
                    : "bg-white/10 text-slate-200"
                }`}
              >
                {!isMe && (
                  <p className="mb-1 text-xs font-semibold text-[#14B8A6]">
                    {item.sender || "Participant"}
                  </p>
                )}

                <p className="break-words text-sm">
                  {item.message}
                </p>

                <p
                  className={`mt-1 text-[10px] ${
                    isMe
                      ? "text-white/70"
                      : "text-slate-500"
                  }`}
                >
                  {new Date(
                    item.createdAt
                  ).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>

              </div>
            </div>
          );
        })}

      </div>

      {/* INPUT */}
      <form
        onSubmit={sendMessage}
        className="border-t border-white/10 p-3"
      >
        <div className="flex items-center gap-2">

          <input
            value={message}
            onChange={(e) =>
              setMessage(e.target.value)
            }
            placeholder="Type a message..."
            className="min-w-0 flex-1 rounded-lg bg-white/10 px-3 py-2.5 text-sm text-white outline-none placeholder:text-slate-500 focus:ring-1 focus:ring-[#14B8A6]"
          />

          <button
            type="submit"
            disabled={!message.trim()}
            className="rounded-lg bg-[#14B8A6] p-2.5 text-white transition hover:bg-[#0F766E] disabled:cursor-not-allowed disabled:opacity-40"
          >
            <Send size={17} />
          </button>

        </div>
      </form>

    </div>
  );
}

export default MeetingChat;