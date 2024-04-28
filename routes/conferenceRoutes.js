import express from 'express';
import {
  createConference,
  // deleteConference,
  getAllConferences,
  getConferenceById,
  updateConference,
} from '../controllers/conferenceController.js';
import { protectRoute } from '../middlewares/authMiddleware.js';
import { multerUpload } from '../utils/index.js';

const router = express.Router();

router.post('/', protectRoute, multerUpload.single('image'), createConference);
router.get('/', protectRoute, getAllConferences);
router.get('/:id', protectRoute, getConferenceById);
router.patch('/:id', protectRoute, multerUpload.single('image'), updateConference);
// router.delete('/:id', protectRoute, deleteConference);

export default router;
