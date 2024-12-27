import CategoryRepository from "../models/repository/categoryRepository.js";

const categoryRepo = new CategoryRepository();

class CategoryController {
    async create(req, res) {
        const { body } = req;

        // بررسی تکراری بودن
        const isDuplicate = await categoryRepo.hasCategoryDuplicatedCategoryByThisPersianNameAndLatinName(
            body.categoryPersianName,
            body.categoryLatinName
        );
        if (isDuplicate) {
            return res.status(400).json({ message: "Duplicate category detected" });
        }

        // ایجاد دسته‌بندی
        const result = await categoryRepo.create(body);
        return res.status(result.statusCode).json(result);
    }

    async get(req, res) {
        const { id } = req.params;
        const category = await categoryRepo.get(id);
        if (category) {
            return res.status(200).json({ message: "Category fetched successfully", data: category });
        }
        return res.status(404).json({ message: "Category not found" });
    }

    async getAll(req, res) {
        const categories = await categoryRepo.getAll();
        return res.status(200).json({ message: "All categories fetched", data: categories });
    }

    async delete(req, res) {
        const { id } = req.params;

        // بررسی ارتباط داشتن
        const hasRelated = await categoryRepo.hasCategoryRelatedMoviesOrSeriesByThisId(id);
        if (hasRelated) {
            return res.status(400).json({ message: "Category has related movies or series and cannot be deleted" });
        }

        // حذف دسته‌بندی
        const result = await categoryRepo.delete(id);
        return res.status(result.statusCode).json(result);
    }

    async update(req, res) {
        const { body } = req;

        // بررسی وجود داشتن دسته‌بندی
        const isExisted = await categoryRepo.isCategoryExistedByThisId(body.categoryId);
        if (!isExisted) {
            return res.status(404).json({ message: "Category not found" });
        }

        // به‌روزرسانی دسته‌بندی
        const result = await categoryRepo.update(body);
        return res.status(result.statusCode).json(result);
    }

    async search(req, res) {
        const { page = 1, limit = 10, ...query } = req.query; // خواندن فیلتر و پارامترهای صفحه‌بندی
        const result = await categoryRepo.search(query, parseInt(page, 10), parseInt(limit, 10));
        return res.status(result.statusCode).json(result);
    }

}

export default CategoryController;
