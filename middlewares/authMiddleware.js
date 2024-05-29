import jwt from 'jsonwebtoken';
import User from '../models/user.js';

const protectRoute = async (req, res, next) => {
  try {
    let token = req.cookies?.token;

    // // Получить токен из заголовка Authorization
    // const authHeader = req.headers['authorization'];
    // const token = authHeader && authHeader.split(' ')[1];

    if (token) {
      const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

      const resp = await User.findById(decodedToken.userId).select('role email');

      req.user = {
        email: resp.email,
        role: resp.role,
        userId: decodedToken.userId,
      };

      next();
    } else {
      return res.status(401).json({ status: 'error', message: 'Unauthorized' });
    }
  } catch (error) {
    console.error(error);
    return res.status(401).json({ status: 'error', message: 'Unauthorized' });
  }
};

const isPrivilegedRoute = (req, res, next) => {
  if (req.user && (req.user.role === 'admin' || req.user.role === 'moderator')) {
    next();
  } else {
    return res.status(403).json({
      status: 'error',
      message: 'Privileged privileges required',
    });
  }
};

const isAdminRoute = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    return res.status(403).json({
      status: 'error',
      message: 'Admin privileges required',
    });
  }
};

export { isAdminRoute, isPrivilegedRoute, protectRoute };
