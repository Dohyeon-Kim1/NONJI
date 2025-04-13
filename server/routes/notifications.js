const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notificationController');

// 새 알림 생성
router.post('/', (req, res) => {
  try {
    const notificationData = req.body;
    const newNotification = notificationController.createNotification(notificationData);
    res.status(201).json(newNotification);
  } catch (error) {
    res.status(500).json({ message: 'Notification creation failed', error: error.toString() });
  }
});

// 특정 알림 조회
router.get('/:notificationID', (req, res) => {
  try {
    const { notificationID } = req.params;
    const notification = notificationController.getNotificationByID(notificationID);
    if (notification) {
      res.json(notification);
    } else {
      res.status(404).json({ message: 'Notification not found.' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Failed to get notification', error: error.toString() });
  }
});

// 알림 업데이트
router.put('/:notificationID', (req, res) => {
  try {
    const { notificationID } = req.params;
    const updatedData = req.body;
    const updatedNotification = notificationController.updateNotification(notificationID, updatedData);
    if (updatedNotification) {
      res.json(updatedNotification);
    } else {
      res.status(404).json({ message: 'Notification not found.' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Notification update failed', error: error.toString() });
  }
});

// 알림 삭제
router.delete('/:notificationID', (req, res) => {
  try {
    const { notificationID } = req.params;
    const success = notificationController.deleteNotification(notificationID);
    if (success) {
      res.json({ message: 'Notification deleted successfully.' });
    } else {
      res.status(404).json({ message: 'Notification not found.' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Notification deletion failed', error: error.toString() });
  }
});

module.exports = router;
