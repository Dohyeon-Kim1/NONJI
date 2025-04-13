const path = require('path');
const { readJSON, writeJSON, deleteJSON, fileExists } = require('../utils/fileManager');
const { generateID } = require('../utils/idGenerator');

const NOTIFICATIONS_DIR = path.join(__dirname, '..', 'data', 'notifications');

// 새 알림 생성
function createNotification(notificationData) {
  if (!notificationData.notificationID) {
    notificationData.notificationID = generateID('noti_');
  }
  const filePath = path.join(NOTIFICATIONS_DIR, `${notificationData.notificationID}.json`);
  if (!notificationData.createdDate) {
    notificationData.createdDate = new Date().toISOString();
  }
  writeJSON(filePath, notificationData);
  return notificationData;
}

// 알림 ID로 알림 조회
function getNotificationByID(notificationID) {
  const filePath = path.join(NOTIFICATIONS_DIR, `${notificationID}.json`);
  return readJSON(filePath);
}

// 알림 업데이트
function updateNotification(notificationID, updatedData) {
  const filePath = path.join(NOTIFICATIONS_DIR, `${notificationID}.json`);
  const existingData = readJSON(filePath);
  if (!existingData) return null;
  const newData = { ...existingData, ...updatedData };
  writeJSON(filePath, newData);
  return newData;
}

// 알림 삭제
function deleteNotification(notificationID) {
  const filePath = path.join(NOTIFICATIONS_DIR, `${notificationID}.json`);
  if (fileExists(filePath)) {
    deleteJSON(filePath);
    return true;
  }
  return false;
}

module.exports = {
  createNotification,
  getNotificationByID,
  updateNotification,
  deleteNotification
};
