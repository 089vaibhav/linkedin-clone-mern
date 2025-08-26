// backend/routes/messageRoutes.js
import express from 'express';
const router = express.Router();
import { getMessages, sendMessage } from '../controllers/messageController.js';
import { protect } from '../middleware/authMiddleware.js';

router.route('/:otherUserId').get(protect, getMessages);
router.route('/').post(protect, sendMessage);

export default router;