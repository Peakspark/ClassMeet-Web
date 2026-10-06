import { Mic, MicOff, Video, VideoOff, MonitorUp, PhoneOff,Copy,} from "lucide-react";

function MeetingControls({
  micOn,
  cameraOn,
  isSharing,
  onToggleMic,
  onToggleCamera,
  onToggleScreenShare,
  onCopyMeetingId,
  onLeaveMeeting,
}) {
  return (
    <footer className="flex items-center justify-center gap-3 border-t border-white/10 bg-[#111827] px-6 py-5">

      {/* Microphone */}
      <button
        onClick={onToggleMic}
        title={micOn ? "Mute microphone" : "Unmute microphone"}
        className={`flex h-12 w-12 items-center justify-center rounded-full transition ${
          micOn
            ? "bg-white/10 hover:bg-white/20"
            : "bg-red-500 hover:bg-red-600"
        }`}
      >
        {micOn ? <Mic size={20} /> : <MicOff size={20} />}
      </button>

      {/* Camera */}
      <button
        onClick={onToggleCamera}
        title={cameraOn ? "Turn off camera" : "Turn on camera"}
        className={`flex h-12 w-12 items-center justify-center rounded-full transition ${
          cameraOn
            ? "bg-white/10 hover:bg-white/20"
            : "bg-red-500 hover:bg-red-600"
        }`}
      >
        {cameraOn ? <Video size={20} /> : <VideoOff size={20} />}
      </button>

      {/* Screen Share */}
      <button
        onClick={onToggleScreenShare}
        title={isSharing ? "Stop screen sharing" : "Share screen"}
        className={`flex h-12 w-12 items-center justify-center rounded-full transition ${
          isSharing
            ? "bg-[#14B8A6] hover:bg-[#0F766E]"
            : "bg-white/10 hover:bg-white/20"
        }`}
      >
        <MonitorUp size={20} />
      </button>

      {/* Copy Meeting ID */}
      <button
        onClick={onCopyMeetingId}
        title="Copy meeting ID"
        className="flex h-12 w-12 items-center justify-center rounded-full bg-white/10 transition hover:bg-white/20"
      >
        <Copy size={19} />
      </button>

      {/* Leave */}
      <button
        onClick={onLeaveMeeting}
        title="Leave meeting"
        className="flex h-12 w-14 items-center justify-center rounded-full bg-red-500 transition hover:bg-red-600"
      >
        <PhoneOff size={21} />
      </button>

    </footer>
  );
}

export default MeetingControls;