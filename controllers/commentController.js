import Comment from '../models/comment.js';

export const deleteComment = async (req, res) => {
  try {
    const { id } = req.params;

    const comment = await Comment.findById(id);

    if (!comment) {
      return res.status(404).json({ status: 'error', message: 'Not found' });
    }
    // Проверка, что пользователь удаляет свой комментарий
    if (comment.author.toString() !== req.user.userId && req.user.role !== 'admin') {
      return res.status(403).json({ status: 'error', message: 'Forbidden' });
    }

    await Comment.findByIdAndDelete(id);

    res.status(200).json({ status: 'ok', message: 'Comment deleted successfully' });
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Что-то пошло не так' });
  }
};

export const updateComment = async (req, res) => {
  try {
    const { id } = req.params;
    const { text } = req.body;

    const comment = await Comment.findById(id);

    if (!comment) {
      return res.status(404).json({ status: 'error', message: 'Not found' });
    } else {
      // Проверка, что пользователь удаляет свой комментарий
      if (comment.author.toString() !== req.user.userId && req.user.role !== 'admin') {
        return res.status(403).json({ status: 'error', message: 'Forbidden' });
      }

      comment.text = text || comment.text;
      await comment.save();

      res.status(200).json({ status: 'ok', message: 'Comment updated successfully' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: 'error', message: 'Что-то пошло не так' });
  }
};
