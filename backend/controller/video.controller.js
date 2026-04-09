import mongoose from 'mongoose';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import { v2 as cloudinary } from 'cloudinary';
import Video from '../models/Video.js';

dotenv.config();

// Cloudinary configuration for media storage
cloudinary.config({ 
    cloud_name: process.env.CLOUD_NAME, 
    api_key: process.env.API_KEY, 
    api_secret : process.env.API_SECRET 
});

/**
 * UPLOAD VIDEO
 * Handles auth, dual-file upload (video & thumbnail), and DB storage.
 */
export const video = async (req, res) => {
  const { title, description, category, tags } = req.body;

  try {
    // 1. JWT Authentication
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ error: "No token provided" });

    const token = authHeader.split(" ")[1];
    const user = jwt.verify(token, process.env.JWT_SECRET_KEY);

    // 2. Upload Video to Cloudinary (resource_type: 'video' is required for mp4/mov/etc)
    const uploadedVideo = await cloudinary.uploader.upload(req.files.video.tempFilePath, {
      resource_type: 'video' 
    });

    // 3. Upload Thumbnail (Images use default resource_type)
    const uploadedThumbnail = await cloudinary.uploader.upload(req.files.thumbnail.tempFilePath);
     
    // 4. Create and Save Database Document
    const newVideo = new Video({
        _id: new mongoose.Types.ObjectId(),  
        title: title,
        description: description,
        user_id: user._id,
        vedioUrl: uploadedVideo.secure_url,
        videoId: uploadedVideo.public_id, // Stored to delete/update from Cloudinary later
        thumbnailUrl: uploadedThumbnail.secure_url,
        thumbnailId: uploadedThumbnail.public_id,
        category: category,
        tags: tags ? tags.split(",") : [], // Converts comma-separated string to Array
    });

    const newuploadedVideoData = await newVideo.save();
    
    res.status(200).json({
      newVideo: newuploadedVideoData
    });
    
  } catch (error) {
     console.log(error); 
     return res.status(500).json({ error: error.message });
  }
}

/**
 * UPDATE VIDEO DETAILS
 * Allows updating text data or replacing the thumbnail image.
 */
export const updateVedio = async (req, res) => {
  const { title, description, category, tags } = req.body;

  try {
    const verifiedUser = jwt.verify(req.headers.authorization.split(" ")[1], process.env.JWT_SECRET_KEY);
    const video = await Video.findById(req.params.videoId);

    if (!video) return res.status(404).json({ error: "Video not found" });

    // Ownership check: Only the uploader can edit
    if(video.user_id == verifiedUser._id) {
      
      if(req.files) {
        // CASE: User uploaded a new thumbnail
        // 1. Delete old thumbnail from Cloudinary
        await cloudinary.uploader.destroy(video.thumbnailId);
        // 2. Upload new thumbnail
        const updatedThumbnail = await cloudinary.uploader.upload(req.files.thumbnail.tempFilePath);
        
        const updatedData = {
           title, description, category,
           tags: tags ? tags.split(",") : [], 
           thumbnailUrl: updatedThumbnail.secure_url,
           thumbnailId: updatedThumbnail.public_id,
        }

        const updatedVideoDetails = await Video.findByIdAndUpdate(req.params.videoId, updatedData, { returnDocument: 'after' });
        res.status(200).json({ updateVedio : updatedVideoDetails });

      } else {
        // CASE: User only updated text (title, tags, etc.)
        const updatedData = {
           title, description, category,
           tags: tags ? tags.split(",") : [], 
        }

        const updatedVideoDetails = await Video.findByIdAndUpdate(req.params.videoId, updatedData, { returnDocument: 'after' });
        res.status(200).json({ updateVedio : updatedVideoDetails });
      }

    } else {
      return res.status(403).json({ error : 'Permission denied: Not your video' });
    }
    
  } catch (error) {
      console.log(error); 
      return res.status(500).json({ error: error.message });
  }
}

/**
 * DELETE VIDEO
 * Removes assets from Cloudinary and document from MongoDB.
 */
export const deleteVedio = async (req, res) => {
  try {
    const verifiedUser = jwt.verify(req.headers.authorization.split(" ")[1], process.env.JWT_SECRET_KEY);
    const video = await Video.findById(req.params.videoId);

    if (!video) return res.status(404).json({ error: "Video not found" });

    if (video.user_id == verifiedUser._id) {
        // 1. Delete Video asset from Cloudinary
        await cloudinary.uploader.destroy(video.videoId, { resource_type: 'video' });
        // 2. Delete Thumbnail asset from Cloudinary
        await cloudinary.uploader.destroy(video.thumbnailId);
        // 3. Delete DB record
        const deletedResponse = await Video.findByIdAndDelete(req.params.videoId);
       
        res.status(200).json({ deletedResponse : deletedResponse });

    } else {
      return res.status(403).json({ error : 'No permission' });
    }

  } catch (error) {
     return res.status(500).json({ error: error.message });
  }
}

/**
 * LIKE VIDEO
 * Handles logic for: First time like, preventing double like, and switching from dislike to like.
 */
export const likeVideo = async (req, res) => {
  try {
    const verifiedUser = jwt.verify(req.headers.authorization.split(" ")[1], process.env.JWT_SECRET_KEY);
    const video = await Video.findById(req.params.videoId);

    if (!video) return res.status(404).json({ error: "Video not found" });

    // 1. Prevent multiple likes from the same user
    if (video.likedBy.includes(verifiedUser._id)) {
      return res.status(400).json({ error: 'Already liked' });
    }

    // 2. If user previously DISLIKED, remove that dislike first
    if (video.dislikedBy.includes(verifiedUser._id)){
      video.dislike -= 1;
      video.dislikedBy = video.dislikedBy.filter(userId => userId.toString() != verifiedUser._id);
    }

    // 3. Add the like
    video.likes = Number(video.likes || 0) + 1;
    video.likedBy.push(verifiedUser._id);

    await video.save();

    return res.status(200).json({
      msg: 'Liked successfully',
      likes: video.likes,
      likedBy: video.likedBy
    });

  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}

/**
 * DISLIKE VIDEO
 * Logic mirroring Like functionality (switches from Like to Dislike if necessary).
 */
export const dislikeVideo = async (req, res) => {
  try {
    const verifiedUser = jwt.verify(req.headers.authorization.split(" ")[1], process.env.JWT_SECRET_KEY);
    const video = await Video.findById(req.params.videoId);

    if (!video) return res.status(404).json({ error: "Video not found" });

    if (video.dislikedBy.includes(verifiedUser._id)) {
      return res.status(400).json({ error: 'Already disliked' });
    }
      
    // If user previously LIKED, remove that like first
    if (video.likedBy.includes(verifiedUser._id)){
      video.likes -= 1;
      video.likedBy = video.likedBy.filter(userId => userId.toString() != verifiedUser._id);
    }

    video.dislike = Number(video.dislike || 0) + 1;
    video.dislikedBy.push(verifiedUser._id);

    await video.save();

    return res.status(200).json({
      msg: 'Disliked successfully',
      dislike: video.dislike,
      dislikedBy: video.dislikedBy
    });

  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}

/**
 * INCREMENT VIEWS
 * Simple counter for whenever a video is loaded/watched.
 */
export const View = async(req, res) => {
  try {
    const video = await Video.findById(req.params.videoId)

    if (!video) return res.status(404).json({ error: "Video not found" });

    video.views += 1;
    await video.save();

    res.status(200).json({ msg : "OK" });
    
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}