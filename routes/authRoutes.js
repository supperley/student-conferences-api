import express from 'express';
import {
  changePassword,
  current,
  deleteAccount,
  forgotPassword,
  login,
  logout,
  register,
  resetPassword,
} from '../controllers/authController.js';
import { protectRoute } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);
// protected
router.get('/current', protectRoute, current);
router.post('/change-password', protectRoute, changePassword);
router.post('/delete-account', protectRoute, deleteAccount);

export default router;
