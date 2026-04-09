# Video Streaming Backend API 🎥

A robust Node.js/Express backend for a video-sharing platform. This API handles user authentication, video processing via Cloudinary, and complex social interactions like subscriptions and like/dislike logic.

## 🚀 Features

-   **User Authentication:** Secure Signup and Login using `bcrypt` and `JWT`.
-   **Video Management:** Upload, Update, and Delete videos (integrated with Cloudinary).
-   **Subscription System:** Follow/Unfollow channels with real-time subscriber counts.
-   **Interaction:** Like/Dislike logic that prevents duplicates and handles "switching" states.
-   **Comments:** Full CRUD for video comments with user ownership checks.

## 🛠️ Tech Stack

-   **Runtime:** Node.js
-   **Framework:** Express.js
-   **Database:** MongoDB (via Mongoose)
-   **Media Storage:** Cloudinary
-   **Security:** JSON Web Tokens (JWT) & Bcrypt

## 📋 Prerequisites

Before you begin, ensure you have:
-   Node.js installed
-   A MongoDB Atlas account
-   A Cloudinary account


## ⚙️ Setup & Installation

1. **Clone the repository:**
   ```bash
   git clone <your-repo-url>
   cd <project-folder>