import * as jdenticon from 'jdenticon';
import path from 'path';
import fs from 'fs';
import Conference from '../models/conference.js';

export const createConference = async (req, res) => {
  try {
    const { title, description, date, administrator, faculties, link } = req.body;

    let imagePath;

    if (req.file && req.file.path) {
      imagePath = `${req.file.destination}/${req.file.filename}`;
    }

    // Проверяем поля
    if (!title || !administrator) {
      return res.status(400).json({ status: 'error', message: 'Проверьте обязательные поля' });
    }

    if (!imagePath) {
      // Генерируем аватар для нового пользователя
      const image = jdenticon.toPng(title, 200);
      const imageName = `$conference_${Date.now()}.png`;
      imagePath = path.join('uploads', imageName);
      fs.writeFileSync(imagePath, image);
    }

    const conference = await Conference.create({
      title,
      description,
      date,
      administrator,
      faculties,
      link,
      imageUrl: `/${imagePath}`,
    });

    if (conference) {
      res.status(201).json(conference);
    } else {
      return res.status(400).json({ status: 'error', message: 'Invalid conference data' });
    }
  } catch (error) {
    console.error('Error in createConference:', error);
    return res.status(500).json({ status: 'error', message: 'Internal server error' });
  }
};

export const getAllConferences = async (req, res) => {
  try {
    const conferences = await Conference.find({}).populate('administrator');
    res.json(conferences);
  } catch (err) {
    res.status(500).json({ status: 'error', message: 'Internal server error' });
  }
};

export const getConferenceById = async (req, res) => {
  const { id } = req.params;
  try {
    const conference = await Conference.findById(id).populate('administrator');

    if (!conference) {
      return res.status(404).json({ status: 'error', message: 'Not found' });
    }

    res.json(conference);
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Internal server error' });
  }
};

export const updateConference = async (req, res) => {
  try {
    const { id } = req.params;

    const { title, description, date, administrator, faculties, image, link, status } = req.body;

    const conference = await Conference.findById(id);

    if (!conference) {
      return res.status(404).json({ status: 'error', message: 'Not found' });
    } else {
      // Проверка, что пользователь изменяет свою конференцию
      if (conference.administrator.toString() !== req.user.userId && req.user.role !== 'admin') {
        console.log(req.user.userId);
        return res.status(403).json({ status: 'error', message: 'Forbidden' });
      }

      let imagePath = conference.imageUrl;

      if (req.file && req.file.path) {
        imagePath = `/${req.file.destination}/${req.file.filename}`;
      } else if (image === 'delete') {
        imagePath = null;
      }

      conference.title = title || conference.title;
      conference.description = description || conference.description;
      conference.date = date || conference.date;
      conference.administrator = administrator || conference.administrator;
      conference.faculties = faculties || conference.faculties;
      conference.link = link || conference.link;
      conference.status = status || conference.status;
      conference.imageUrl = imagePath;

      const updatedConference = await conference.save();

      res.status(200).json({ status: 'ok', message: 'Conference updated successfully' });
    }
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Что-то пошло не так' });
  }
};

// export const deleteConference = async (req, res) => {
//   try {
//     const { id } = req.params;

//     const conference = await Conference.findById(id);

//     if (!conference) {
//       return res.status(404).json({ status: 'error', message: 'Not found' });
//     }
//     // Проверка, что пользователь удаляет свою конференцию
//     if (conference.administrator.id !== req.user.userId || req.user.role !== 'admin') {
//       return res.status(403).json({ status: 'error', message: 'Forbidden' });
//     }

//     await Conference.findByIdAndDelete(id);

//     res.status(200).json({ status: 'ok', message: 'Conference deleted successfully' });
//   } catch (error) {
//     res.status(500).json({ status: 'error', message: 'Что-то пошло не так' });
//   }
// };
