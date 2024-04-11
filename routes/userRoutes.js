import express from 'express';
import { isAdminRoute, protectRoute } from '../middlewares/authMiddleware.js';
import {
  activateUser,
  changeUserPassword,
  deleteUser,
  getUserById,
  updateUser,
} from '../controllers/userController.js';

const router = express.Router();

router.get('/users/:id', protectRoute, getUserById);
router.put('/profile', protectRoute, updateUser);
router.put('/change-password', protectRoute, changeUserPassword);

// //   FOR ADMIN ONLY - ADMIN ROUTES
router
  .route('/:id')
  .put(protectRoute, isAdminRoute, activateUser)
  .delete(protectRoute, isAdminRoute, deleteUser);

export default router;
