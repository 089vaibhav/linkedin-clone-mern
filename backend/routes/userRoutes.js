// backend/routes/userRoutes.js
import express from 'express';
const router = express.Router();
import {
  registerUser,
  loginUser,
  logoutUser,
  getUserProfile,
  updateUserProfile,
  getUsers, 
  getUserById,
  sendConnectionRequest,
  acceptConnectionRequest,
  rejectConnectionRequest,
  getPendingRequests,
} from '../controllers/userController.js';
import { protect } from '../middleware/authMiddleware.js';

// --- AUTH ROUTES ---
router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/logout', logoutUser);

// --- SPECIFIC ROUTES (MUST COME BEFORE DYNAMIC /:id) ---
router
  .route('/profile')
  .get(protect, getUserProfile)
  .put(protect, updateUserProfile);

router.route('/requests').get(protect, getPendingRequests);

// The new route for getting all users
router.route('/').get(protect, getUsers);

// --- DYNAMIC ROUTES (MUST COME LAST) ---
router.route('/:id').get(getUserById);
router.route('/:id/connect').post(protect, sendConnectionRequest);
router.route('/:id/accept').post(protect, acceptConnectionRequest);
router.route('/:id/reject').post(protect, rejectConnectionRequest);

export default router;