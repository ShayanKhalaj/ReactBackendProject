import Result from "../base/result.js";
import { categories } from "../schema/category.js";
import { movies } from "../schema/movie.js";
import { series } from "../schema/serie.js";

class CategoryRepository {
    async create(model) {
        const result = new Result('create category');
        try {
            const createResult = await categories.create(model);
            return result.succeeded('Category created successfully', createResult.categoryId, 201);
        } catch (error) {
            console.error("Error in create:", error);
            return result.failed('Failed to create category', undefined, 500);
        }
    }

    async hasCategoryDuplicatedCategoryByThisPersianNameAndLatinName(categoryPersianName, categoryLatinName) {
        try {
            const duplicate = await categories.find({
                categoryPersianName,
                categoryLatinName,
            });
            return duplicate.length > 0;
        } catch (error) {
            console.error("Error in checking duplicate category:", error);
            return false;
        }
    }

    async delete(categoryId) {
        const result = new Result('delete category');
        try {
            const deleteResult = await categories.deleteOne({ categoryId });
            if (deleteResult.deletedCount === 0) {
                return result.failed('Category not found', categoryId, 404);
            }
            return result.succeeded('Category deleted successfully', categoryId, 200);
        } catch (error) {
            console.error("Error in delete:", error);
            return result.failed('Failed to delete category', undefined, 500);
        }
    }

    async hasCategoryRelatedMoviesOrSeriesByThisId(categoryId) {
        try {
            const [relatedMovies, relatedSeries] = await Promise.all([
                movies.find({ categoryId }),
                series.find({ categoryId }),
            ]);
            return relatedMovies.length > 0 || relatedSeries.length > 0;
        } catch (error) {
            console.error("Error in checking related movies or series:", error);
            return false;
        }
    }

    async update(model) {
        const result = new Result('update category');
        try {
            const updateResult = await categories.updateOne(
                { categoryId: model.categoryId },
                { $set: model }
            );
            if (updateResult.matchedCount === 0) {
                return result.failed('Category not found', model.categoryId, 404);
            }
            return result.succeeded('Category updated successfully', model.categoryId, 200);
        } catch (error) {
            console.error("Error in update:", error);
            return result.failed('Failed to update category', undefined, 500);
        }
    }

    async isCategoryExistedByThisId(categoryId) {
        try {
            const category = await categories.findOne({ categoryId });
            return !!category;
        } catch (error) {
            console.error("Error in checking category existence:", error);
            return false;
        }
    }

    async get(categoryId) {
        try {
            return await categories.findOne({ categoryId });
        } catch (error) {
            console.error("Error in get:", error);
            return null;
        }
    }

    async getAll() {
        try {
            return await categories.find({});
        } catch (error) {
            console.error("Error in getAll:", error);
            return [];
        }
    }

    async search(query = {}, page = 1, limit = 10) {
        const result = new Result('search categories');
        try {
            // محاسبه‌ی تعداد آیتم‌هایی که باید رد شود
            const skip = (page - 1) * limit;

            // جستجو و دریافت دسته‌بندی‌ها
            const [categoriesList, total] = await Promise.all([
                categories.find(query).skip(skip).limit(limit),
                categories.countDocuments(query),
            ]);

            // محاسبه‌ی تعداد کل صفحات
            const totalPages = Math.ceil(total / limit);

            // ساختار پاسخ
            return result.succeeded('Categories fetched successfully', {
                data: categoriesList,
                pagination: {
                    total,
                    totalPages,
                    currentPage: page,
                    pageSize: limit,
                },
            }, 200);
        } catch (error) {
            console.error("Error in search:", error);
            return result.failed('Failed to fetch categories', undefined, 500);
        }
    }
}

export default CategoryRepository;
