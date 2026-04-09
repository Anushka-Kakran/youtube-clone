import bcrypt from 'bcrypt';
import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';
import User from '../models/User.js';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';

dotenv.config();

// Cloudinary Configuration: Connects to your media storage account
cloudinary.config({ 
    cloud_name: process.env.CLOUD_NAME, 
    api_key: process.env.API_KEY, 
    api_secret : process.env.API_SECRET 
});

/**
 * SIGNUP LOGIC
 * Purpose: Registers a new user, hashes password, and uploads a logo to Cloudinary.
 */
export const signup = async (req, res) => {
  const { channelName, email, phone, password } = req.body;

  try {
    // 1. Check if the user already exists to prevent duplicate accounts
    const users = await User.find({ email: email });
    if (users.length > 0) {
      return res.status(400).json({ // 400 is better for client-side input errors
        error: 'Email already registered'
      });
    }
    
    // 2. Hash the password for security (Salt rounds: 10)
    const hashCode = await bcrypt.hash(password, 10);
    
    // 3. Upload the channel logo (temp file from express-fileupload/multer) to Cloudinary
    const uploadedImage = await cloudinary.uploader.upload(req.files.logo.tempFilePath);
   
    // 4. Create a new User document with the returned Cloudinary URL and public_id
    const newUser = new User({
      _id: new mongoose.Types.ObjectId(),
      channelName: channelName,
      email: email,
      phone: phone,
      password: hashCode, // Store the hash, never the plain text password
      logoUrl: uploadedImage.secure_url,
      logoId: uploadedImage.public_id
    });

    // 5. Save the user to MongoDB
    const user = await newUser.save();
    res.status(200).json({ newUser: user });
   
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * LOGIN LOGIC
 * Purpose: Authenticates user and returns a JSON Web Token (JWT).
 */
export const login = async (req, res) => {
    const { email, password } = req.body;

   try {
     // 1. Find user by email (Tip: User.findOne({email}) is more efficient here)
      const users = await User.find({email : email});
      if (users.length == 0) {
      return res.status(401).json({ // 401 Unauthorized
        error: 'Email is not registered...'
      });
    }

   // 2. Compare the provided password with the stored hash
   const isValid = await bcrypt.compare(password, users[0].password)

   if(!isValid){
    return res.status(401).json({
      msg: "Invalid password"
    })
   }

   // 3. Generate a JWT containing user payload data
   // This token allows the user to stay logged in for 365 days
   const token = jwt.sign({
     _id : users[0]._id,
     channelName: users[0].channelName,
     email: users[0].email,
     phone : users[0].phone,
     logoId: users[0].logoId,
   },
    process.env.JWT_SECRET_KEY,
   {expiresIn: '365d'}
  )

  // 4. Send back the token and user details to the frontend
  res.status(200).json({
     _id : users[0]._id,
     channelName: users[0].channelName,
     email: users[0].email,
     phone : users[0].phone,
     logoId: users[0].logoId,
     logoUrl: users[0].logoUrl,
     token: token,
     subscribers: users[0].subscribers,
     subcribedChannels : users[0].subscribedChannels
  })
    
   } catch (error) {
      res.status(500).json({ error: error.message });
   }
};

/**
 * SUBSCRIBE LOGIC
 * Purpose: Connects User A (Subscriber) to User B (Channel).
 */
export const subscibed = async(req, res) => {

  try {
    // 1. Identify the subscriber (User A) from the token
    const userA = jwt.verify(req.headers.authorization.split(" ")[1], process.env.JWT_SECRET_KEY);

    // 2. Find the channel (User B) being subscribed to
    const userB = await User.findById(req.params.userBId);

    // 3. Prevent duplicate subscriptions
    if(userB.subscribedBy.includes(userA._id)){
        return res.status(400).json({
          error : "Already subscribed..."
        })
    }

    // 4. Update the Channel (User B): Increment count and add subscriber ID
    userB.subscribers += 1;
    userB.subscribedBy.push(userA._id);
    await userB.save();

    // 5. Update the Subscriber (User A): Add channel ID to their "following" list
    const userFullInformation = await User.findById(userA._id)
    userFullInformation.subscribedChannels.push(userB._id);
    await userFullInformation.save();

    res.status(200).json({
      msg : "subscribed..."
    })
    
  } catch (error) {
     res.status(500).json({ error: error.message });
  }
}

/**
 * UNSUBSCRIBE LOGIC
 * Purpose: Removes the connection between Subscriber and Channel.
 */
export const UnSubcribed = async(req,res) => {
  try {
    // 1. Identify the subscriber from the token
    const userA = jwt.verify(req.headers.authorization.split(" ")[1], process.env.JWT_SECRET_KEY);
    const userB = await User.findById(req.params.userBId);

    // 2. Validate that the user is actually subscribed before trying to unsubscribe
    if(!userB || !userB.subscribedBy.includes(userA._id)){
      return res.status(400).json({ error : "Not Subscribed..." });
    }

    // 3. Update User B (The Channel): Decrease count and remove the user from the list
    userB.subscribers = Math.max(0, userB.subscribers - 1); // Prevent negative numbers
    userB.subscribedBy = userB.subscribedBy.filter(id => id.toString() !== userA._id.toString());
    await userB.save();

    // 4. Update User A (The Subscriber): Remove the channel from their subscribed list
    const userAFullInformation = await User.findById(userA._id);
    userAFullInformation.subscribedChannels = userAFullInformation.subscribedChannels.filter(
      id => id.toString() !== userB._id.toString()
    );

    await userAFullInformation.save();

    res.status(200).json({ msg : "Unsubscribed..." });
    
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}