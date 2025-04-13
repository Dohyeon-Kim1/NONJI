const path = require('path');
const { readJSON, writeJSON, deleteJSON, fileExists } = require('../utils/fileManager');
const { generateID } = require('../utils/idGenerator');

const COMMENTS_DIR = path.join(__dirname, '..', 'data', 'comments');

// 새 댓글 생성
function createComment(commentData) {
  if (!commentData.commentID) {
    commentData.commentID = generateID('comment_');
  }
  const filePath = path.join(COMMENTS_DIR, `${commentData.commentID}.json`);
  if (!commentData.createdDate) {
    commentData.createdDate = new Date().toISOString();
  }
  writeJSON(filePath, commentData);
  return commentData;
}

// 댓글 ID로 댓글 조회
function getCommentByID(commentID) {
  const filePath = path.join(COMMENTS_DIR, `${commentID}.json`);
  return readJSON(filePath);
}

// 댓글 업데이트
function updateComment(commentID, updatedData) {
  const filePath = path.join(COMMENTS_DIR, `${commentID}.json`);
  const existingData = readJSON(filePath);
  if (!existingData) return null;
  const newData = { ...existingData, ...updatedData };
  writeJSON(filePath, newData);
  return newData;
}

// 댓글 삭제
function deleteComment(commentID) {
  const filePath = path.join(COMMENTS_DIR, `${commentID}.json`);
  if (fileExists(filePath)) {
    deleteJSON(filePath);
    return true;
  }
  return false;
}

module.exports = {
  createComment,
  getCommentByID,
  updateComment,
  deleteComment
};
