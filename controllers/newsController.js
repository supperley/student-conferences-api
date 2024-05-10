import path from 'path';
import News from '../models/news.js';
import fs from 'fs';

export const createNews = async (req, res) => {
  try {
    const { title, description, faculties, chip } = req.body;

    let imagePath;

    if (req.file && req.file.path) {
      imagePath = `/${req.file.destination}/${req.file.filename}`;
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
      imageUrl: imagePath,
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

export const deleteNews = async (req, res) => {
  try {
    const { id } = req.params;

    const news = await News.findById(id);

    if (!news) {
      return res.status(404).json({ status: 'error', message: 'Not found' });
    }
    // Проверка, что пользователь удаляет свою новость
    if (news.author.toString() !== req.user.userId && req.user.role !== 'admin') {
      return res.status(403).json({ status: 'error', message: 'Forbidden' });
    }

    news.imageUrl &&
      fs.unlink(path.resolve() + news.imageUrl, function (err) {
        if (err) {
          console.log('news.imageUrl delete error', err);
        } else console.log('news.imageUrl deleted');
      });

    await News.findByIdAndDelete(id);

    res.status(200).json({ status: 'ok', message: 'News deleted successfully' });
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Что-то пошло не так' });
  }
};

export const updateNews = async (req, res) => {
  try {
    const { id } = req.params;

    const { title, description, faculties, chip, image } = req.body;

    const news = await News.findById(id);

    if (!news) {
      return res.status(404).json({ status: 'error', message: 'Not found' });
    } else {
      if (news.author.toString() !== req.user.userId && req.user.role !== 'admin') {
        return res.status(403).json({ status: 'error', message: 'Forbidden' });
      }

      let imagePath = news.imageUrl;

      if (image === 'delete') {
        news.imageUrl &&
          fs.unlink(path.resolve() + news.imageUrl, function (err) {
            if (err) {
              console.log('news.imageUrl delete error', err);
            } else console.log('news.imageUrl deleted');
          });

        imagePath = null;
      }

      if (req.file && req.file.path) {
        imagePath = `/${req.file.destination}/${req.file.filename}`;
      }

      news.title = title || news.title;
      news.description = description || news.description;
      news.faculties = faculties || news.faculties;
      news.chip = chip || news.chip;
      news.imageUrl = imagePath;

      const updatedNews = await news.save();

      res.status(200).json({ status: 'ok', message: 'News updated successfully' });
    }
  } catch (error) {
    console.error('Error in updateNews:', error);
    return res.status(500).json({ status: 'error', message: 'Internal server error' });
  }
};
