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
import API_URL from "../api/api";

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
  const remoteStreamsRef = useRef({});
  const pendingIceCandidatesRef = useRef({});

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

    // -------------------------
    // Add local tracks
    // -------------------------

    if (localStreamRef.current) {
      localStreamRef.current
        .getTracks()
        .forEach((track) => {
          peerConnection.addTrack(
            track,
            localStreamRef.current
          );
        });
    }

    // -------------------------
    // Receive remote tracks
    // -------------------------

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

    // -------------------------
    // ICE candidate
    // -------------------------

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

  // =========================
  // START MEETING
  // =========================

  useEffect(() => {
    let mounted = true;

    const startMeeting = async () => {
      try {
        console.log(
          "Starting meeting:",
          roomId
        );

        // -------------------------
        // Camera + microphone
        // -------------------------

        const stream =
          await navigator.mediaDevices.getUserMedia({
            video: true,
            audio: true,
          });

        if (!mounted) {
          stream
            .getTracks()
            .forEach((track) => track.stop());

          return;
        }

        localStreamRef.current = stream;

        setLocalStream(stream);

        setMicOn(true);
        setCameraOn(true);

        console.log(
          "Camera/microphone ready"
        );

        // -------------------------
        // Optional meeting validation
        // -------------------------

        try {
          const response = await fetch(
            `${API_URL}/api/meetings/join/${roomId}`,
            {
              method: "GET",
              credentials: "include",
            }
          );

          const data = await response.json();

          console.log(
            "Meeting information:",
            data
          );

          /*
           * Don't block WebRTC if the backend
           * validation endpoint isn't available.
           *
           * This keeps the currently working
           * video call functional.
           */

          if (!response.ok) {
            console.warn(
              "Meeting validation failed:",
              data.message
            );
          }
        } catch (error) {
          console.warn(
            "Meeting validation request failed:",
            error
          );
        }

        // -------------------------
        // Socket.IO
        // -------------------------

        const socket = io(SOCKET_URL, {
          transports: ["websocket", "polling"],
          withCredentials: true,
        });

        socketRef.current = socket;

        // -------------------------
        // Socket connected
        // -------------------------

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

        // -------------------------
        // USER JOINED
        // -------------------------

        socket.on(
          "user-joined",
          async ({ socketId }) => {
            try {
              console.log(
                "New participant:",
                socketId
              );

              const peerConnection =
                createPeerConnection(
                  socketId
                );

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
            } catch (error) {
              console.error(
                "Offer creation error:",
                error
              );
            }
          }
        );

        // -------------------------
        // RECEIVE OFFER
        // -------------------------

        socket.on(
          "offer",
          async ({ socketId, offer }) => {
            try {
              console.log(
                "Offer received from:",
                socketId
              );

              const peerConnection =
                createPeerConnection(
                  socketId
                );

              await peerConnection.setRemoteDescription(
                new RTCSessionDescription(
                  offer
                )
              );

              // Add pending ICE candidates
              const pending =
                pendingIceCandidatesRef.current[
                  socketId
                ] || [];

              for (const candidate of pending) {
                try {
                  await peerConnection.addIceCandidate(
                    candidate
                  );
                } catch (error) {
                  console.error(
                    "Pending ICE error:",
                    error
                  );
                }
              }

              delete pendingIceCandidatesRef.current[
                socketId
              ];

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
            } catch (error) {
              console.error(
                "Offer handling error:",
                error
              );
            }
          }
        );

        // -------------------------
        // RECEIVE ANSWER
        // -------------------------

        socket.on(
          "answer",
          async ({ socketId, answer }) => {
            try {
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
                new RTCSessionDescription(
                  answer
                )
              );

              const pending =
                pendingIceCandidatesRef.current[
                  socketId
                ] || [];

              for (const candidate of pending) {
                try {
                  await peerConnection.addIceCandidate(
                    candidate
                  );
                } catch (error) {
                  console.error(
                    "Pending ICE error:",
                    error
                  );
                }
              }

              delete pendingIceCandidatesRef.current[
                socketId
              ];
            } catch (error) {
              console.error(
                "Answer handling error:",
                error
              );
            }
          }
        );

        // -------------------------
        // RECEIVE ICE
        // -------------------------

        socket.on(
          "ice-candidate",
          async ({
            socketId,
            candidate,
          }) => {
            try {
              const peerConnection =
                peerConnectionsRef.current[
                  socketId
                ];

              if (!peerConnection) {
                return;
              }

              const iceCandidate =
                new RTCIceCandidate(
                  candidate
                );

              /*
               * If remote description isn't ready,
               * save candidate for later.
               */

              if (
                !peerConnection.remoteDescription
              ) {
                if (
                  !pendingIceCandidatesRef
                    .current[socketId]
                ) {
                  pendingIceCandidatesRef.current[
                    socketId
                  ] = [];
                }

                pendingIceCandidatesRef.current[
                  socketId
                ].push(iceCandidate);

                return;
              }

              await peerConnection.addIceCandidate(
                iceCandidate
              );
            } catch (error) {
              console.error(
                "ICE candidate error:",
                error
              );
            }
          }
        );

        // -------------------------
        // USER LEFT
        // -------------------------

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

            delete pendingIceCandidatesRef.current[
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

        socket.on("disconnect", () => {
          console.log(
            "Socket disconnected"
          );
        });
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
      ).forEach((connection) => {
        connection.close();
      });

      peerConnectionsRef.current = {};

      pendingIceCandidatesRef.current = {};

      remoteStreamsRef.current = {};

      if (localStreamRef.current) {
        localStreamRef.current
          .getTracks()
          .forEach((track) => track.stop());

        localStreamRef.current = null;
      }
    };
  }, [roomId]);

  // =========================
  // TOGGLE MICROPHONE
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
  // TOGGLE CAMERA
  // =========================

  const toggleCamera = async () => {
    const stream =
      localStreamRef.current;

    if (!stream) return;

    let videoTrack =
      stream.getVideoTracks()[0];

    // -------------------------
    // CAMERA CURRENTLY ON
    // Turn it OFF
    // -------------------------

    if (videoTrack && videoTrack.enabled) {
      videoTrack.enabled = false;

      setCameraOn(false);

      return;
    }

    // -------------------------
    // CAMERA CURRENTLY OFF
    // Turn it ON
    // -------------------------

    try {
      /*
       * If the existing track still exists,
       * simply enable it.
       */

      if (
        videoTrack &&
        videoTrack.readyState === "live"
      ) {
        videoTrack.enabled = true;

        setCameraOn(true);

        return;
      }

      /*
       * If the old camera track ended,
       * request a completely new camera track.
       */

      const newStream =
        await navigator.mediaDevices.getUserMedia(
          {
            video: true,
          }
        );

      const newVideoTrack =
        newStream.getVideoTracks()[0];

      if (!newVideoTrack) {
        throw new Error(
          "Camera track could not be created"
        );
      }

      /*
       * Add new track to local stream.
       */

      if (localStreamRef.current) {
        localStreamRef.current.addTrack(
          newVideoTrack
        );
      } else {
        localStreamRef.current =
          newStream;

        setLocalStream(newStream);

        return;
      }

      /*
       * Replace the old camera track
       * inside every WebRTC connection.
       */

      for (const peerConnection of Object.values(
        peerConnectionsRef.current
      )) {
        const sender =
          peerConnection
            .getSenders()
            .find(
              (s) =>
                s.track &&
                s.track.kind ===
                  "video"
            );

        if (sender) {
          await sender.replaceTrack(
            newVideoTrack
          );
        } else {
          peerConnection.addTrack(
            newVideoTrack,
            localStreamRef.current
          );
        }
      }

      /*
       * Stop old track if necessary.
       */

      if (
        videoTrack &&
        videoTrack !== newVideoTrack
      ) {
        videoTrack.stop();
      }

      setLocalStream(
        localStreamRef.current
      );

      setCameraOn(true);

      console.log(
        "Camera restarted successfully"
      );
    } catch (error) {
      console.error(
        "Unable to restart camera:",
        error
      );

      setCameraOn(false);

      alert(
        "Unable to turn on camera. Please check camera permission."
      );
    }
  };

  // =========================
  // COPY MEETING LINK
  // =========================

  const copyMeetingLink = async () => {
    try {
      const link =
        `${window.location.origin}/meeting/${roomId}`;

      await navigator.clipboard.writeText(
        link
      );

      alert(
        "Meeting link copied!"
      );
    } catch (error) {
      console.error(
        "Failed to copy meeting link:",
        error
      );
    }
  };

  // =========================
  // LEAVE MEETING
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
        avatarColor: "bg-blue-500",
      })
    ),
  ];

  // =========================
  // UI
  // =========================

  return (
    <div className="flex h-screen flex-col bg-[#111827] text-white">

      {/* =========================
          TOP BAR
      ========================= */}

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

          {/* COPY LINK */}

          <button
            onClick={copyMeetingLink}
            className="flex items-center gap-2 rounded-lg bg-[#14B8A6] px-4 py-2 text-sm font-semibold hover:bg-[#0F766E]"
          >
            <Copy size={16} />

            Copy Meeting Link
          </button>

          {/* PARTICIPANTS */}

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

          {/* CHAT */}

          <button
            onClick={() =>
              setShowChat(
                (prev) => !prev
              )
            }
            className="rounded-lg bg-white/10 p-2.5 hover:bg-white/20"
          >
            <MessageSquare size={19} />
          </button>

          {/* MORE */}

          <button className="rounded-lg bg-white/10 p-2.5">
            <MoreVertical size={19} />
          </button>

        </div>
      </header>

      {/* =========================
          MAIN
      ========================= */}

      <main className="relative flex flex-1 overflow-hidden">

        <div className="flex flex-1 items-center justify-center overflow-auto p-6">

          <div className="w-full max-w-5xl">

            <div className="grid w-full grid-cols-1 gap-4 md:grid-cols-2">

              {/* LOCAL VIDEO */}

              <VideoTile
                stream={localStream}
                name="You"
                muted={true}
                micOn={micOn}
                cameraOn={cameraOn}
                isLocal={true}
              />

              {/* REMOTE VIDEOS */}

              {remoteStreams.map(
                (participant) => (
                  <VideoTile
                    key={participant.id}
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

      {/* =========================
          CONTROLS
      ========================= */}

      <MeetingControls
        micOn={micOn}
        cameraOn={cameraOn}
        isSharing={false}
        onToggleMic={toggleMic}
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