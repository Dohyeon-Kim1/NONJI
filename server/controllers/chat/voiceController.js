function handleVoiceSocket(socket, io) {
  socket.on('join-room', (roomID) => {
    socket.join(roomID);
    console.log(`🔊 ${socket.id} joined voice room: ${roomID}`);
  });

  socket.on('offer', ({ roomID, offer }) => {
    socket.to(roomID).emit('offer', { offer });
  });

  socket.on('answer', ({ roomID, answer }) => {
    socket.to(roomID).emit('answer', { answer });
  });

  socket.on('candidate', ({ roomID, candidate }) => {
    socket.to(roomID).emit('candidate', { candidate });
  });
}

module.exports = { handleVoiceSocket };
