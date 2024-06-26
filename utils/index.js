import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import multer from 'multer';

export const dbConnection = async () => {
  try {
    await mongoose.connect(process.env.DATABASE_URL, { family: 4 });
    console.log('DB connection ok');
  } catch (error) {
    console.error('DB Error: ' + error);
  }
};

export const createJWT = (res, userId) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: '1d',
  });

  res.cookie('token', token, {
    httpOnly: true,
    secure: process.env.COOKIE_SECURE_FLAG === 'true',
    sameSite: process.env.COOKIE_SAMESITE || 'Lax', // prevent CSRF attack
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });

  return token;
};

const uploadDestination = 'uploads';

// Показываем, где хранить загружаемые файлы
const storage = multer.diskStorage({
  destination: uploadDestination,
  filename: function (req, file, cb) {
    // console.log(file);
    const nameSplit = file.originalname.split('.').slice(0, -1);
    const name = nameSplit.join('.').replace(/\s/g, '-');
    const filenameExtension = file.originalname.split('.').pop();
    // or replace with uuid
    cb(
      null,
      Buffer.from(name, 'latin1').toString('utf8') + '-' + Date.now() + '.' + filenameExtension,
    );
  },
});

export const multerUpload = multer({ storage: storage });
