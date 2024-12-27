import express from 'express';
import EpisodeController from '../../controllers/EpisodeController.js';


const episodeRouter = express.Router();
const episodeController = new EpisodeController();

// ایجاد اپیزود جدید
episodeRouter.post('/create', episodeController.create);

// حذف اپیزود بر اساس episodeId
episodeRouter.delete('/delete/:episodeId', episodeController.delete);

// بروزرسانی اپیزود
episodeRouter.put('/update', episodeController.update);

// دریافت یک اپیزود بر اساس episodeId
episodeRouter.get('/get/:episodeId', episodeController.get);

// دریافت همه اپیزودها
episodeRouter.get('/getall', episodeController.getAll);

// جستجوی اپیزودها
episodeRouter.get('/search', episodeController.search);

export default episodeRouter;
