import express from 'express';
import multer from 'multer';
import authRoutes from './authRoutes.js';
import userRoutes from './userRoutes.js';
import conferenceRoutes from './conferenceRoutes.js';

const uploadDestination = 'uploads';

// Показываем, где хранить загружаемые файлы
const storage = multer.diskStorage({
  destination: uploadDestination,
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage: storage });

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/conferences', conferenceRoutes);

export default router;
