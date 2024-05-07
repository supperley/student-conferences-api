import News from '../models/news.js';

export const createNews = async (req, res) => {
  try {
    const { title, description, faculties, chip } = req.body;

    let imagePath;

    if (req.file && req.file.path) {
      imagePath = `${req.file.destination}/${req.file.filename}`;
    }

    // Проверяем поля
    if (!title) {
      return res.status(400).json({ status: 'error', message: 'Проверьте обязательные поля' });
    }

    const news = await News.create({
      title,
      description,
      author: req.user.userId,
      faculties,
      chip,
      imageUrl: imagePath && `/${imagePath}`,
    });

    if (news) {
      res.status(201).json(news);
    } else {
      return res.status(400).json({ status: 'error', message: 'Invalid news data' });
    }
  } catch (error) {
    console.error('Error in createNews:', error);
    return res.status(500).json({ status: 'error', message: 'Internal server error' });
  }
};

export const getAllNews = async (req, res) => {
  try {
    const news = await News.find({}).populate('author', [
      '_id',
      'first_name',
      'last_name',
      'avatarUrl',
    ]);
    res.json(news);
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: 'error', message: 'Internal server error' });
  }
};

export const getNewsById = async (req, res) => {
  const { id } = req.params;
  try {
    const news = await News.findById(id).populate('author', [
      '_id',
      'first_name',
      'last_name',
      'avatarUrl',
      'position',
    ]);

    if (!news) {
      return res.status(404).json({ status: 'error', message: 'Not found' });
    }

    res.json(news);
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: 'error', message: 'Internal server error' });
  }
};
