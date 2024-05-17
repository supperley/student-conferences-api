import express from 'express';
import {
  createNews,
  deleteNews,
  getAllNews,
  getNewsById,
  updateNews,
} from '../controllers/newsController.js';
import { isAdminRoute, protectRoute } from '../middlewares/authMiddleware.js';
import { multerUpload } from '../utils/index.js';

const router = express.Router();

router.post('/', protectRoute, isAdminRoute, multerUpload.single('image'), createNews);
router.get('/', getAllNews);
router.get('/:id', getNewsById);
router.patch('/:id', protectRoute, isAdminRoute, multerUpload.single('image'), updateNews);
router.delete('/:id', protectRoute, isAdminRoute, deleteNews);

export default router;
