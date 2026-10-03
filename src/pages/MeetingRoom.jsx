import { useEffect, useRef, useState } from "react";
import {Mic, MicOff,Video,VideoOff,MonitorUp,PhoneOff, Users,MessageSquare,MoreVertical,Copy,} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";

import VideoTile from "../components/VideoTile";

function MeetingRoom() {
  const navigate = useNavigate();
  const { roomId } = useParams();

  const streamRef = useRef(null);

  const [localStream, setLocalStream] = useState(null);
  const [screenStream, setScreenStream] = useState(null);

  const [micOn, setMicOn] = useState(true);
  const [cameraOn, setCameraOn] = useState(true);
  const [isSharing, setIsSharing] = useState(false);

  const [showParticipants, setShowParticipants] = useState(false);
  const [showChat, setShowChat] = useState(false);

  // Start camera and microphone
  useEffect(() => {
    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });

        streamRef.current = stream;
        setLocalStream(stream);
      } catch (error) {
        console.error("Camera/Microphone permission denied:", error);
      }
    };

    startCamera();

    // Cleanup when leaving meeting
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => {
          track.stop();
        });
      }

      if (screenStream) {
        screenStream.getTracks().forEach((track) => {
          track.stop();
        });
      }
    };
  }, []);

  // Toggle microphone
  const toggleMic = () => {
    if (!streamRef.current) return;

    const audioTrack = streamRef.current.getAudioTracks()[0];

    if (audioTrack) {
      audioTrack.enabled = !audioTrack.enabled;
      setMicOn(audioTrack.enabled);
    }
  };

  // Toggle camera
  const toggleCamera = () => {
    if (!streamRef.current) return;

    const videoTrack = streamRef.current.getVideoTracks()[0];

    if (videoTrack) {
      videoTrack.enabled = !videoTrack.enabled;
      setCameraOn(videoTrack.enabled);
    }
  };

  // Toggle screen sharing
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

      const videoTrack = stream.getVideoTracks()[0];

      // Detect browser "Stop sharing"
      videoTrack.onended = () => {
        stream.getTracks().forEach((track) => {
          track.stop();
        });

        setScreenStream(null);
        setIsSharing(false);
      };
    } catch (error) {
      console.error("Screen sharing failed:", error);
    }
  };

  // Copy meeting ID
  const copyMeetingId = async () => {
    try {
      await navigator.clipboard.writeText(roomId || "classmeet-room");

      alert("Meeting ID copied!");
    } catch (error) {
      console.error("Failed to copy meeting ID:", error);
    }
  };

  // Leave meeting
  const leaveMeeting = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => {
        track.stop();
      });
    }

    if (screenStream) {
      screenStream.getTracks().forEach((track) => {
        track.stop();
      });
    }

    setLocalStream(null);
    setScreenStream(null);

    navigate("/");
  };

  return (
    <div className="flex h-screen flex-col bg-[#111827] text-white">

      {/* ================= TOP BAR ================= */}
      <header className="flex items-center justify-between border-b border-white/10 px-6 py-4">

        {/* Meeting Info */}
        <div>
          <h1 className="text-lg font-semibold">
            ClassMeet Room
          </h1>

          <p className="mt-1 text-xs text-slate-400">
            Meeting ID: {roomId || "classmeet-room"}
          </p>
        </div>

        {/* Top Actions */}
        <div className="flex items-center gap-3">

          {/* Participants */}
          <button
            onClick={() =>
              setShowParticipants((prev) => !prev)
            }
            className="flex items-center gap-2 rounded-lg bg-white/10 px-4 py-2 text-sm transition hover:bg-white/20"
          >
            <Users size={18} />
            Participants
          </button>

          {/* Chat */}
          <button
            onClick={() =>
              setShowChat((prev) => !prev)
            }
            className="rounded-lg bg-white/10 p-2.5 transition hover:bg-white/20"
          >
            <MessageSquare size={19} />
          </button>

          {/* More */}
          <button className="rounded-lg bg-white/10 p-2.5 transition hover:bg-white/20">
            <MoreVertical size={19} />
          </button>

        </div>
      </header>

      {/* ================= MAIN AREA ================= */}
      <main className="relative flex flex-1 overflow-hidden">

        {/* ================= VIDEO AREA ================= */}
        <div className="flex flex-1 items-center justify-center overflow-auto p-6">

          <div className="w-full max-w-5xl">

            {/* Screen Sharing Indicator */}
            {isSharing && (
              <div className="mb-4 inline-flex rounded-lg bg-[#14B8A6] px-4 py-2 text-sm font-semibold">
                You are sharing your screen
              </div>
            )}

            {/* Video Grid */}
            <div className="grid w-full grid-cols-1 gap-4 md:grid-cols-2">

              {/* Local User */}
              <VideoTile
                stream={localStream}
                name="Demo User"
                muted={true}
                micOn={micOn}
                isLocal={true}
              />

              {/* Remote User Placeholder */}
              <VideoTile
                stream={null}
                name="Alex"
                micOn={true}
              />

              {/* Remote User Placeholder */}
              <VideoTile
                stream={null}
                name="Taylor"
                micOn={false}
              />

              {/* Remote User Placeholder */}
              <VideoTile
                stream={null}
                name="Jordan"
                micOn={true}
              />

            </div>
          </div>
        </div>

        {/* ================= PARTICIPANTS PANEL ================= */}
        {showParticipants && (
          <aside className="w-72 shrink-0 border-l border-white/10 bg-[#172033] p-5">

            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-lg font-semibold">
                Participants
              </h2>

              <span className="rounded-full bg-white/10 px-2.5 py-1 text-xs text-slate-300">
                4
              </span>
            </div>

            <div className="space-y-3">

              {/* You */}
              <div className="flex items-center gap-3 rounded-xl bg-white/5 p-3">

                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#14B8A6] font-semibold">
                  D
                </div>

                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">
                    Demo User
                  </p>

                  <p className="text-xs text-green-400">
                    You
                  </p>
                </div>

              </div>

              {/* Alex */}
              <div className="flex items-center gap-3 rounded-xl bg-white/5 p-3">

                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blue-500 font-semibold">
                  A
                </div>

                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">
                    Alex
                  </p>

                  <p className="text-xs text-slate-400">
                    Connected
                  </p>
                </div>

              </div>

              {/* Taylor */}
              <div className="flex items-center gap-3 rounded-xl bg-white/5 p-3">

                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-purple-500 font-semibold">
                  T
                </div>

                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">
                    Taylor
                  </p>

                  <p className="text-xs text-slate-400">
                    Connected
                  </p>
                </div>

              </div>

              {/* Jordan */}
              <div className="flex items-center gap-3 rounded-xl bg-white/5 p-3">

                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-orange-500 font-semibold">
                  J
                </div>

                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">
                    Jordan
                  </p>

                  <p className="text-xs text-slate-400">
                    Connected
                  </p>
                </div>

              </div>

            </div>
          </aside>
        )}

        {/* ================= CHAT PANEL ================= */}
        {showChat && (
          <aside className="absolute right-0 top-0 z-20 flex h-full w-80 flex-col border-l border-white/10 bg-[#172033]">

            {/* Chat Header */}
            <div className="border-b border-white/10 p-5">
              <h2 className="font-semibold">
                Meeting Chat
              </h2>

              <p className="mt-1 text-xs text-slate-400">
                Messages from this meeting
              </p>
            </div>

            {/* Messages */}
            <div className="flex-1 space-y-4 overflow-y-auto p-5">

              <div className="rounded-xl bg-white/10 p-3">
                <p className="text-xs text-slate-400">
                  Alex
                </p>

                <p className="mt-1 text-sm">
                  Hello everyone!
                </p>
              </div>

              <div className="rounded-xl bg-[#0F766E] p-3">
                <p className="text-xs text-teal-100">
                  Demo User
                </p>

                <p className="mt-1 text-sm">
                  Hello! Good to see everyone.
                </p>
              </div>

            </div>

            {/* Chat Input */}
            <div className="border-t border-white/10 p-4">

              <input
                type="text"
                placeholder="Type a message..."
                className="w-full rounded-lg bg-white/10 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-400 focus:ring-1 focus:ring-[#14B8A6]"
              />

            </div>

          </aside>
        )}

      </main>

     
    </div>
  );
}

export default MeetingRoom;