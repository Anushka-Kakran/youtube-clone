import dotenv from 'dotenv';
import mongoose from 'mongoose';
import Comment from '../models/Comment.js'; 
import jwt from 'jsonwebtoken';

// Load environment variables (like JWT_SECRET_KEY) from .env file
dotenv.config();

/**
 * CREATE a new comment
 * POST /comments/:videoId
 */
export const comment = async(req, res) => {
  const { commentText } = req.body;
  const { videoId } = req.params;

  try {
    // Extract token from "Bearer <token>" and verify the user's identity
    const verifiedUser = jwt.verify(
      req.headers.authorization.split(" ")[1], 
      process.env.JWT_SECRET_KEY
    );

    // Create a new comment instance using the user ID from the decoded token
    const newComment = new Comment({
      _id: new mongoose.Types.ObjectId(),
      videoId: videoId,
      userId: verifiedUser._id, // Associate comment with the logged-in user
      commentText: commentText
    });

    // Save to MongoDB
    const savedComment = await newComment.save();

    res.status(200).json({
      newComment: savedComment
    });
    
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
}

/**
 * GET all comments for a specific video
 * GET /comments/:videoId
 */
export const allComments = async(req, res) => {
  try {
    // Find comments for the video and 'join' user details (channelName, logoUrl) 
    // instead of just showing the userId string
    const comments = await Comment.find({ videoId: req.params.videoId })
      .populate('userId', 'channelName logoUrl');

    res.status(200).json({
      commentList: comments
    });
    
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
}

/**
 * UPDATE an existing comment
 * PUT /comments/:commentId
 */
export const updateComment = async (req, res) => {
  try {
    // Verify user identity via JWT
    const verifiedUser = jwt.verify(
      req.headers.authorization.split(" ")[1], 
      process.env.JWT_SECRET_KEY
    );

    const comment = await Comment.findById(req.params.commentId);

    // Security Check: Ensure the user trying to edit is the one who wrote it
    if (comment.userId != verifiedUser._id) {
      return res.status(403).json({ // 403 Forbidden is more accurate than 500
        error: 'Invalid User: You can only edit your own comments'
      });
    }
    
    // Update the text and save changes
    comment.commentText = req.body.commentText;
    const updatedComment = await comment.save();

    return res.status(200).json({
      updatedComment: updatedComment
    });
    
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
}

/**
 * DELETE a comment
 * DELETE /comments/:commentId
 */
export const deleteComment = async (req, res) => {
  try {
    // Verify user identity via JWT
    const verifiedUser = jwt.verify(
      req.headers.authorization.split(" ")[1], 
      process.env.JWT_SECRET_KEY
    );

    const comment = await Comment.findById(req.params.commentId);

    // Security Check: Ensure the user trying to delete is the owner
    if (comment.userId != verifiedUser._id) {
      return res.status(403).json({
        error: 'Invalid User: You can only delete your own comments'
      });
    }
    
    // Remove the document from the database
    await Comment.findByIdAndDelete(req.params.commentId);

    return res.status(200).json({
      deletedData: "success"
    });
    
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
}