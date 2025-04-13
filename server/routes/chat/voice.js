const express = require('express');
const path = require('path');
const router = express.Router();

// ✅ /voice → /voice/default 로 자동 이동
router.get('/', (req, res) => {
  res.redirect('/voice/default');
});

// ✅ 실제 음성채팅 방 페이지
router.get('/:roomID', (req, res) => {
  res.sendFile(path.join(__dirname, '../../public/voice.html'));
});

module.exports = router;
