import express from 'express';
import {
  createConference,
  deleteConference,
  getAllConferences,
  getConferenceById,
} from '../controllers/conferenceController.js';
import { protectRoute } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/', protectRoute, createConference);
router.get('/', protectRoute, getAllConferences);
router.get('/:id', protectRoute, getConferenceById);
router.delete('/:id', protectRoute, deleteConference);

export default router;
