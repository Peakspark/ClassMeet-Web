// WEBRTC MEETING

socket.on("join-meeting", (meetingId) => {
  socket.join(`meeting:${meetingId}`);

  console.log(
    `Socket ${socket.id} joined meeting ${meetingId}`
  );

  // Tell existing participants that a new user joined
  socket.to(`meeting:${meetingId}`).emit(
    "user-joined",
    {
      socketId: socket.id,
    }
  );
});


// WEBRTC OFFER

socket.on(
  "offer",
  ({ meetingId, targetSocketId, offer }) => {

    console.log(
      `Offer from ${socket.id} to ${targetSocketId}`
    );

    io.to(targetSocketId).emit("offer", {
      socketId: socket.id,
      offer,
    });
  }
);


// WEBRTC ANSWER

socket.on(
  "answer",
  ({
    meetingId,
    targetSocketId,
    answer,
  }) => {

    console.log(
      `Answer from ${socket.id} to ${targetSocketId}`
    );

    io.to(targetSocketId).emit("answer", {
      socketId: socket.id,
      answer,
    });
  }
);


// ICE CANDIDATE

socket.on(
  "ice-candidate",
  ({
    meetingId,
    targetSocketId,
    candidate,
  }) => {

    io.to(targetSocketId).emit(
      "ice-candidate",
      {
        socketId: socket.id,
        candidate,
      }
    );
  }
);


// LEAVE MEETING

socket.on(
  "leave-meeting",
  (meetingId) => {

    socket.leave(
      `meeting:${meetingId}`
    );

    socket.to(
      `meeting:${meetingId}`
    ).emit(
      "user-left",
      {
        socketId: socket.id,
      }
    );

    console.log(
      `Socket ${socket.id} left meeting ${meetingId}`
    );
  }
);