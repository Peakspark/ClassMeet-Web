import { X, Mic, MicOff, Video, VideoOff } from "lucide-react";

function ParticipantsPanel({ participants, onClose }) {
  return (
    <aside className="absolute right-0 top-0 z-20 flex h-full w-80 flex-col border-l border-white/10 bg-[#172033]">

      {/* Header */}
      <div className="flex items-center justify-between border-b border-white/10 p-5">

        <div>
          <h2 className="font-semibold">
            Participants
          </h2>

          <p className="mt-1 text-xs text-slate-400">
            {participants.length} people in this meeting
          </p>
        </div>

        <button
          onClick={onClose}
          className="rounded-lg p-2 text-slate-400 transition hover:bg-white/10 hover:text-white"
        >
          <X size={18} />
        </button>

      </div>

      {/* Participants List */}
      <div className="flex-1 space-y-3 overflow-y-auto p-5">

        {participants.map((participant) => (
          <div
            key={participant.id}
            className="flex items-center gap-3 rounded-xl bg-white/5 p-3"
          >

            {/* Avatar */}
            <div className="relative">

              <div
                className={`flex h-10 w-10 items-center justify-center rounded-full font-semibold text-white ${participant.avatarColor}`}
              >
                {participant.name.charAt(0).toUpperCase()}
              </div>

              {/* Online Indicator */}
              {participant.online && (
                <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-[#172033] bg-green-400" />
              )}

            </div>

            {/* User Info */}
            <div className="min-w-0 flex-1">

              <p className="truncate text-sm font-medium">
                {participant.name}
                {participant.isLocal && (
                  <span className="ml-1 text-xs text-teal-300">
                    (You)
                  </span>
                )}
              </p>

              <p className="text-xs text-slate-400">
                {participant.online ? "Connected" : "Offline"}
              </p>

            </div>

            {/* Media Status */}
            <div className="flex items-center gap-2">

              {participant.micOn ? (
                <Mic
                  size={15}
                  className="text-slate-300"
                />
              ) : (
                <MicOff
                  size={15}
                  className="text-red-400"
                />
              )}

              {participant.cameraOn ? (
                <Video
                  size={15}
                  className="text-slate-300"
                />
              ) : (
                <VideoOff
                  size={15}
                  className="text-red-400"
                />
              )}

            </div>

          </div>
        ))}

      </div>

    </aside>
  );
}

export default ParticipantsPanel;