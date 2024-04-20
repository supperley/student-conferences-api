import User from '../models/user.js';

export const getAllUsers = async (req, res) => {
  try {
    let users = await User.find({});
    // const user = await prisma.user.findUnique({
    //   where: { id },
    //   include: {
    //     followers: true,
    //     following: true,
    //   },
    // });

    users.forEach((user) => {
      user.password = undefined;
    });

    res.json(users);
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Internal server error' });
  }
};

export const getUserById = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await User.findById(id);
    // const user = await prisma.user.findUnique({
    //   where: { id },
    //   include: {
    //     followers: true,
    //     following: true,
    //   },
    // });

    if (!user) {
      return res.status(404).json({ status: 'error', message: 'Пользователь не найден' });
    }

    user.password = undefined;

    res.json(user);
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Internal server error' });
  }
};

export const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { email, name, role } = req.body;

    let filePath;

    if (req.file && req.file.path) {
      filePath = req.file.path;
    }

    // Проверка, что пользователь обновляет свою информацию
    if (id !== req.user.userId && req.user.role !== 'admin') {
      return res.status(403).json({ status: 'error', message: 'Forbidden' });
    }

    const user = await User.findById(id);

    if (user) {
      user.name = name || user.name;
      user.email = email || user.email;
      user.role = role || user.role;
      user.avatarUrl = filePath ? `/${filePath}` : user.avatarUrl;

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
    console.log(error);
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
    console.log(error);
    return res.status(400).json({ status: 'ok', message: error.message });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    await User.findByIdAndDelete(id);

    res.status(200).json({ status: 'ok', message: 'User deleted successfully' });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ status: 'error', message: error.message });
  }
};
