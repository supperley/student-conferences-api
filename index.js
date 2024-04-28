import cookieParser from 'cookie-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import morgan from 'morgan';
import fs from 'fs';
import { errorHandler, routeNotFound } from './middlewares/errorMiddleware.js';
import routes from './routes/index.js';
import { dbConnection } from './utils/index.js';

dotenv.config();

dbConnection();

const PORT = process.env.PORT || 3000;

const app = express();

app.use(
  cors({
    origin: ['http://localhost:3000', 'http://localhost:5173', 'http://[::1]:5173'],
    methods: ['GET', 'POST', 'DELETE', 'PUT', 'PATCH'],
    credentials: true,
  }),
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());

if (!fs.existsSync('uploads')) {
  fs.mkdirSync('uploads');
}

// Раздавать статические файлы из папки 'uploads'
app.use('/uploads', express.static('uploads'));

app.use(morgan('dev'));

app.use('/api', routes);

app.use(routeNotFound);
app.use(errorHandler);

app.listen(PORT, () => console.log(`Server listening on ${PORT}`));
