import mongoose from "mongoose";

const videoSchema = new mongoose.Schema({
   _id : mongoose.Schema.Types.ObjectId,
   
   // Basic Video Details
   title: {type: String, required: true},
   description : {type: String, required: true},
    user_id : {type: mongoose.Schema.Types.ObjectId, required: true, ref : 'User'},
   
   // Cloudinary Media Data (URLs and Public IDs for management)
   vedioUrl : {type: String, required: true},
   videoId : {type: String, required: true}, // Cloudinary public_id for deletion
   thumbnailUrl  :{type: String, required: true},
   thumbnailId : {type: String, required: true}, // Cloudinary public_id for updates
   
   // Classification & Discovery
   category : {type: String, required: true},
   tags :  [{type : String}],
   
   // Engagement Counters
   likes :  {type : Number, default : 0},
   dislike : {type : Number, default : 0},
   views : {type : Number, default : 0},
   
   // User Relationships (Tracking who liked/disliked to prevent duplicates)
   likedBy : [{type :  mongoose.Schema.Types.ObjectId, ref: 'User'}],
   dislikedBy : [{type :  mongoose.Schema.Types.ObjectId, ref: 'User'}],
   
   // viewedBy : [{type :  mongoose.Schema.Types.ObjectId, ref: 'User'}] // Optional: track unique views

}, {timestamps: true}) // Tracks upload and update times

export default mongoose.model('Video', videoSchema);