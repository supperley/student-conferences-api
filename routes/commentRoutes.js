import express from 'express';
import { protectRoute } from '../middlewares/authMiddleware.js';
import { deleteComment, updateComment } from '../controllers/commentController.js';

const router = express.Router();

router.patch('/:id', protectRoute, updateComment);
router.delete('/:id', protectRoute, deleteComment);

export default router;
