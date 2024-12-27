import express from 'express';
import CategoryController from '../../controllers/categoryController.js';

const categoryRouter = express.Router();
const categoryController = new CategoryController();

// متدهای GET
categoryRouter.get('/getall', categoryController.getAll); // گرفتن همه دسته‌بندی‌ها
categoryRouter.get('/get/:id', categoryController.get); // گرفتن دسته‌بندی خاص با شناسه
categoryRouter.get('/search', categoryController.search); // جستجو با استفاده از صفحه‌بندی

// متدهای POST
categoryRouter.post('/create', categoryController.create); // ایجاد دسته‌بندی جدید

// متدهای DELETE
categoryRouter.delete('/delete/:id', categoryController.delete); // حذف دسته‌بندی خاص

// متدهای PUT
categoryRouter.put('/update', categoryController.update); // به‌روزرسانی دسته‌بندی


export default categoryRouter;
