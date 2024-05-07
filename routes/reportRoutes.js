import express from 'express';
import {
  createReport,
  createReportComment,
  deleteReport,
  getAllReports,
  getReportById,
  updateReport,
} from '../controllers/reportController.js';
import { protectRoute } from '../middlewares/authMiddleware.js';
import { multerUpload } from '../utils/index.js';

const router = express.Router();

router.post('/', protectRoute, multerUpload.single('file'), createReport);
router.post('/:id/comment', protectRoute, createReportComment);
router.get('/', protectRoute, getAllReports);
router.get('/:id', protectRoute, getReportById);
router.patch('/:id', protectRoute, multerUpload.single('file'), updateReport);
router.delete('/:id', protectRoute, deleteReport);

export default router;
