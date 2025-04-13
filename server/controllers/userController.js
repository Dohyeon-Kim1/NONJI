const path = require('path');
const { readJSON, writeJSON, deleteJSON, fileExists } = require('../utils/fileManager');
const { generateID } = require('../utils/idGenerator');

const USERS_DIR = path.join(__dirname, '..', 'data', 'users');

// 새 유저 생성
function createUser(userData) {
  // userID가 없으면 생성
  if (!userData.userID) {
    userData.userID = generateID('user_');
  }
  const filePath = path.join(USERS_DIR, `${userData.userID}.json`);
  // 기본 가입일 기록 (필요에 따라 추가)
  if (!userData.signupDate) {
    userData.signupDate = new Date().toISOString();
  }
  writeJSON(filePath, userData);
  return userData;
}

// 유저ID로 유저 정보 조회
function getUserByID(userID) {
  const filePath = path.join(USERS_DIR, `${userID}.json`);
  return readJSON(filePath);
}

// 유저 정보 업데이트 (병합)
function updateUser(userID, updatedData) {
  const filePath = path.join(USERS_DIR, `${userID}.json`);
  const existingData = readJSON(filePath);
  if (!existingData) {
    return null;
  }
  const newData = { ...existingData, ...updatedData };
  writeJSON(filePath, newData);
  return newData;
}

// 유저 삭제
function deleteUser(userID) {
  const filePath = path.join(USERS_DIR, `${userID}.json`);
  if (fileExists(filePath)) {
    deleteJSON(filePath);
    return true;
  }
  return false;
}

module.exports = {
  createUser,
  getUserByID,
  updateUser,
  deleteUser
};
