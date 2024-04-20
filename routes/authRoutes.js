import express from 'express';
import { changePassword, current, login, logout, register } from '../controllers/authController.js';
import { protectRoute } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);
router.post('/change-password', protectRoute, changePassword);
router.get('/current', protectRoute, current);

export default router;
