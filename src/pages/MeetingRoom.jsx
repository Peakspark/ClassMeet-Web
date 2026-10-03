import { useEffect, useRef, useState } from "react";
import {
  Mic,
  MicOff,
  Video,
  VideoOff,
  MonitorUp,
  PhoneOff,
  Users,
  MessageSquare,
  MoreVertical,
  Copy,
} from "lucide-react";

function MeetingRoom() {
  const videoRef = useRef(null);
  const streamRef = useRef(null);

  const [micOn, setMicOn] = useState(true);
  const [cameraOn, setCameraOn] = useState(true);
  const [showParticipants, setShowParticipants] = useState(false);
  const [showChat, setShowChat] = useState(false);

  const [isSharing, setIsSharing] = useState(false);
const [screenStream, setScreenStream] = useState(null);


  useEffect(() => {
    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });

        streamRef.current = stream;

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (error) {
        console.error("Camera/Microphone permission denied:", error);
      }
    };

    startCamera();

    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => {
          track.stop();
        });
      }
    };
  }, []);

  const toggleMic = () => {
    if (!streamRef.current) return;

    const audioTrack = streamRef.current.getAudioTracks()[0];

    if (audioTrack) {
      audioTrack.enabled = !audioTrack.enabled;
      setMicOn(audioTrack.enabled);
    }
  };

  const toggleCamera = () => {
    if (!streamRef.current) return;

    const videoTrack = streamRef.current.getVideoTracks()[0];

    if (videoTrack) {
      videoTrack.enabled = !videoTrack.enabled;
      setCameraOn(videoTrack.enabled);
    }
  };

  const leaveMeeting = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => {
        track.stop();
      });
    }

    window.history.back();
  };



  const toggleScreenShare = async () => {
  try {
    // Stop screen sharing
    if (isSharing) {
      if (screenStream) {
        screenStream.getTracks().forEach((track) => {
          track.stop();
        });
      }

      setScreenStream(null);
      setIsSharing(false);

      return;
    }

    // Start screen sharing
    const stream = await navigator.mediaDevices.getDisplayMedia({
      video: true,
      audio: true,
    });

    setScreenStream(stream);
    setIsSharing(true);

    // User browser ke "Stop sharing" button se sharing stop kare
    const videoTrack = stream.getVideoTracks()[0];

    videoTrack.onended = () => {
      setScreenStream(null);
      setIsSharing(false);
    };

  } catch (error) {
    console.error("Screen sharing failed:", error);
  }
};



  return (
    <div className="flex h-screen flex-col bg-[#111827] text-white">

      {/* Top Bar */}
      <header className="flex items-center justify-between border-b border-white/10 px-6 py-4">

        <div>
          <h1 className="text-lg font-semibold">
            ClassMeet Room
          </h1>

          <p className="text-xs text-slate-400">
            Meeting ID: CM-2026-001
          </p>
        </div>

        <div className="flex items-center gap-3">

          <button
            onClick={() => setShowParticipants(!showParticipants)}
            className="flex items-center gap-2 rounded-lg bg-white/10 px-4 py-2 text-sm hover:bg-white/20"
          >
            <Users size={18} />
            Participants
          </button>

          <button
            onClick={() => setShowChat(!showChat)}
            className="rounded-lg bg-white/10 p-2.5 hover:bg-white/20"
          >
            <MessageSquare size={19} />
          </button>

          <button className="rounded-lg bg-white/10 p-2.5 hover:bg-white/20">
            <MoreVertical size={19} />
          </button>

        </div>

      </header>

      {/* Main Meeting Area */}
      <main className="relative flex flex-1 overflow-hidden">

        {/* Video Area */}
        <div className="flex flex-1 items-center justify-center p-6">

          <div className="relative h-full max-h-[680px] w-full max-w-5xl overflow-hidden rounded-2xl bg-black shadow-2xl">

      {isSharing && (
  <div className="absolute left-4 top-4 rounded-lg bg-[#14B8A6] px-3 py-2 text-xs font-semibold">
    You are sharing your screen
  </div>
  )}
            {/* Local Camera */}
            {cameraOn ? (
              <video
                ref={videoRef}
                autoPlay
                muted
                playsInline
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-[#1F2937]">
                <div className="flex h-24 w-24 items-center justify-center rounded-full bg-[#14B8A6] text-3xl font-bold">
                  D
                </div>
              </div>
            )}

            {/* Camera Label */}
            <div className="absolute bottom-4 left-4 rounded-lg bg-black/60 px-3 py-2 text-sm">
              Demo User
            </div>

            {/* Camera Off Indicator */}
            {!cameraOn && (
              <div className="absolute left-4 top-4 rounded-lg bg-red-500/90 px-3 py-1 text-xs">
                Camera Off
              </div>
            )}

          </div>

        </div>

        {/* Participants Panel */}
        {showParticipants && (
          <aside className="w-72 border-l border-white/10 bg-[#172033] p-5">

            <h2 className="mb-5 text-lg font-semibold">
              Participants
            </h2>

            <div className="space-y-3">

              <div className="flex items-center gap-3 rounded-xl bg-white/5 p-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#14B8A6] font-semibold">
                  D
                </div>

                <div>
                  <p className="text-sm font-medium">
                    Demo User
                  </p>

                  <p className="text-xs text-green-400">
                    You
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 rounded-xl bg-white/5 p-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-500 font-semibold">
                  A
                </div>

                <div>
                  <p className="text-sm font-medium">
                    Alex
                  </p>

                  <p className="text-xs text-slate-400">
                    Connected
                  </p>
                </div>
              </div>

            </div>

          </aside>
        )}

        {/* Chat Panel */}
        {showChat && (
          <aside className="absolute right-0 top-0 z-20 flex h-full w-80 flex-col border-l border-white/10 bg-[#172033]">

            <div className="border-b border-white/10 p-5">
              <h2 className="font-semibold">
                Meeting Chat
              </h2>
            </div>

            <div className="flex-1 p-5">

              <div className="rounded-xl bg-white/10 p-3">
                <p className="text-xs text-slate-400">
                  Alex
                </p>

                <p className="mt-1 text-sm">
                  Hello everyone!
                </p>
              </div>

            </div>

            <div className="border-t border-white/10 p-4">

              <input
                type="text"
                placeholder="Type a message..."
                className="w-full rounded-lg bg-white/10 px-4 py-3 text-sm outline-none placeholder:text-slate-400 focus:ring-1 focus:ring-[#14B8A6]"
              />

            </div>

          </aside>
        )}

      </main>

      {/* Meeting Controls */}
      <footer className="flex items-center justify-center gap-4 border-t border-white/10 bg-[#111827] px-6 py-5">

        {/* Mic */}
        <button
          onClick={toggleMic}
          className={`flex h-12 w-12 items-center justify-center rounded-full transition ${
            micOn
              ? "bg-white/10 hover:bg-white/20"
              : "bg-red-500 hover:bg-red-600"
          }`}
        >
          {micOn ? (
            <Mic size={20} />
          ) : (
            <MicOff size={20} />
          )}
        </button>

        {/* Camera */}
        <button
          onClick={toggleCamera}
          className={`flex h-12 w-12 items-center justify-center rounded-full transition ${
            cameraOn
              ? "bg-white/10 hover:bg-white/20"
              : "bg-red-500 hover:bg-red-600"
          }`}
        >
          {cameraOn ? (
            <Video size={20} />
          ) : (
            <VideoOff size={20} />
          )}
        </button>

       <button
  onClick={toggleScreenShare}
  className={`flex h-12 w-12 items-center justify-center rounded-full transition ${
    isSharing
      ? "bg-[#14B8A6] hover:bg-[#0F766E]"
      : "bg-white/10 hover:bg-white/20"
  }`}
>
  <MonitorUp size={20} />
</button>

        {/* Copy Meeting ID */}
        <button className="flex h-12 w-12 items-center justify-center rounded-full bg-white/10 transition hover:bg-white/20">
          <Copy size={19} />
        </button>

        {/* End Meeting */}
        <button
          onClick={leaveMeeting}
          className="flex h-12 w-14 items-center justify-center rounded-full bg-red-500 transition hover:bg-red-600"
        >
          <PhoneOff size={21} />
        </button>

      </footer>

    </div>
  );
}

export default MeetingRoom;