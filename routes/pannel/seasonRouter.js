import express from 'express';
import SeasonController from '../../controllers/seasonController.js';

const seasonRouter = express.Router();
const seasonController = new SeasonController();

// ایجاد فصل جدید
seasonRouter.post('/create', seasonController.create);

// حذف فصل بر اساس seasonId
seasonRouter.delete('/delete/:seasonId', seasonController.delete);

// بروزرسانی اطلاعات فصل
seasonRouter.put('/update', seasonController.update);

// دریافت یک فصل بر اساس seasonId
seasonRouter.get('/get/:seasonId', seasonController.get);

// دریافت تمام فصل‌ها
seasonRouter.get('/getall', seasonController.getAll);

// جستجوی فصل‌ها با توجه به پارامترها
seasonRouter.get('/search', seasonController.search);

export default seasonRouter;
