const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const fs = require('fs');
const path = require('path');


// 회원가입 (새 유저 생성)
router.post('/', (req, res) => {
  try {
    const userData = req.body;
    const newUser = userController.createUser(userData);
    res.status(201).json(newUser);
  } catch (error) {
    res.status(500).json({ message: 'User creation failed', error: error.toString() });
  }
});

// 특정 유저 조회
router.get('/:userID', (req, res) => {
  try {
    const { userID } = req.params;
    const user = userController.getUserByID(userID);
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ message: 'User not found.' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Failed to get user', error: error.toString() });
  }
});

// 유저 정보 수정 (병합)
router.put('/:userID', (req, res) => {
  try {
    const { userID } = req.params;
    const updatedData = req.body;
    const updatedUser = userController.updateUser(userID, updatedData);
    if (updatedUser) {
      res.json(updatedUser);
    } else {
      res.status(404).json({ message: 'User not found.' });
    }
  } catch (error) {
    res.status(500).json({ message: 'User update failed', error: error.toString() });
  }
});

// 유저 삭제
router.delete('/:userID', (req, res) => {
  try {
    const { userID } = req.params;
    const success = userController.deleteUser(userID);
    if (success) {
      res.json({ message: 'User deleted successfully.' });
    } else {
      res.status(404).json({ message: 'User not found.' });
    }
  } catch (error) {
    res.status(500).json({ message: 'User deletion failed', error: error.toString() });
  }
});

// 로그인 (userEmail + userPW 검증)
router.post('/login', (req, res) => {
  try {
    const { userEmail, userPW } = req.body;
    if (!userEmail || !userPW) {
      return res.status(400).json({ message: 'userEmail과 userPW가 필요합니다.' });
    }

    const usersDir = path.join(__dirname, '..', 'data', 'users');
    const files = fs.readdirSync(usersDir);

    for (const file of files) {
      if (file.endsWith('.json')) {
        const userData = JSON.parse(fs.readFileSync(path.join(usersDir, file), 'utf-8'));

        if (userData.userEmail === userEmail && userData.userPW === userPW) {
          return res.status(200).json(userData);  // 일치하는 유저 반환
        }
      }
    }

    // 아무도 일치하지 않음
    res.status(401).json({ message: '일치하는 유저가 없습니다.' });

  } catch (error) {
    console.error('로그인 에러:', error);
    res.status(500).json({ message: '로그인 중 서버 에러 발생', error: error.toString() });
  }
});

module.exports = router;
