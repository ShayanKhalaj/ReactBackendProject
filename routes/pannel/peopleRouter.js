import express from 'express';
import PeopleController from '../../controllers/peopleController.js';

const peopleRouter = express.Router();
const peopleController = new PeopleController();

// ایجاد شخص جدید
peopleRouter.post('/create', peopleController.create);

// حذف شخص بر اساس directorId
peopleRouter.delete('/delete/:directorId', peopleController.delete);

// بروزرسانی اطلاعات شخص
peopleRouter.put('/update', peopleController.update);

// دریافت یک شخص بر اساس directorId
peopleRouter.get('/get/:directorId', peopleController.get);

// دریافت تمام افراد
peopleRouter.get('/getall', peopleController.getAll);

// جستجوی افراد با توجه به پارامترها
peopleRouter.get('/search', peopleController.search);

export default peopleRouter;
