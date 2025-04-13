const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const http = require('http');
const { Server } = require('socket.io');
const fs = require('fs');

// API 라우터
const userRoutes = require('./routes/users');
const postRoutes = require('./routes/posts');
const commentRoutes = require('./routes/comments');
const notificationRoutes = require('./routes/notifications');
const chatRoutes = require('./routes/chat/chat');
const voiceRoutes = require('./routes/chat/voice');
const chatLogRoutes = require('./routes/chat/log');
const userFileRoutes = require('./routes/users/file');

// Socket 핸들러
const { handleSocketConnection } = require('./controllers/chat/chatController');
const { handleVoiceSocket } = require('./controllers/chat/voiceController');

// Express + HTTP + Socket.IO 서버 구성
const app = express();
const server = http.createServer(app);
const io = new Server(server);

const PORT = process.env.PORT || 3000;

// ===== 요청 로깅 =====
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
  next();
});

// ===== JSON 파싱 및 로깅 =====
app.use(bodyParser.json());
app.use((req, res, next) => {
  if (['POST', 'PUT'].includes(req.method)) {
    console.log(`→ 요청 body:`, req.body);
  }
  next();
});

// ===== 정적 파일 제공 =====
app.use(express.static(path.join(__dirname, 'public')));

// ===== API 라우터 등록 =====
app.use('/api/users', userRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/users/file', userFileRoutes);
app.use('/api/chat/log', chatLogRoutes); // ✅ 추가

// ===== 실시간 채팅 라우터 =====
app.use('/chat', chatRoutes);
app.use('/voice', voiceRoutes);

// ===== 기본 루트 =====
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// ===== 404 에러 핸들링 =====
app.use((req, res, next) => {
  console.warn(`[404] ${req.originalUrl} - 경로를 찾을 수 없습니다.`);
  res.status(404).json({ message: '404: Not Found' });
});

// ===== 전역 에러 핸들링 =====
app.use((err, req, res, next) => {
  console.error('💥 Global error handler:');
  console.error(err.stack);
  res.status(500).json({ message: '500: Internal Server Error', error: err.toString() });
});

// ===== Socket.IO 연결 처리 =====
io.on('connection', (socket) => {
  handleSocketConnection(socket, io);
  handleVoiceSocket(socket, io);
});

// ===== 서버 실행 =====
server.listen(PORT, () => {
  console.log(`✅ Server is running on http://localhost:${PORT}`);
});



// recom_paper에는 그냥 search input에서 쏴주는 str만 넘겨주면 되고

// recom_people에는 i) 해시태그(userDB에 있는거) ii) [id] <- 이거는 flask에 있음