import User from '../models/user.js';

export const getUserById = async (req, res) => {
  const { id } = req.params;
  const userId = req.user.userId;

  try {
    const user = await User.findById(userId);
    // const user = await prisma.user.findUnique({
    //   where: { id },
    //   include: {
    //     followers: true,
    //     following: true,
    //   },
    // });

    if (!user) {
      return res.status(404).json({ error: 'Пользователь не найден' });
    }

    res.json({ ...user });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
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
    if (id !== req.user.userId || req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Unauthorized' });
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
        status: true,
        message: 'Profile updated successfully',
        user: updatedUser,
      });
    } else {
      res.status(404).json({ status: false, message: 'User not found' });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ status: false, message: 'Internal server error' });
  }
};

export const changeUserPassword = async (req, res) => {
  try {
    const { userId } = req.user;

    const user = await User.findById(userId);

    if (user) {
      user.password = req.body.password;

      await user.save();

      user.password = undefined;

      res.status(201).json({
        status: true,
        message: `Password changed successfully`,
      });
    } else {
      res.status(404).json({ status: false, message: 'User not found' });
    }
  } catch (error) {
    console.log(error);
    return res.status(400).json({ status: false, message: error.message });
  }
};

export const activateUser = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id);

    if (user) {
      user.status = req.body.status; //!user.isActive

      await user.save();

      res.status(201).json({
        status: true,
        message: `User account has been ${user?.status === 'active' ? 'activated' : 'disabled'}`,
      });
    } else {
      res.status(404).json({ status: false, message: 'User not found' });
    }
  } catch (error) {
    console.log(error);
    return res.status(400).json({ status: false, message: error.message });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    await User.findByIdAndDelete(id);

    res.status(200).json({ status: true, message: 'User deleted successfully' });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ status: false, message: error.message });
  }
};
