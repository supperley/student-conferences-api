import express from 'express';
import authRoutes from './authRoutes.js';
import userRoutes from './userRoutes.js';
import conferenceRoutes from './conferenceRoutes.js';
import reportRoutes from './reportRoutes.js';
import commentRoutes from './commentRoutes.js';
import newsRoutes from './newsRoutes.js';

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/conferences', conferenceRoutes);
router.use('/reports', reportRoutes);
router.use('/comments', commentRoutes);
router.use('/news', newsRoutes);

export default router;
