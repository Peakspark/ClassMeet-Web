export const initializeSocket = (io) => {
  io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    // WORKSPACE

    // Join workspace
    socket.on("join-workspace", (workspaceId) => {
      socket.join(`workspace:${workspaceId}`);

      socket.to(`workspace:${workspaceId}`).emit("user-joined", {
        socketId: socket.id,
      });

      console.log(`Socket ${socket.id} joined workspace ${workspaceId}`);
    });

    // Leave workspace
    socket.on("leave-workspace", (workspaceId) => {
      socket.leave(`workspace:${workspaceId}`);

      console.log(`Socket ${socket.id} left workspace ${workspaceId}`);
    });

    // REAL-TIME MESSAGING

    socket.on("send-message", ({ workspaceId, message }) => {
      io.to(`workspace:${workspaceId}`).emit("receive-message", {
        message,
        sender: socket.id,
      });
    });
    // PRESENCE


    socket.on("user-online", ({ workspaceId, userId }) => {
      socket.join(`workspace:${workspaceId}`);

      io.to(`workspace:${workspaceId}`).emit("presence-update", {
        userId,
        status: "online",
      });
    });

    // WEBRTC MEETING

    // Join meeting
    socket.on("join-meeting", (meetingId) => {
      socket.join(`meeting:${meetingId}`);

      socket.to(`meeting:${meetingId}`).emit("user-joined", {
        socketId: socket.id,
      });

      console.log(`Socket ${socket.id} joined meeting ${meetingId}`);
    });

    // WebRTC Offer
    socket.on("offer", ({ meetingId, offer }) => {
      socket.to(`meeting:${meetingId}`).emit("offer", {
        socketId: socket.id,
        offer,
      });
    });

    // WebRTC Answer
    socket.on("answer", ({ meetingId, answer, targetSocketId }) => {
      io.to(targetSocketId).emit("answer", {
        socketId: socket.id,
        answer,
      });
    });

    // ICE Candidate
    socket.on("ice-candidate", ({ meetingId, candidate }) => {
      socket.to(`meeting:${meetingId}`).emit("ice-candidate", {
        socketId: socket.id,
        candidate,
      });
    });

    // SCREEN SHARING

    // Screen sharing started
    socket.on("screen-share-started", ({ meetingId }) => {
      socket.to(`meeting:${meetingId}`).emit("screen-share-started", {
        socketId: socket.id,
      });
    });

    // Screen sharing stopped
    socket.on("screen-share-stopped", ({ meetingId }) => {
      socket.to(`meeting:${meetingId}`).emit("screen-share-stopped", {
        socketId: socket.id,
      });
    });

    // LEAVE MEETING

    socket.on("leave-meeting", (meetingId) => {
      socket.leave(`meeting:${meetingId}`);

      socket.to(`meeting:${meetingId}`).emit("user-left", {
        socketId: socket.id,
      });

      console.log(`Socket ${socket.id} left meeting ${meetingId}`);
    });

    // DISCONNECT

    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);
    });
  });
};