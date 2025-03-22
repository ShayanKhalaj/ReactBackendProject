import express from 'express';
import GenreController from '../../controllers/genreController.js';

const genreRouter = express.Router();
const genreController = new GenreController();

// ایجاد ژانر جدید
genreRouter.post('/create', genreController.create);

// حذف ژانر بر اساس genreId
genreRouter.delete('/delete/:genreId', genreController.delete);

// بروزرسانی ژانر
genreRouter.put('/update', genreController.update);

// دریافت یک ژانر بر اساس genreId
genreRouter.get('/get/:genreId', genreController.get);

// دریافت همه ژانرها
genreRouter.get('/getall', genreController.getAll);

// جستجوی ژانرها
genreRouter.get('/search', genreController.search);

export default genreRouter;
