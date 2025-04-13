const express = require('express');
const router = express.Router();
const commentController = require('../controllers/commentController');

// 새 댓글 생성
router.post('/', (req, res) => {
  try {
    const commentData = req.body;
    const newComment = commentController.createComment(commentData);
    res.status(201).json(newComment);
  } catch (error) {
    res.status(500).json({ message: 'Comment creation failed', error: error.toString() });
  }
});

// 특정 댓글 조회
router.get('/:commentID', (req, res) => {
  try {
    const { commentID } = req.params;
    const comment = commentController.getCommentByID(commentID);
    if (comment) {
      res.json(comment);
    } else {
      res.status(404).json({ message: 'Comment not found.' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Failed to get comment', error: error.toString() });
  }
});

// 댓글 업데이트
router.put('/:commentID', (req, res) => {
  try {
    const { commentID } = req.params;
    const updatedData = req.body;
    const updatedComment = commentController.updateComment(commentID, updatedData);
    if (updatedComment) {
      res.json(updatedComment);
    } else {
      res.status(404).json({ message: 'Comment not found.' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Comment update failed', error: error.toString() });
  }
});

// 댓글 삭제
router.delete('/:commentID', (req, res) => {
  try {
    const { commentID } = req.params;
    const success = commentController.deleteComment(commentID);
    if (success) {
      res.json({ message: 'Comment deleted successfully.' });
    } else {
      res.status(404).json({ message: 'Comment not found.' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Comment deletion failed', error: error.toString() });
  }
});

module.exports = router;
