import express from 'express';
import authRoutes from './authRoutes.js';
import userRoutes from './userRoutes.js';
import conferenceRoutes from './conferenceRoutes.js';

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/conferences', conferenceRoutes);

export default router;
