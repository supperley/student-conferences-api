import express from 'express';
import multer from 'multer';
import authRoutes from './authRoutes.js';
import userRoutes from './userRoutes.js';
// import taskRoutes from './taskRoutes.js';

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
router.use('/user', userRoutes);
// router.use('/task', taskRoutes);

export default router;
