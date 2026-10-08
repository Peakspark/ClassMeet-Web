import { useEffect, useRef, useState } from "react";
import {
  Users,
  MessageSquare,
  MoreVertical,
  Copy,
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { io } from "socket.io-client";

import VideoTile from "../components/VideoTile";
import MeetingControls from "../components/MeetingControls";
import MeetingChat from "../components/MeetingChat";
import ParticipantsPanel from "../components/ParticipantsPanel";

const SOCKET_URL = "https://classmeet-web.onrender.com";

function MeetingRoom() {
  const navigate = useNavigate();
  const { roomId } = useParams();

  // -----------------------------
  // Refs
  // -----------------------------

  const socketRef = useRef(null);
  const localStreamRef = useRef(null);

  const peerConnectionsRef = useRef({});
  const remoteStreamsRef = useRef({});

  // -----------------------------
  // State
  // -----------------------------

  const [localStream, setLocalStream] = useState(null);

  const [remoteStreams, setRemoteStreams] = useState([]);

  const [micOn, setMicOn] = useState(true);
  const [cameraOn, setCameraOn] = useState(true);

  const [showParticipants, setShowParticipants] = useState(false);
  const [showChat, setShowChat] = useState(false);

  // -----------------------------
  // Create WebRTC peer connection
  // -----------------------------

  const createPeerConnection = (socketId) => {
    if (peerConnectionsRef.current[socketId]) {
      return peerConnectionsRef.current[socketId];
    }

    const peerConnection = new RTCPeerConnection({
      iceServers: [
        {
          urls: "stun:stun.l.google.com:19302",
        },
        {
          urls: "stun:stun1.l.google.com:19302",
        },
      ],
    });

    // Add local tracks
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach((track) => {
        peerConnection.addTrack(
          track,
          localStreamRef.current
        );
      });
    }

    // Receive remote tracks
    peerConnection.ontrack = (event) => {
      const stream = event.streams[0];

      if (!stream) return;

      remoteStreamsRef.current[socketId] = stream;

      setRemoteStreams((prev) => {
        const exists = prev.find(
          (item) => item.id === socketId
        );

        if (exists) {
          return prev.map((item) =>
            item.id === socketId
              ? {
                  ...item,
                  stream,
                }
              : item
          );
        }

        return [
          ...prev,
          {
            id: socketId,
            stream,
            name: "Participant",
          },
        ];
      });
    };

    // ICE candidate
    peerConnection.onicecandidate = (event) => {
      if (!event.candidate) return;

      socketRef.current?.emit("ice-candidate", {
        meetingId: roomId,
        targetSocketId: socketId,
        candidate: event.candidate,
      });
    };

    peerConnectionsRef.current[socketId] =
      peerConnection;

    return peerConnection;
  };

  // -----------------------------
  // Start camera + microphone
  // -----------------------------

  useEffect(() => {
    let mounted = true;

    const startMeeting = async () => {
      try {
        console.log("Starting camera and microphone...");

        const stream =
          await navigator.mediaDevices.getUserMedia({
            video: true,
            audio: true,
          });

        if (!mounted) {
          stream.getTracks().forEach((track) =>
            track.stop()
          );
          return;
        }

        localStreamRef.current = stream;
        setLocalStream(stream);

        console.log("Camera/microphone ready");

        // -----------------------------
        // Connect Socket.IO
        // -----------------------------

        const socket = io(SOCKET_URL, {
          transports: ["websocket", "polling"],
        });

        socketRef.current = socket;

        socket.on("connect", () => {
          console.log(
            "Socket connected:",
            socket.id
          );

          socket.emit("join-meeting", roomId);
        });

        // -----------------------------
        // Someone joined
        // -----------------------------

        socket.on(
          "user-joined",
          async ({ socketId }) => {
            console.log(
              "New participant:",
              socketId
            );

            const peerConnection =
              createPeerConnection(socketId);

            const offer =
              await peerConnection.createOffer();

            await peerConnection.setLocalDescription(
              offer
            );

            socket.emit("offer", {
              meetingId: roomId,
              targetSocketId: socketId,
              offer,
            });
          }
        );

        // -----------------------------
        // Receive offer
        // -----------------------------

        socket.on(
          "offer",
          async ({ socketId, offer }) => {
            console.log(
              "Offer received from:",
              socketId
            );

            const peerConnection =
              createPeerConnection(socketId);

            await peerConnection.setRemoteDescription(
              new RTCSessionDescription(offer)
            );

            const answer =
              await peerConnection.createAnswer();

            await peerConnection.setLocalDescription(
              answer
            );

            socket.emit("answer", {
              meetingId: roomId,
              targetSocketId: socketId,
              answer,
            });
          }
        );

        // -----------------------------
        // Receive answer
        // -----------------------------

        socket.on(
          "answer",
          async ({ socketId, answer }) => {
            console.log(
              "Answer received from:",
              socketId
            );

            const peerConnection =
              peerConnectionsRef.current[
                socketId
              ];

            if (!peerConnection) return;

            await peerConnection.setRemoteDescription(
              new RTCSessionDescription(answer)
            );
          }
        );

        // -----------------------------
        // Receive ICE candidate
        // -----------------------------

        socket.on(
          "ice-candidate",
          async ({ socketId, candidate }) => {
            console.log(
              "ICE candidate received:",
              socketId
            );

            const peerConnection =
              peerConnectionsRef.current[
                socketId
              ];

            if (!peerConnection) return;

            try {
              await peerConnection.addIceCandidate(
                new RTCIceCandidate(candidate)
              );
            } catch (error) {
              console.error(
                "ICE candidate error:",
                error
              );
            }
          }
        );

        // -----------------------------
        // Participant left
        // -----------------------------

        socket.on(
          "user-left",
          ({ socketId }) => {
            console.log(
              "Participant left:",
              socketId
            );

            const peerConnection =
              peerConnectionsRef.current[
                socketId
              ];

            if (peerConnection) {
              peerConnection.close();
            }

            delete peerConnectionsRef.current[
              socketId
            ];

            delete remoteStreamsRef.current[
              socketId
            ];

            setRemoteStreams((prev) =>
              prev.filter(
                (item) => item.id !== socketId
              )
            );
          }
        );
      } catch (error) {
        console.error(
          "Unable to start meeting:",
          error
        );

        alert(
          "Camera/Microphone permission is required."
        );
      }
    };

    startMeeting();

    // -----------------------------
    // Cleanup
    // -----------------------------

    return () => {
      mounted = false;

      if (socketRef.current) {
        socketRef.current.emit(
          "leave-meeting",
          roomId
        );

        socketRef.current.disconnect();
        socketRef.current = null;
      }

      Object.values(
        peerConnectionsRef.current
      ).forEach((connection) => {
        connection.close();
      });

      peerConnectionsRef.current = {};

      if (localStreamRef.current) {
        localStreamRef.current
          .getTracks()
          .forEach((track) => track.stop());

        localStreamRef.current = null;
      }
    };
  }, [roomId]);

  // -----------------------------
  // Toggle microphone
  // -----------------------------

  const toggleMic = () => {
    if (!localStreamRef.current) return;

    const audioTrack =
      localStreamRef.current.getAudioTracks()[0];

    if (!audioTrack) return;

    audioTrack.enabled = !audioTrack.enabled;

    setMicOn(audioTrack.enabled);
  };

  // -----------------------------
  // Toggle camera
  // -----------------------------

  const toggleCamera = () => {
    if (!localStreamRef.current) return;

    const videoTrack =
      localStreamRef.current.getVideoTracks()[0];

    if (!videoTrack) return;

    videoTrack.enabled = !videoTrack.enabled;

    setCameraOn(videoTrack.enabled);
  };

  // -----------------------------
  // Copy meeting link
  // -----------------------------

  const copyMeetingLink = async () => {
    try {
      const link = `${window.location.origin}/meeting/${roomId}`;

      await navigator.clipboard.writeText(link);

      alert("Meeting link copied!");
    } catch (error) {
      console.error(
        "Failed to copy meeting link:",
        error
      );
    }
  };

  // -----------------------------
  // Leave meeting
  // -----------------------------

  const leaveMeeting = () => {
    if (socketRef.current) {
      socketRef.current.emit(
        "leave-meeting",
        roomId
      );

      socketRef.current.disconnect();
    }

    Object.values(
      peerConnectionsRef.current
    ).forEach((connection) => {
      connection.close();
    });

    peerConnectionsRef.current = {};

    if (localStreamRef.current) {
      localStreamRef.current
        .getTracks()
        .forEach((track) => track.stop());
    }

    navigate("/dashboard");
  };

  // -----------------------------
  // Participants
  // -----------------------------

  const participants = [
    {
      id: "local",
      name: "You",
      online: true,
      micOn,
      cameraOn,
      isLocal: true,
      avatarColor: "bg-[#14B8A6]",
    },
    ...remoteStreams.map((participant) => ({
      id: participant.id,
      name: participant.name,
      online: true,
      micOn: true,
      cameraOn: true,
      isLocal: false,
      avatarColor: "bg-blue-500",
    })),
  ];

  return (
    <div className="flex h-screen flex-col bg-[#111827] text-white">

      {/* TOP BAR */}

      <header className="flex items-center justify-between border-b border-white/10 px-6 py-4">

        <div>
          <h1 className="text-lg font-semibold">
            ClassMeet Room
          </h1>

          <p className="mt-1 text-xs text-slate-400">
            Meeting ID: {roomId}
          </p>
        </div>

        <div className="flex items-center gap-3">

          <button
            onClick={copyMeetingLink}
            className="flex items-center gap-2 rounded-lg bg-[#14B8A6] px-4 py-2 text-sm font-semibold hover:bg-[#0F766E]"
          >
            <Copy size={16} />
            Copy Meeting Link
          </button>

          <button
            onClick={() =>
              setShowParticipants(
                (prev) => !prev
              )
            }
            className="flex items-center gap-2 rounded-lg bg-white/10 px-4 py-2 text-sm hover:bg-white/20"
          >
            <Users size={18} />
            Participants
          </button>

          <button
            onClick={() =>
              setShowChat((prev) => !prev)
            }
            className="rounded-lg bg-white/10 p-2.5 hover:bg-white/20"
          >
            <MessageSquare size={19} />
          </button>

          <button className="rounded-lg bg-white/10 p-2.5">
            <MoreVertical size={19} />
          </button>

        </div>
      </header>

      {/* MAIN */}

      <main className="relative flex flex-1 overflow-hidden">

        <div className="flex flex-1 items-center justify-center overflow-auto p-6">

          <div className="w-full max-w-5xl">

            <div className="grid w-full grid-cols-1 gap-4 md:grid-cols-2">

              {/* LOCAL */}

              <VideoTile
                stream={localStream}
                name="You"
                muted={true}
                micOn={micOn}
                cameraOn={cameraOn}
                isLocal={true}
              />

              {/* REMOTE */}

              {remoteStreams.map((participant) => (
                <VideoTile
                  key={participant.id}
                  stream={participant.stream}
                  name={participant.name}
                  muted={false}
                  micOn={true}
                  cameraOn={true}
                  isLocal={false}
                />
              ))}

            </div>

            {remoteStreams.length === 0 && (
              <div className="mt-6 rounded-xl bg-white/5 p-4 text-center text-sm text-slate-400">
                Waiting for another participant...
              </div>
            )}

          </div>

        </div>

        {showParticipants && (
          <ParticipantsPanel
            participants={participants}
            onClose={() =>
              setShowParticipants(false)
            }
          />
        )}

        {showChat && (
          <MeetingChat
            onClose={() =>
              setShowChat(false)
            }
          />
        )}

      </main>

      <MeetingControls
        micOn={micOn}
        cameraOn={cameraOn}
        isSharing={false}
        onToggleMic={toggleMic}
        onToggleCamera={toggleCamera}
        onToggleScreenShare={() => {}}
        onCopyMeetingId={copyMeetingLink}
        onLeaveMeeting={leaveMeeting}
      />

    </div>
  );
}

export default MeetingRoom;