import express from 'express';
import { isAdminRoute, protectRoute } from '../middlewares/authMiddleware.js';
import {
  changeStatus,
  deleteUser,
  getAllUsers,
  getUserById,
  updateUser,
} from '../controllers/userController.js';
import { multerUpload } from '../utils/index.js';

const router = express.Router();

router.get('/', getAllUsers);
router.get('/:id', protectRoute, getUserById);
router.patch('/:id', protectRoute, multerUpload.single('avatar'), updateUser);

// FOR ADMIN ONLY - ADMIN ROUTES
router.delete('/:id', protectRoute, isAdminRoute, deleteUser);
router.patch('/:id/status', protectRoute, isAdminRoute, changeStatus);

export default router;
