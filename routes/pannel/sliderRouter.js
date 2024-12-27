import express from 'express';
import SliderController from '../../controllers/sliderController.js';

const sliderRouter = express.Router();
const sliderController = new SliderController();

// ایجاد اسلاید جدید
sliderRouter.post('/create', sliderController.create);

// حذف اسلاید بر اساس sliderId
sliderRouter.delete('/delete/:sliderId', sliderController.delete);

// بروزرسانی اطلاعات اسلاید
sliderRouter.put('/update', sliderController.update);

// بررسی وجود اسلاید با شناسه
sliderRouter.get('/exists/:sliderId', sliderController.isSliderExistedByThisId);

// دریافت یک اسلاید بر اساس sliderId
sliderRouter.get('/get/:sliderId', sliderController.get);

// دریافت تمام اسلایدها
sliderRouter.get('/getall', sliderController.getAll);

// جستجوی اسلایدها با توجه به پارامترها
sliderRouter.get('/search', sliderController.search);

export default sliderRouter;
