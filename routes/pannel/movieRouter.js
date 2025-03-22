import express from 'express';
import MovieController from '../../controllers/movieController.js';

const movieRouter = express.Router();
const movieController = new MovieController();

// ایجاد فیلم جدید
movieRouter.post('/create', movieController.create);

// حذف فیلم بر اساس movieId
movieRouter.delete('/delete/:movieId', movieController.delete);

// بروزرسانی فیلم
movieRouter.put('/update', movieController.update);

// دریافت یک فیلم بر اساس movieId
movieRouter.get('/get/:movieId', movieController.get);

// دریافت همه فیلم‌ها
movieRouter.get('/getall', movieController.getAll);

// جستجوی فیلم‌ها
movieRouter.get('/search', movieController.search);

export default movieRouter;
