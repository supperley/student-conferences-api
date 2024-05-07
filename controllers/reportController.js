import * as jdenticon from 'jdenticon';
import path from 'path';
import fs from 'fs';
import Report from '../models/report.js';
import Comment from '../models/comment.js';
import { pdfToPng } from 'pdf-to-png-converter';

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
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: 'error', message: 'Internal server error' });
  }
};

export const getReportById = async (req, res) => {
  const { id: post_id } = req.params;
  try {
    const report = await Report.findById(post_id)
      .populate('author', ['_id', 'first_name', 'last_name', 'avatarUrl', 'position'])
      .populate('supervisor', ['_id', 'first_name', 'last_name', 'avatarUrl', 'position'])
      .populate('conference', ['_id', 'title']);

    if (!report) {
      return res.status(404).json({ status: 'error', message: 'Not found' });
    }

    const comments = await Comment.find({ post: post_id })
      .sort()
      .populate('author', ['_id', 'first_name', 'last_name', 'avatarUrl', 'position']);

    const reportWithComments = report.toObject(); // Преобразуем в обычный объект
    reportWithComments.comments = comments; // Добавляем поле `comments`

    res.json(reportWithComments);
  } catch (error) {
    console.error(error);
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
      let thumbUrl = report.thumbUrl;

      if (req.file && req.file.path) {
        console.log(req.file);
        filePath = `/${req.file.destination}/${req.file.filename}`;
        thumbUrl = null;

        switch (req.file.mimetype) {
          case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
            break;
          case 'application/pdf':
            const pngPages = await pdfToPng(
              req.file.path, // The function accepts PDF file path or a Buffer
              {
                outputFolder: 'uploads', // Folder to write output PNG files. If not specified, PNG output will be available only as a Buffer content, without saving to a file.
                outputFileMask: `thumb_${report?._id}`, // Output filename mask. Default value is 'buffer'.
                pagesToProcess: [1], // Subset of pages to convert (first page = 1), other pages will be skipped if specified.
              },
            );
            thumbUrl = `/${req.file.destination}/${pngPages[0]?.path.split('\\').pop()}`;
            break;
          default:
            break;
        }
      } else if (file === 'delete') {
        filePath = null;
        thumbUrl = null;
      }

      report.title = title || report.title;
      report.description = description || report.description;
      report.supervisor = supervisor || report.supervisor;
      report.status = status || report.status;
      report.fileUrl = filePath;
      report.thumbUrl = thumbUrl;

      const updatedReport = await report.save();

      res.status(200).json({ status: 'ok', message: 'Report updated successfully' });
    }
  } catch (error) {
    console.error(error);
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
    if (report.author.toString() !== req.user.userId && req.user.role !== 'admin') {
      return res.status(403).json({ status: 'error', message: 'Forbidden' });
    }

    await Report.findByIdAndDelete(id);

    res.status(200).json({ status: 'ok', message: 'Report deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: 'error', message: 'Что-то пошло не так' });
  }
};

export const createReportComment = async (req, res) => {
  try {
    const { author, text, parent_comment } = req.body;

    const { id: post } = req.params;

    console.log(req.params);

    // Проверяем поля
    if (!post || !author || !text) {
      return res.status(400).json({ status: 'error', message: 'Проверьте обязательные поля' });
    }

    const postExists = await Report.findById(post);
    if (!postExists) {
      return res.status(404).json({ status: 'error', message: 'Report not found' });
    }

    const comment = await Comment.create({
      post,
      author,
      text,
      parent_comment,
    });

    if (comment) {
      res.status(201).json(comment);
    } else {
      return res.status(400).json({ status: 'error', message: 'Invalid comment data' });
    }
  } catch (error) {
    console.error('Error in createReportComment:', error);
    return res.status(500).json({ status: 'error', message: 'Internal server error' });
  }
};
