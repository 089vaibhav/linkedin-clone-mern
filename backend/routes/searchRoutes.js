// backend/routes/searchRoutes.js
import express from 'express';
const router = express.Router();
import { search } from '../controllers/searchController.js';
import { protect } from '../middleware/authMiddleware.js';

router.route('/').get(protect, search);

export default router;