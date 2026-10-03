import { useEffect, useRef, useState } from "react";
import {Mic, MicOff,Video,VideoOff,MonitorUp,PhoneOff, Users,MessageSquare,MoreVertical,Copy,} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";

import VideoTile from "../components/VideoTile";

import MeetingControls from "../components/MeetingControls";
import MeetingChat from "../components/MeetingChat";

import ParticipantsPanel from "../components/ParticipantsPanel";



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



  const [participants] = useState([
  {
    id: 1,
    name: "Demo User",
    online: true,
    micOn: micOn,
    cameraOn: cameraOn,
    isLocal: true,
    avatarColor: "bg-[#14B8A6]",
  },
  {
    id: 2,
    name: "Alex",
    online: true,
    micOn: true,
    cameraOn: true,
    isLocal: false,
    avatarColor: "bg-blue-500",
  },
  {
    id: 3,
    name: "Taylor",
    online: true,
    micOn: false,
    cameraOn: true,
    isLocal: false,
    avatarColor: "bg-purple-500",
  },
  {
    id: 4,
    name: "Jordan",
    online: true,
    micOn: true,
    cameraOn: false,
    isLocal: false,
    avatarColor: "bg-orange-500",
  },
]);


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
  <ParticipantsPanel
    participants={participants}
    onClose={() => setShowParticipants(false)}
  />
        )}

        {/* ================= CHAT PANEL ================= */}
      {showChat && (
  <MeetingChat
    onClose={() => setShowChat(false)}
  />
)}
        

      </main>
<MeetingControls
  micOn={micOn}
  cameraOn={cameraOn}
  isSharing={isSharing}
  onToggleMic={toggleMic}
  onToggleCamera={toggleCamera}
  onToggleScreenShare={toggleScreenShare}
  onCopyMeetingId={copyMeetingId}
  onLeaveMeeting={leaveMeeting}
/>
     
    </div>
  );
}

export default MeetingRoom;