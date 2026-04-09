import express from 'express';
import { allComments, comment, deleteComment, updateComment } from '../controller/comment.controller.js';
import checkAuth from '../middleware/checkAuth.js';

const router = express.Router();

// Create a new comment (Login required)
router.post('/new-comment/:videoId', checkAuth, comment);

// Fetch all comments for a specific video (Public)
router.get('/:videoId', allComments);

// Update an existing comment (Login required)
router.put('/:commentId', checkAuth, updateComment);

// Delete a comment (Login required)
router.delete('/:commentId', checkAuth, deleteComment);

export default router;