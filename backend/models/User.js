import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
   // Unique identifier for the document
   _id : mongoose.Schema.Types.ObjectId,
   
   // Basic Profile Information
   channelName : {type: String, required: true},
   email : {type: String, required: true},
   phone: {type: String, required: true},
   password : {type: String, required: true}, // Hashed string from bcrypt
   
   // Media assets from Cloudinary
   logoUrl : {type: String, required: true},
   logoId: {type: String, required: true},
   
   // Subscription Stats & Social Logic
   subscribers : {type: Number, default: 0}, // Total count for quick display
   
   // List of Users who follow this channel (Followers)
   subscribedBy : [{type :  mongoose.Schema.Types.ObjectId, ref: 'User'}],
   
   // List of Channels this user follows (Following)
   subscribedChannels : [{type :  mongoose.Schema.Types.ObjectId, ref: 'User'}]
   
}, {timestamps: true}) // Automatically adds createdAt and updatedAt fields

export default mongoose.model('User', userSchema);