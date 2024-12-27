import express from 'express';
import JobController from '../../controllers/jobController.js';

const jobRouter = express.Router();
const jobController = new JobController();

// ایجاد شغل جدید
jobRouter.post('/create', jobController.create);

// حذف شغل بر اساس jobId
jobRouter.delete('/delete/:jobId', jobController.delete);

// بروزرسانی شغل
jobRouter.put('/update', jobController.update);

// دریافت یک شغل بر اساس jobId
jobRouter.get('/get/:jobId', jobController.get);

// دریافت همه شغل‌ها
jobRouter.get('/getall', jobController.getAll);

// جستجوی شغل‌ها
jobRouter.get('/search', jobController.search);

export default jobRouter;
