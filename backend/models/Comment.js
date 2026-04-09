import mongoose from "mongoose";

const commentSchema = new mongoose.Schema({
   // Unique ID for each comment
   _id : mongoose.Schema.Types.ObjectId,

   // Link to the User who wrote the comment (references the User model)
   userId : {type: mongoose.Schema.Types.ObjectId, required: true, ref : 'User'},

   // The specific video this comment belongs to
   videoId : {type: String, required: true},

   // The actual message content
   commentText : {type: String, required: true}
   
}, {timestamps: true}) // Adds 'createdAt' (comment date) and 'updatedAt' automatically

export default mongoose.model('Comment', commentSchema);