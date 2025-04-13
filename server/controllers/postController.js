const path = require('path');
const { readJSON, writeJSON, deleteJSON, fileExists } = require('../utils/fileManager');
const { generateID } = require('../utils/idGenerator');

const POSTS_DIR = path.join(__dirname, '..', 'data', 'posts');

// 새 게시글 생성
function createPost(postData) {
  if (!postData.postID) {
    postData.postID = generateID('post_');
  }
  const filePath = path.join(POSTS_DIR, `${postData.postID}.json`);
  // 생성 및 수정일 설정
  if (!postData.createdDate) {
    postData.createdDate = new Date().toISOString();
  }
  postData.updatedDate = postData.createdDate;
  writeJSON(filePath, postData);
  return postData;
}

// 게시글ID로 게시글 조회
function getPostByID(postID) {
  const filePath = path.join(POSTS_DIR, `${postID}.json`);
  return readJSON(filePath);
}

// 게시글 업데이트
function updatePost(postID, updatedData) {
  const filePath = path.join(POSTS_DIR, `${postID}.json`);
  const existingData = readJSON(filePath);
  if (!existingData) return null;
  const newData = { ...existingData, ...updatedData, updatedDate: new Date().toISOString() };
  writeJSON(filePath, newData);
  return newData;
}

// 게시글 삭제
function deletePost(postID) {
  const filePath = path.join(POSTS_DIR, `${postID}.json`);
  if (fileExists(filePath)) {
    deleteJSON(filePath);
    return true;
  }
  return false;
}

module.exports = {
  createPost,
  getPostByID,
  updatePost,
  deletePost
};
