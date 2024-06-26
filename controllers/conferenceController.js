import Docxtemplater from 'docxtemplater';
import fs from 'fs';
import * as jdenticon from 'jdenticon';
import path from 'path';
import PizZip from 'pizzip';
import Conference from '../models/conference.js';
import Report from '../models/report.js';

export const createConference = async (req, res) => {
  try {
    const { title, description, date, administrator, faculties, link } = req.body;

    let imagePath;

    if (req.file && req.file.path) {
      imagePath = `/${req.file.destination}/${req.file.filename}`;
    }

    // Проверяем поля
    if (!title || !administrator) {
      return res.status(400).json({ status: 'error', message: 'Проверьте обязательные поля' });
    }

    if (!imagePath) {
      // Генерируем для новой конференции
      const image = jdenticon.toPng(title, 200);
      const imageName = `conference-${Date.now()}.png`;
      imagePath = path.join('/uploads', imageName);
      fs.writeFileSync(path.resolve() + imagePath, image);
    }

    const conference = await Conference.create({
      title,
      description,
      date,
      administrator,
      faculties,
      link,
      imageUrl: imagePath,
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
    const conferences = await Conference.find({})
      .sort({ createdAt: -1 })
      .populate('administrator', [
        '_id',
        'first_name',
        'last_name',
        'patronymic',
        'position',
        'avatarUrl',
      ]);
    res.json(conferences);
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: 'error', message: 'Internal server error' });
  }
};

export const getConferenceById = async (req, res) => {
  const { id } = req.params;
  try {
    const conference = await Conference.findById(id).populate('administrator', [
      '_id',
      'first_name',
      'last_name',
      'patronymic',
      'position',
      'avatarUrl',
    ]);

    if (!conference) {
      return res.status(404).json({ status: 'error', message: 'Not found' });
    }

    res.json(conference);
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: 'error', message: 'Internal server error' });
  }
};

export const getConferenceParticipants = async (req, res) => {
  const { id } = req.params;
  try {
    const conference = await Conference.findById(id).populate('administrator', [
      '_id',
      'first_name',
      'last_name',
      'patronymic',
      'position',
      'avatarUrl',
    ]);

    if (!conference) {
      return res.status(404).json({ status: 'error', message: 'Not found' });
    }

    const reports = await Report.find({ conference: id })
      .sort({ createdAt: -1 })
      .populate('author', ['first_name', 'last_name', 'patronymic']);

    const templateFile = fs.readFileSync(path.resolve() + '/utils/participantsList.docx', 'binary');

    // Unzip the content of the file
    const zip = new PizZip(templateFile);

    // This will parse the template, and will throw an error if the template is
    // invalid, for example, if the template is "{user" (no closing tag)
    const doc = new Docxtemplater(zip, {
      paragraphLoop: true,
      linebreaks: true,
      nullGetter() {
        return '';
      },
    });

    console.log(reports);

    const filteredReports = reports.map((report, index) => {
      return {
        index: index + 1,
        first_name: report?.author?.first_name,
        last_name: report?.author?.last_name,
        patronymic: report?.author?.patronymic,
        title: report?.title,
        supervisor: report?.supervisor,
      };
    });

    doc.setData({ reports: filteredReports, title: conference?.title });

    try {
      doc.render();
      const buf = doc.getZip().generate({ type: 'nodebuffer' });
      // fs.writeFileSync(path.resolve(__dirname, "output.docx"), buf);

      res.set({
        'Content-Type': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'Content-Disposition': `attachment; filename="output.docx"`,
        'Content-Length': buf.length,
      });

      res.send(buf);
    } catch (error) {
      console.log(error);
    }

    //res.json(conference);
  } catch (error) {
    console.error(error);
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

      if (image === 'delete' || (req.file && req.file.path)) {
        conference.imageUrl &&
          fs.unlink(path.resolve() + conference.imageUrl, function (err) {
            if (err) {
              console.log('conference.imageUrl delete error', err);
            } else console.log('conference.imageUrl deleted');
          });
        imagePath = null;
      }

      if (req.file && req.file.path) {
        imagePath = `/${req.file.destination}/${req.file.filename}`;
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
    console.error(error);
    res.status(500).json({ status: 'error', message: 'Что-то пошло не так' });
  }
};

export const deleteConference = async (req, res) => {
  try {
    const { id } = req.params;

    const conference = await Conference.findById(id);

    if (!conference) {
      return res.status(404).json({ status: 'error', message: 'Not found' });
    }
    // Проверка, что пользователь удаляет свою конференцию
    if (conference.administrator.toString() !== req.user.userId && req.user.role !== 'admin') {
      return res.status(403).json({ status: 'error', message: 'Forbidden' });
    }

    conference.imageUrl &&
      fs.unlink(path.resolve() + conference.imageUrl, function (err) {
        if (err) {
          console.log('conference.imageUrl delete error', err);
        } else console.log('conference.imageUrl deleted');
      });

    await Conference.findByIdAndDelete(id);

    res.status(200).json({ status: 'ok', message: 'Conference deleted successfully' });
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Что-то пошло не так' });
  }
};
