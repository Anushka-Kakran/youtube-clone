import express from 'express';
import { signup, login, subscibed, UnSubcribed } from '../controller/user.controller.js';
import checkAuth from '../middleware/checkAuth.js';

const router = express.Router();

// Public route: Register a new user and upload channel logo
router.post('/signup', signup);

// Public route: Authenticate user and receive a JWT
router.post('/login', login);

// Protected route: Follow a channel (requires valid token)
router.put('/subscribe/:userBId', checkAuth, subscibed);

// Protected route: Unfollow a channel (requires valid token)
router.put('/unsubscribe/:userBId', checkAuth, UnSubcribed);

export default router;