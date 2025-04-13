const express = require('express');
const router = express.Router();
const path = require('path');

// 단순히 채팅 페이지를 보여주는 라우트 (필요하면)
router.get('/:roomID', (req, res) => {
  res.sendFile(path.join(__dirname, '../../public/chat.html'));
});

module.exports = router;
