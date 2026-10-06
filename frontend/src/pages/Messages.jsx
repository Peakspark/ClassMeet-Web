import {
  Search,
  MoreVertical,
  Phone,
  Video,
  Send,
  Paperclip,
  Smile,
  CheckCheck,
} from "lucide-react";

function Messages() {
  const conversations = [
    {
      id: 1,
      name: "Aman Kumar",
      message: "Hey, are you joining the meeting?",
      time: "10:42 AM",
      online: true,
      unread: 2,
    },
    {
      id: 2,
      name: "Priya Mehta",
      message: "I have shared the design file.",
      time: "09:35 AM",
      online: true,
      unread: 0,
    },
    {
      id: 3,
      name: "Rahul Singh",
      message: "Let's discuss the project.",
      time: "Yesterday",
      online: false,
      unread: 0,
    },
    {
      id: 4,
      name: "Sneha Verma",
      message: "Meeting scheduled for tomorrow.",
      time: "Yesterday",
      online: true,
      unread: 1,
    },
  ];

  const messages = [
    {
      id: 1,
      sender: "Aman Kumar",
      text: "Hey Amit! Are you joining the meeting?",
      time: "10:40 AM",
      own: false,
    },
    {
      id: 2,
      sender: "You",
      text: "Yes, I'll join in a few minutes.",
      time: "10:41 AM",
      own: true,
    },
    {
      id: 3,
      sender: "Aman Kumar",
      text: "Great. We need to discuss the frontend.",
      time: "10:42 AM",
      own: false,
    },
  ];

  return (
    <div className="min-h-[calc(100vh-96px)] bg-[#F0FDFA] px-8 pb-8">

      <div className="flex h-[calc(100vh-128px)] overflow-hidden rounded-2xl bg-white shadow-sm">

        {/* Conversations */}
        <div className="w-80 shrink-0 border-r border-slate-200">

          {/* Search */}
          <div className="border-b border-slate-200 p-5">

            <h2 className="text-lg font-bold text-[#172033]">
              Messages
            </h2>

            <div className="mt-4 flex items-center gap-3 rounded-xl bg-slate-50 px-3 py-2.5">
              <Search size={18} className="text-slate-400" />

              <input
                type="text"
                placeholder="Search conversations..."
                className="w-full bg-transparent text-sm outline-none placeholder:text-slate-400"
              />
            </div>

          </div>

          {/* Conversation List */}
          <div className="overflow-y-auto">

            {conversations.map((conversation) => (
              <button
                key={conversation.id}
                className="flex w-full items-center gap-3 border-b border-slate-100 px-5 py-4 text-left transition hover:bg-[#F0FDFA]"
              >

                {/* Avatar */}
                <div className="relative">

                  <div className="flex h-11 w-11 items-center justify-center rounded-full bg-teal-100 font-semibold text-[#0F766E]">
                    {conversation.name.charAt(0)}
                  </div>

                  {conversation.online && (
                    <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white bg-green-500" />
                  )}

                </div>

                {/* Info */}
                <div className="min-w-0 flex-1">

                  <div className="flex items-center justify-between">

                    <p className="text-sm font-semibold text-[#172033]">
                      {conversation.name}
                    </p>

                    <span className="text-[11px] text-slate-400">
                      {conversation.time}
                    </span>

                  </div>

                  <div className="mt-1 flex items-center justify-between">

                    <p className="truncate text-xs text-slate-400">
                      {conversation.message}
                    </p>

                    {conversation.unread > 0 && (
                      <span className="ml-2 flex h-5 min-w-5 items-center justify-center rounded-full bg-[#0F766E] px-1 text-[10px] font-bold text-white">
                        {conversation.unread}
                      </span>
                    )}

                  </div>

                </div>

              </button>
            ))}

          </div>

        </div>

        {/* Chat Area */}
        <div className="flex min-w-0 flex-1 flex-col">

          {/* Chat Header */}
          <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">

            <div className="flex items-center gap-3">

              <div className="relative">

                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-teal-100 font-semibold text-[#0F766E]">
                  A
                </div>

                <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white bg-green-500" />

              </div>

              <div>
                <h3 className="text-sm font-bold text-[#172033]">
                  Aman Kumar
                </h3>

                <p className="text-xs text-green-500">
                  Online
                </p>
              </div>

            </div>

            <div className="flex items-center gap-1">

              <button className="rounded-lg p-2.5 text-slate-500 transition hover:bg-slate-100">
                <Phone size={18} />
              </button>

              <button className="rounded-lg p-2.5 text-slate-500 transition hover:bg-slate-100">
                <Video size={19} />
              </button>

              <button className="rounded-lg p-2.5 text-slate-500 transition hover:bg-slate-100">
                <MoreVertical size={19} />
              </button>

            </div>

          </div>

          {/* Messages */}
          <div className="flex-1 space-y-5 overflow-y-auto bg-slate-50/50 p-6">

            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${
                  message.own ? "justify-end" : "justify-start"
                }`}
              >

                <div
                  className={`max-w-[65%] ${
                    message.own ? "items-end" : "items-start"
                  }`}
                >

                  <div
                    className={`rounded-2xl px-4 py-3 text-sm ${
                      message.own
                        ? "rounded-br-md bg-[#0F766E] text-white"
                        : "rounded-bl-md bg-white text-[#172033] shadow-sm"
                    }`}
                  >
                    {message.text}
                  </div>

                  <div
                    className={`mt-1 flex items-center gap-1 text-[11px] text-slate-400 ${
                      message.own ? "justify-end" : "justify-start"
                    }`}
                  >
                    {message.time}

                    {message.own && (
                      <CheckCheck size={13} />
                    )}
                  </div>

                </div>

              </div>
            ))}

          </div>

          {/* Message Input */}
          <div className="border-t border-slate-200 bg-white p-4">

            <div className="flex items-center gap-3">

              <button className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600">
                <Paperclip size={20} />
              </button>

              <div className="flex flex-1 items-center rounded-xl bg-slate-50 px-4 py-2.5">

                <input
                  type="text"
                  placeholder="Type a message..."
                  className="w-full bg-transparent text-sm outline-none placeholder:text-slate-400"
                />

                <button className="ml-2 text-slate-400 hover:text-slate-600">
                  <Smile size={19} />
                </button>

              </div>

              <button className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#0F766E] text-white transition hover:bg-[#134E4A]">
                <Send size={18} />
              </button>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}

export default Messages;