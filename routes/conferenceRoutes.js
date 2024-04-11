import express from 'express';
import {
  createConference,
  deleteConference,
  getAllConferences,
  getConferenceById,
} from '../controllers/conferenceController.js';

const router = express.Router();

router.post('/conferences', protectRoute, createConference);
router.get('/conferences', protectRoute, getAllConferences);
router.get('/conference/:id', protectRoute, getConferenceById);
router.delete('/conference/:id', protectRoute, deleteConference);

export default router;
