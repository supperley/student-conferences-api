import express from 'express';
import {
  changeStatus,
  getAllUsers,
  getUserById,
  updateUser,
} from '../controllers/userController.js';
import { isAdminRoute, protectRoute } from '../middlewares/authMiddleware.js';
import { multerUpload } from '../utils/index.js';

const router = express.Router();

router.get('/', getAllUsers);
router.get('/:id', protectRoute, getUserById);
router.patch('/:id', protectRoute, multerUpload.single('avatar'), updateUser);

// FOR ADMIN ONLY - ADMIN ROUTES
router.patch('/:id/status', protectRoute, isAdminRoute, changeStatus);

export default router;
