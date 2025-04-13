const express = require('express');
const router = express.Router();
const postController = require('../controllers/postController');

// 새 게시글 생성
router.post('/', (req, res) => {
  try {
    const postData = req.body;
    const newPost = postController.createPost(postData);
    res.status(201).json(newPost);
  } catch (error) {
    res.status(500).json({ message: 'Post creation failed', error: error.toString() });
  }
});

// 특정 게시글 조회
router.get('/:postID', (req, res) => {
  try {
    const { postID } = req.params;
    const post = postController.getPostByID(postID);
    if (post) {
      res.json(post);
    } else {
      res.status(404).json({ message: 'Post not found.' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Failed to get post', error: error.toString() });
  }
});

// 게시글 업데이트
router.put('/:postID', (req, res) => {
  try {
    const { postID } = req.params;
    const updatedData = req.body;
    const updatedPost = postController.updatePost(postID, updatedData);
    if (updatedPost) {
      res.json(updatedPost);
    } else {
      res.status(404).json({ message: 'Post not found.' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Post update failed', error: error.toString() });
  }
});

// 게시글 삭제
router.delete('/:postID', (req, res) => {
  try {
    const { postID } = req.params;
    const success = postController.deletePost(postID);
    if (success) {
      res.json({ message: 'Post deleted successfully.' });
    } else {
      res.status(404).json({ message: 'Post not found.' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Post deletion failed', error: error.toString() });
  }
});

module.exports = router;
