import express from 'express';
import {
  changePassword,
  current,
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
router.get('/current', protectRoute, current);
router.post('/logout', logout);
router.post('/change-password', protectRoute, changePassword);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);

export default router;
