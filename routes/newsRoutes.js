import express from 'express';
import {
  createNews,
  deleteNews,
  getAllNews,
  getNewsById,
  updateNews,
} from '../controllers/newsController.js';
import { protectRoute } from '../middlewares/authMiddleware.js';
import { multerUpload } from '../utils/index.js';

const router = express.Router();

router.post('/', protectRoute, multerUpload.single('image'), createNews);
router.get('/', protectRoute, getAllNews);
router.get('/:id', protectRoute, getNewsById);
router.patch('/:id', protectRoute, multerUpload.single('image'), updateNews);
router.delete('/:id', protectRoute, deleteNews);

export default router;
