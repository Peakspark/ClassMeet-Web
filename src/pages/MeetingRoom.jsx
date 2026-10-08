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

  // =========================
  // REFS
  // =========================

  const socketRef = useRef(null);
  const localStreamRef = useRef(null);
  const peerConnectionsRef = useRef({});

  // =========================
  // STATE
  // =========================

  const [localStream, setLocalStream] = useState(null);
  const [remoteStreams, setRemoteStreams] = useState([]);

  const [micOn, setMicOn] = useState(true);
  const [cameraOn, setCameraOn] = useState(true);

  const [showParticipants, setShowParticipants] =
    useState(false);

  const [showChat, setShowChat] = useState(false);

  // =========================
  // CREATE PEER CONNECTION
  // =========================

  const createPeerConnection = (socketId) => {
    if (peerConnectionsRef.current[socketId]) {
      return peerConnectionsRef.current[socketId];
    }

    const peer = new RTCPeerConnection({
      iceServers: [
        {
          urls: "stun:stun.l.google.com:19302",
        },
        {
          urls: "stun:stun1.l.google.com:19302",
        },
      ],
    });

    // Add local camera + microphone
    if (localStreamRef.current) {
      localStreamRef.current
        .getTracks()
        .forEach((track) => {
          peer.addTrack(
            track,
            localStreamRef.current
          );
        });
    }

    // Receive remote camera + microphone
    peer.ontrack = (event) => {
      const stream = event.streams[0];

      if (!stream) return;

      setRemoteStreams((prev) => {
        const existing = prev.find(
          (item) => item.id === socketId
        );

        if (existing) {
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

    // ICE candidates
    peer.onicecandidate = (event) => {
      if (!event.candidate) return;

      socketRef.current?.emit(
        "ice-candidate",
        {
          meetingId: roomId,
          targetSocketId: socketId,
          candidate: event.candidate,
        }
      );
    };

    peerConnectionsRef.current[socketId] =
      peer;

    return peer;
  };

  // =========================
  // START MEETING
  // =========================

  useEffect(() => {
    let mounted = true;

    const startMeeting = async () => {
      try {
        // Camera + microphone
        const stream =
          await navigator.mediaDevices.getUserMedia(
            {
              video: true,
              audio: true,
            }
          );

        if (!mounted) {
          stream
            .getTracks()
            .forEach((track) =>
              track.stop()
            );

          return;
        }

        localStreamRef.current = stream;

        setLocalStream(stream);
        setMicOn(true);
        setCameraOn(true);

        console.log(
          "Camera and microphone ready"
        );

        // =========================
        // CONNECT SOCKET
        // =========================

        const socket = io(SOCKET_URL, {
          transports: [
            "websocket",
            "polling",
          ],
        });

        socketRef.current = socket;

        // =========================
        // SOCKET CONNECTED
        // =========================

        socket.on("connect", () => {
          console.log(
            "Socket connected:",
            socket.id
          );

          socket.emit(
            "join-meeting",
            roomId
          );
        });

        // =========================
        // NEW USER JOINED
        // =========================

        socket.on(
          "user-joined",
          async ({ socketId }) => {
            try {
              console.log(
                "User joined:",
                socketId
              );

              const peer =
                createPeerConnection(
                  socketId
                );

              const offer =
                await peer.createOffer();

              await peer.setLocalDescription(
                offer
              );

              socket.emit("offer", {
                meetingId: roomId,
                targetSocketId:
                  socketId,
                offer,
              });
            } catch (error) {
              console.error(
                "Offer error:",
                error
              );
            }
          }
        );

        // =========================
        // RECEIVE OFFER
        // =========================

        socket.on(
          "offer",
          async ({
            socketId,
            offer,
          }) => {
            try {
              console.log(
                "Offer received:",
                socketId
              );

              const peer =
                createPeerConnection(
                  socketId
                );

              await peer.setRemoteDescription(
                new RTCSessionDescription(
                  offer
                )
              );

              const answer =
                await peer.createAnswer();

              await peer.setLocalDescription(
                answer
              );

              socket.emit("answer", {
                meetingId: roomId,
                targetSocketId:
                  socketId,
                answer,
              });
            } catch (error) {
              console.error(
                "Answer error:",
                error
              );
            }
          }
        );

        // =========================
        // RECEIVE ANSWER
        // =========================

        socket.on(
          "answer",
          async ({
            socketId,
            answer,
          }) => {
            try {
              const peer =
                peerConnectionsRef.current[
                  socketId
                ];

              if (!peer) return;

              await peer.setRemoteDescription(
                new RTCSessionDescription(
                  answer
                )
              );
            } catch (error) {
              console.error(
                "Remote description error:",
                error
              );
            }
          }
        );

        // =========================
        // RECEIVE ICE
        // =========================

        socket.on(
          "ice-candidate",
          async ({
            socketId,
            candidate,
          }) => {
            try {
              const peer =
                peerConnectionsRef.current[
                  socketId
                ];

              if (!peer) return;

              if (
                !peer.remoteDescription
              ) {
                return;
              }

              await peer.addIceCandidate(
                new RTCIceCandidate(
                  candidate
                )
              );
            } catch (error) {
              console.error(
                "ICE error:",
                error
              );
            }
          }
        );

        // =========================
        // USER LEFT
        // =========================

        socket.on(
          "user-left",
          ({ socketId }) => {
            console.log(
              "User left:",
              socketId
            );

            const peer =
              peerConnectionsRef.current[
                socketId
              ];

            if (peer) {
              peer.close();
            }

            delete peerConnectionsRef.current[
              socketId
            ];

            setRemoteStreams((prev) =>
              prev.filter(
                (item) =>
                  item.id !== socketId
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
          "Please allow camera and microphone access."
        );
      }
    };

    startMeeting();

    // =========================
    // CLEANUP
    // =========================

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
      ).forEach((peer) => {
        peer.close();
      });

      peerConnectionsRef.current = {};

      if (localStreamRef.current) {
        localStreamRef.current
          .getTracks()
          .forEach((track) =>
            track.stop()
          );

        localStreamRef.current = null;
      }
    };
  }, [roomId]);

  // =========================
  // MICROPHONE
  // =========================

  const toggleMic = () => {
    const stream =
      localStreamRef.current;

    if (!stream) return;

    const audioTrack =
      stream.getAudioTracks()[0];

    if (!audioTrack) return;

    audioTrack.enabled =
      !audioTrack.enabled;

    setMicOn(audioTrack.enabled);
  };

  // =========================
  // CAMERA
  // =========================

  const toggleCamera = async () => {
    const stream =
      localStreamRef.current;

    if (!stream) return;

    const videoTrack =
      stream.getVideoTracks()[0];

    if (!videoTrack) return;

    // CAMERA OFF
    if (videoTrack.enabled) {
      videoTrack.enabled = false;

      setCameraOn(false);

      return;
    }

    // CAMERA ON
    if (
      videoTrack.readyState === "live"
    ) {
      videoTrack.enabled = true;

      setCameraOn(true);

      return;
    }

    // Camera track ended
    try {
      const newStream =
        await navigator.mediaDevices.getUserMedia(
          {
            video: true,
          }
        );

      const newTrack =
        newStream.getVideoTracks()[0];

      if (!newTrack) return;

      // Add new track
      stream.addTrack(newTrack);

      // Replace track in WebRTC
      for (const peer of Object.values(
        peerConnectionsRef.current
      )) {
        const sender =
          peer
            .getSenders()
            .find(
              (s) =>
                s.track?.kind ===
                "video"
            );

        if (sender) {
          await sender.replaceTrack(
            newTrack
          );
        }
      }

      videoTrack.stop();

      setLocalStream(stream);
      setCameraOn(true);

      console.log(
        "Camera restarted"
      );
    } catch (error) {
      console.error(
        "Camera restart failed:",
        error
      );

      alert(
        "Could not turn camera on."
      );
    }
  };

  // =========================
  // COPY LINK
  // =========================

  const copyMeetingLink = async () => {
    const link =
      `${window.location.origin}/meeting/${roomId}`;

    try {
      await navigator.clipboard.writeText(
        link
      );

      alert(
        "Meeting link copied!"
      );
    } catch (error) {
      console.error(
        "Copy failed:",
        error
      );
    }
  };

  // =========================
  // LEAVE
  // =========================

  const leaveMeeting = () => {
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
    ).forEach((peer) => {
      peer.close();
    });

    peerConnectionsRef.current = {};

    if (localStreamRef.current) {
      localStreamRef.current
        .getTracks()
        .forEach((track) =>
          track.stop()
        );

      localStreamRef.current = null;
    }

    navigate("/dashboard");
  };

  // =========================
  // PARTICIPANTS
  // =========================

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

    ...remoteStreams.map(
      (participant) => ({
        id: participant.id,
        name: participant.name,
        online: true,
        micOn: true,
        cameraOn: true,
        isLocal: false,
        avatarColor:
          "bg-blue-500",
      })
    ),
  ];

  // =========================
  // UI
  // =========================

  return (
    <div className="flex h-screen flex-col bg-[#111827] text-white">

      {/* HEADER */}

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
            onClick={
              copyMeetingLink
            }
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
              setShowChat(
                (prev) => !prev
              )
            }
            className="rounded-lg bg-white/10 p-2.5 hover:bg-white/20"
          >
            <MessageSquare
              size={19}
            />
          </button>

          <button className="rounded-lg bg-white/10 p-2.5">
            <MoreVertical
              size={19}
            />
          </button>

        </div>

      </header>

      {/* MAIN */}

      <main className="relative flex flex-1 overflow-hidden">

        <div className="flex flex-1 items-center justify-center overflow-auto p-6">

          <div className="w-full max-w-5xl">

            <div className="grid w-full grid-cols-1 gap-4 md:grid-cols-2">

              {/* MY VIDEO */}

              <VideoTile
                stream={localStream}
                name="You"
                muted={true}
                micOn={micOn}
                cameraOn={cameraOn}
                isLocal={true}
              />

              {/* REAL PARTICIPANTS ONLY */}

              {remoteStreams.map(
                (participant) => (
                  <VideoTile
                    key={
                      participant.id
                    }
                    stream={
                      participant.stream
                    }
                    name={
                      participant.name
                    }
                    muted={false}
                    micOn={true}
                    cameraOn={true}
                    isLocal={false}
                  />
                )
              )}

            </div>

            {remoteStreams.length ===
              0 && (
              <div className="mt-6 rounded-xl bg-white/5 p-4 text-center text-sm text-slate-400">
                Waiting for another participant...
              </div>
            )}

          </div>

        </div>

        {/* PARTICIPANTS */}

        {showParticipants && (
          <ParticipantsPanel
            participants={
              participants
            }
            onClose={() =>
              setShowParticipants(
                false
              )
            }
          />
        )}

        {/* CHAT */}

        {showChat && (
          <MeetingChat
            onClose={() =>
              setShowChat(false)
            }
          />
        )}

      </main>

      {/* CONTROLS */}

      <MeetingControls
        micOn={micOn}
        cameraOn={cameraOn}
        isSharing={false}
        onToggleMic={
          toggleMic
        }
        onToggleCamera={
          toggleCamera
        }
        onToggleScreenShare={() => {}}
        onCopyMeetingId={
          copyMeetingLink
        }
        onLeaveMeeting={
          leaveMeeting
        }
      />

    </div>
  );
}

export default MeetingRoom;