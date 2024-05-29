import express from 'express';
import {
  createNews,
  deleteNews,
  getAllNews,
  getNewsById,
  updateNews,
} from '../controllers/newsController.js';
import { isPrivilegedRoute, protectRoute } from '../middlewares/authMiddleware.js';
import { multerUpload } from '../utils/index.js';

const router = express.Router();

router.post('/', protectRoute, isPrivilegedRoute, multerUpload.single('image'), createNews);
router.get('/', getAllNews);
router.get('/:id', getNewsById);
router.patch('/:id', protectRoute, isPrivilegedRoute, multerUpload.single('image'), updateNews);
router.delete('/:id', protectRoute, isPrivilegedRoute, deleteNews);

export default router;
