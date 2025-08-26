// backend/routes/postRoutes.js
import express from 'express';
const router = express.Router();
import {
  createPost,
  getFeedPosts, // Make sure this is imported
  likeUnlikePost,
  addComment,
} from '../controllers/postController.js';
import { protect } from '../middleware/authMiddleware.js';

// Specific routes like '/feed' should come before general ones like '/'
router.route('/feed').get(protect, getFeedPosts);

router.route('/').post(protect, createPost);

router.route('/:id/like').put(protect, likeUnlikePost);
router.route('/:id/comment').post(protect, addComment);

export default router;