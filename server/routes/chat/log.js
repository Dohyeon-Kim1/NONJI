const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();

// GET /api/chat/log/:chatID → /data/chat/{chatID}.json 파일 읽기
router.get('/:chatID', (req, res) => {
  const chatID = req.params.chatID;
  const filePath = path.join(__dirname, '../../data/chat', `${chatID}.json`);

  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ message: 'Chat log not found' });
  }

  try {
    const data = fs.readFileSync(filePath, 'utf-8');
    const json = JSON.parse(data);
    res.json(json);
  } catch (err) {
    res.status(500).json({ message: '채팅 로그 파싱 오류', error: err.toString() });
  }
});

module.exports = router;
