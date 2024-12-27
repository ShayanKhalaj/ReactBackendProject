import express from 'express';
import SerieController from '../../controllers/serieController.js';

const serieRouter = express.Router();
const serieController = new SerieController();

// ایجاد سریال جدید
serieRouter.post('/create', serieController.create);

// حذف سریال بر اساس serieId
serieRouter.delete('/delete/:serieId', serieController.delete);

// بروزرسانی اطلاعات سریال
serieRouter.put('/update', serieController.update);

// بررسی وجود سریال با شناسه
serieRouter.get('/exists/:serieId', serieController.isSerieExistedByThisId);

// دریافت یک سریال بر اساس serieId
serieRouter.get('/get/:serieId', serieController.get);

// دریافت تمام سریال‌ها
serieRouter.get('/getall', serieController.getAll);

// جستجوی سریال‌ها با توجه به پارامترها
serieRouter.get('/search', serieController.search);

export default serieRouter;
