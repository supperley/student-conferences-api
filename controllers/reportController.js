import * as jdenticon from 'jdenticon';
import path from 'path';
import fs from 'fs';
import Report from '../models/report.js';

export const createReport = async (req, res) => {
  try {
    const { title, description, supervisor, conference } = req.body;

    let filePath;

    if (req.file && req.file.path) {
      filePath = `${req.file.destination}/${req.file.filename}`;
    }

    // Проверяем поля
    if (!req.user || !conference || !title) {
      return res.status(400).json({ status: 'error', message: 'Проверьте обязательные поля' });
    }

    // if (!filePath) {
    //   // Генерируем для новой конференции
    //   const image = jdenticon.toPng(title, 200);
    //   const imageName = `report_${Date.now()}.png`;
    //   filePath = path.join('uploads', imageName);
    //   fs.writeFileSync(filePath, image);
    // }

    const report = await Report.create({
      title,
      description,
      conference,
      author: req.user?.userId,
      supervisor,
      fileUrl: `/${filePath}`,
    });

    if (report) {
      res.status(201).json(report);
    } else {
      return res.status(400).json({ status: 'error', message: 'Invalid report data' });
    }
  } catch (error) {
    console.error('Error in createReport:', error);
    return res.status(500).json({ status: 'error', message: 'Internal server error' });
  }
};

export const getAllReports = async (req, res) => {
  try {
    const reports = await Report.find({})
      .populate('author', ['_id', 'first_name', 'last_name', 'avatarUrl'])
      .populate('supervisor', ['_id', 'first_name', 'last_name', 'avatarUrl'])
      .populate('conference', ['_id', 'title']);
    res.json(reports);
  } catch (err) {
    res.status(500).json({ status: 'error', message: 'Internal server error' });
  }
};

export const getReportById = async (req, res) => {
  const { id } = req.params;
  try {
    const report = await Report.findById(id)
      .populate('author', ['_id', 'first_name', 'last_name', 'avatarUrl', 'position'])
      .populate('supervisor', ['_id', 'first_name', 'last_name', 'avatarUrl'])
      .populate('conference', ['_id', 'title']);

    if (!report) {
      return res.status(404).json({ status: 'error', message: 'Not found' });
    }

    res.json(report);
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Internal server error' });
  }
};

export const updateReport = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, supervisor, status, file } = req.body;

    const report = await Report.findById(id);

    if (!report) {
      return res.status(404).json({ status: 'error', message: 'Not found' });
    } else {
      // Проверка, что пользователь изменяет свою конференцию
      if (report.author.toString() !== req.user.userId && req.user.role !== 'admin') {
        console.log(req.user.userId);
        return res.status(403).json({ status: 'error', message: 'Forbidden' });
      }

      let filePath = report.fileUrl;

      if (req.file && req.file.path) {
        filePath = `/${req.file.destination}/${req.file.filename}`;
      } else if (file === 'delete') {
        filePath = null;
      }

      report.title = title || report.title;
      report.description = description || report.description;
      report.supervisor = supervisor || report.supervisor;
      report.status = status || report.status;
      report.fileUrl = filePath;

      const updatedReport = await report.save();

      res.status(200).json({ status: 'ok', message: 'Report updated successfully' });
    }
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Что-то пошло не так' });
  }
};

export const deleteReport = async (req, res) => {
  try {
    const { id } = req.params;

    const report = await Report.findById(id);

    if (!report) {
      return res.status(404).json({ status: 'error', message: 'Not found' });
    }
    // Проверка, что пользователь удаляет свою конференцию
    if (report.author.id !== req.user.userId || req.user.role !== 'admin') {
      return res.status(403).json({ status: 'error', message: 'Forbidden' });
    }

    await Report.findByIdAndDelete(id);

    res.status(200).json({ status: 'ok', message: 'Report deleted successfully' });
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Что-то пошло не так' });
  }
};
