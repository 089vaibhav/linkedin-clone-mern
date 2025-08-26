// backend/models/postModel.js
import mongoose from 'mongoose';

// Schema for comments (a sub-document)
const commentSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    text: {
      type: String,
      required: true,
    },
    // Denormalized fields for performance
    name: { type: String, required: true },
    profilePic: { type: String },
  },
  {
    timestamps: true,
  }
);

// Main Schema for Posts
const postSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User', // Reference to the User model
    },
    content: {
      type: String,
      required: true,
    },
    mediaUrl: {
      type: String, // URL for an image or video
    },
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    comments: [commentSchema],
  },
  {
    timestamps: true,
  }
);

const Post = mongoose.model('Post', postSchema);
export default Post;