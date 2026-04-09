import express from 'express';
import { deleteVedio, dislikeVideo, likeVideo, updateVedio, video, View } from '../controller/video.controller.js';
import checkAuth from '../middleware/checkAuth.js';

const router = express.Router();

// Upload a new video and thumbnail (Login required)
router.post('/upload', checkAuth, video);

// Update video details or thumbnail (Login required)
router.put('/:videoId', checkAuth, updateVedio);

// Remove video from DB and Cloudinary (Login required)
router.delete('/:videoId', checkAuth, deleteVedio);

// Add a like and handle dislike removal (Login required)
router.put('/like/:videoId', checkAuth, likeVideo);

// Add a dislike and handle like removal (Login required)
router.put('/dislike/:videoId', checkAuth, dislikeVideo);

// Increment view count (Public)
router.put('/views/:videoId', View);

export default router;