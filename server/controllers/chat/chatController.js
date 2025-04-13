const fs = require('fs');
const path = require('path');

function getChatFilePath(roomID) {
  const chatDir = path.join(__dirname, '../../data/chat');
  if (!fs.existsSync(chatDir)) fs.mkdirSync(chatDir, { recursive: true });
  return path.join(chatDir, `${roomID}.json`);
}

function saveChatMessage(roomID, messageObj) {
  const filePath = getChatFilePath(roomID);
  let chatHistory = [];
  if (fs.existsSync(filePath)) {
    chatHistory = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
  }
  chatHistory.push(messageObj);
  fs.writeFileSync(filePath, JSON.stringify(chatHistory, null, 2));
}

function handleSocketConnection(socket, io) {
  console.log('🟢 New socket connected:', socket.id);

  socket.on('joinRoom', (roomID) => {
    socket.join(roomID);
    console.log(`🟡 ${socket.id} joined room: ${roomID}`);
  });

  socket.on('chatMessage', ({ roomID, userID, message }) => {
    const msgObj = {
      userID,
      message,
      timestamp: new Date().toISOString()
    };

    saveChatMessage(roomID, msgObj);

    // 해당 방에 브로드캐스트
    io.to(roomID).emit('chatMessage', msgObj);
  });

  socket.on('disconnect', () => {
    console.log('🔴 Socket disconnected:', socket.id);
  });
}

module.exports = { handleSocketConnection };
