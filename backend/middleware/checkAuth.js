import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

// Load environment variables so we can access the secret key
dotenv.config();

/**
 * Authentication Middleware
 * This function intercepts the request to check for a valid JWT.
 * It ensures protected routes can only be accessed by logged-in users.
 */
export default (req, res, next) => {

   try {
     // 1. Extract the token from the 'Authorization' header
     // We use optional chaining (?.) and split(" ") to handle the "Bearer <token>" format
     const token = req.headers.authorization?.split(" ")[1];

     // 2. If no token is found, block the request immediately
     if (!token) {
      return res.status(401).json({ msg: "No token, authorization denied" });
    }

    /**
     * 3. Verify the token using your secret key.
     * If the token is expired or tampered with, jwt.verify will throw an error 
     * and execution will jump to the catch block.
     */
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

    /**
     * 4. Attach the decoded user data (e.g., userId, email) to the request object.
     * This makes user info available in the next function (the actual route controller).
     */
    req.user = decoded;

    // 5. Success! Move on to the next function in the route chain
    next();

    
   } catch (error) {
    // 6. If token verification fails or any other error occurs
    console.log("Auth Error:", error.message);
    return res.status(401).json({ msg: "Invalid token" }); // 401 is more standard for auth failures
    
   }
};