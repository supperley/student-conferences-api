import User from '../models/user.js';
import path from 'path';
import fs from 'fs';

export const getAllUsers = async (req, res) => {
  try {
    let users = await User.find({});

    users.forEach((user) => {
      user.password = undefined;
    });

    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: 'error', message: 'Internal server error' });
  }
};

export const getUserById = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ status: 'error', message: 'Пользователь не найден' });
    }

    user.password = undefined;

    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: 'error', message: 'Internal server error' });
  }
};

export const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { first_name, last_name, email, faculty, position, avatar, role, status } = req.body;

    // Проверка, что пользователь обновляет свою информацию
    if (id !== req.user.userId && req.user.role !== 'admin') {
      return res.status(403).json({ status: 'error', message: 'Forbidden' });
    }

    const user = await User.findById(id);

    let avatarPath = user.avatarUrl;

    if (avatar === 'delete' || (req.file && req.file.path)) {
      user.avatarUrl &&
        fs.unlink(path.resolve() + user.avatarUrl, function (err) {
          if (err) {
            console.log('user.avatarUrl delete error', err);
          } else console.log('user.avatarUrl deleted');
        });
      avatarPath = null;
    }

    if (req.file && req.file.path) {
      avatarPath = `/${req.file.destination}/${req.file.filename}`;
    }

    if (user) {
      user.first_name = first_name || user.first_name;
      user.last_name = last_name || user.last_name;
      user.email = email || user.email;
      user.faculty = faculty || user.faculty;
      user.position = position || user.position;
      user.role = role || user.role;
      user.status = status || user.status;
      user.avatarUrl = avatarPath;

      const updatedUser = await user.save();

      user.password = undefined;

      res.status(201).json({
        status: 'ok',
        message: 'Profile updated successfully',
        user: updatedUser,
      });
    } else {
      res.status(404).json({ status: 'error', message: 'User not found' });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ status: 'error', message: 'Internal server error' });
  }
};

export const changeStatus = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id);

    if (user) {
      user.status = req.body.status;

      await user.save();

      res.status(201).json({
        status: 'ok',
        message: `User account has been ${user?.status === 'active' ? 'activated' : 'disabled'}`,
      });
    } else {
      res.status(404).json({ status: 'ok', message: 'User not found' });
    }
  } catch (error) {
    console.error(error);
    return res.status(400).json({ status: 'ok', message: error.message });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    await User.findByIdAndDelete(id);

    res.status(200).json({ status: 'ok', message: 'User deleted successfully' });
  } catch (error) {
    console.error(error);
    return res.status(400).json({ status: 'error', message: error.message });
  }
};
