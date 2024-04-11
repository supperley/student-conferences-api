import User from '../models/user.js';
import { createJWT } from '../utils/index.js';
import bcrypt from 'bcryptjs';

export const register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // Проверяем поля
    if (!email || !password || !name) {
      return res.status(400).json({ error: 'Все поля обязательны' });
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        status: 'error',
        message: 'User already exists',
      });
    }

    // Хешируем пароль
    const hashedPassword = await bcrypt.hash(password, 10);

    // // Генерируем аватар для нового пользователя
    // const png = Jdenticon.toPng(name, 200);
    // const avatarName = `${name}_${Date.now()}.png`;
    // const avatarPath = path.join(__dirname, '/../uploads', avatarName);
    // fs.writeFileSync(avatarPath, png);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role,
      // avatarUrl: `/uploads/${avatarName}`,
    });

    if (user) {
      user.password = undefined;

      res.status(201).json(user);
    } else {
      return res.status(400).json({ status: 'error', message: 'Invalid user data' });
    }
  } catch (error) {
    console.error('Error in register:', error);
    return res.status(500).json({ status: 'error', message: 'Internal server error' });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ status: 'error', message: 'Invalid email or password.' });
    }

    if (!user?.status === 'active') {
      return res.status(401).json({
        status: 'error',
        message: 'User account has been deactivated, contact the administrator',
      });
    }

    console.log(user);

    // Check the password
    const isMatch = await bcrypt.compare(password, user.password);

    if (isMatch) {
      // Generate a JWT
      createJWT(res, user._id);
      user.password = undefined;
      res.status(200).json(user);
      // res.json({ token });
    } else {
      return res.status(401).json({ status: 'error', message: 'Invalid email or password' });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ status: 'error', message: 'Internal server error' });
  }
};

export const logout = async (req, res) => {
  try {
    res.cookie('token', '', {
      htttpOnly: true,
      expires: new Date(0),
    });

    res.status(200).json({ status: 'success', message: 'Logout successful' });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ status: 'error', message: 'Internal server error' });
  }
};

export const current = async (req, res) => {
  try {
    // const user = await prisma.user.findUnique({
    //   where: { id: req.user.userId },
    //   include: {
    //     followers: {
    //       include: {
    //         follower: true,
    //       },
    //     },
    //     following: {
    //       include: {
    //         following: true,
    //       },
    //     },
    //   },
    // });

    const userId = req?.user?.userId;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    return res.status(200).json(user);
  } catch (error) {
    console.log('err', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
