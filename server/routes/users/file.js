const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();

// GET /api/users/file/:uuid → /data/users/user_{uuid}.json 파일 반환
router.get('/:uuid', (req, res) => {
  const uuid = req.params.uuid;
  const filePath = path.join(__dirname, '../../data/users', `user_${uuid}.json`);

  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ message: 'User file not found' });
  }

  try {
    const data = fs.readFileSync(filePath, 'utf-8');
    const json = JSON.parse(data);
    res.json(json);
  } catch (err) {
    res.status(500).json({ message: '유저 파일 파싱 오류', error: err.toString() });
  }
});

module.exports = router;
