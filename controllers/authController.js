import bcrypt from 'bcryptjs';
import fs from 'fs';
import * as jdenticon from 'jdenticon';
import crypto from 'node:crypto';
import path from 'path';
import { changePasswordMail } from '../mails/changePassword.js';
import User from '../models/user.js';
import { createJWT } from '../utils/index.js';
import { sendEmail } from '../utils/sendEmail.js';

export const register = async (req, res) => {
  try {
    const { email, password, first_name, last_name, role } = req.body;

    // Проверяем поля
    if (!email || !password || !first_name || !last_name) {
      return res.status(400).json({ status: 'error', message: 'Все поля обязательны' });
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

    // Генерируем аватар для нового пользователя
    const png = jdenticon.toPng(email, 200);
    const avatarName = `${email}-${Date.now()}.png`;
    const avatarPath = path.join('/uploads', avatarName);
    fs.writeFileSync(path.resolve() + avatarPath, png);

    const user = await User.create({
      email,
      password: hashedPassword,
      first_name,
      last_name,
      role,
      avatarUrl: `/uploads/${avatarName}`,
    });

    if (user) {
      user.password = undefined;

      res.status(201).json(user);
    } else {
      return res.status(400).json({ status: 'error', message: 'Неверные данные пользователя' });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ status: 'error', message: 'Internal server error' });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ status: 'error', message: 'Неверный логин или пароль' });
    }

    if (!user?.status === 'active') {
      return res.status(403).json({
        status: 'error',
        message: 'User account has been deactivated, contact the administrator',
      });
    }

    // Check the password
    const isMatch = await bcrypt.compare(password, user.password);

    if (isMatch) {
      // Generate a JWT
      createJWT(res, user._id);
      user.password = undefined;
      res.status(200).json(user);
      // res.json({ token });
    } else {
      return res.status(400).json({ status: 'error', message: 'Неверный логин или пароль' });
    }
  } catch (error) {
    console.error(error);
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
    console.error(error);
    return res.status(500).json({ status: 'error', message: 'Internal server error' });
  }
};

export const current = async (req, res) => {
  try {
    const userId = req?.user?.userId;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(401).json({ status: 'error', message: 'Unauthorized' });
    }

    user.password = undefined;

    return res.status(200).json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: 'error', message: 'Internal server error' });
  }
};

export const changePassword = async (req, res) => {
  try {
    const { userId } = req.user;
    const { currentPassword, newPassword, repeatPassword } = req.body;

    if (newPassword != repeatPassword) {
      res.status(400).json({ status: 'error', message: 'Пароли не совпадают' });
    }

    const user = await User.findById(userId);

    if (user) {
      const isMatch = await bcrypt.compare(currentPassword, user.password);
      if (isMatch) {
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;

        await user.save();
      } else {
        return res.status(400).json({ status: 'error', message: 'Неверный пароль' });
      }

      return res.status(201).json({
        status: 'ok',
        message: `Пароль успешно изменен`,
      });
    } else {
      res.status(500).json({ status: 'error', message: 'Internal server error' });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ status: 'error', message: 'Internal server error' });
  }
};

export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });

    // if (!user || user.passwordResetToken) {
    if (!user) {
      return res.status(200).json({
        status: 'success',
        message:
          'Если указанный пользователь существует, ссылка для восстановления будет отправлена на почтовый адрес',
      });
    }
    try {
      const resetToken = user.createPasswordResetToken();
      await user.save();

      const resetURL = `http://localhost:5173/reset-password?token=${resetToken}`;
      // TODO => Send Email with this Reset URL to user's email address

      console.log(resetURL);

      await sendEmail(user, changePasswordMail(resetURL));

      return res.status(200).json({
        status: 'success',
        message:
          'Если указанный пользователь существует, ссылка для восстановления будет отправлена на почтовый адрес',
      });
    } catch (err) {
      user.passwordResetToken = undefined;
      user.passwordResetExpires = undefined;
      await user.save();
      console.error(err);
      return res.status(500).json({
        status: 'error',
        message: 'Произошла ошибка при отправке сообщения',
      });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ status: 'error', message: 'Internal server error' });
  }
};

export const resetPassword = async (req, res) => {
  // 1) Get user based on the token
  const hashedToken = crypto.createHash('sha256').update(req.body.token).digest('hex');

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });

  // 2) If token has not expired, and there is user, set the new password
  if (!user) {
    return res.status(400).json({
      status: 'error',
      message: 'Token is invalid or expired',
    });
  }

  const hashedPassword = await bcrypt.hash(req.body.password, 10);
  user.password = hashedPassword;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();

  res.status(200).json({
    status: 'success',
    message: 'Пароль успешно изменен',
  });
};

export const deleteAccount = async (req, res) => {
  try {
    const { userId } = req.user;

    const user = await User.findById(userId);

    if (user) {
      if (user.avatarUrl) {
        user.avatarUrl &&
          fs.unlink(path.resolve() + user.avatarUrl, function (err) {
            if (err) {
              console.log('user.avatarUrl delete error', err);
            } else console.log('user.avatarUrl deleted');
          });
      }

      await User.findByIdAndDelete(userId);
    }

    res.status(200).json({ status: 'ok', message: 'Аккаунт успешно удален' });
  } catch (error) {
    console.error(error);
    return res.status(400).json({ status: 'error', message: error.message });
  }
};
