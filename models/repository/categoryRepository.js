import Result from "../base/result.js";
import { categories } from "../schema/category.js";
import { movies } from "../schema/movie.js";

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

    search = async (query = {}, page = 1, limit = 20) => {
        const r = new Result('search categories');
        try {
            let cats = categories.find({});
            
            // اضافه کردن فیلترها به کوئری
            if (query.categoryId && query.categoryId.trim().length > 0) {
                cats = cats.where("categoryId").equals(query.categoryId.trim());
            }
            if (query.categoryPersianName && query.categoryPersianName.trim().length > 0) {
                cats = cats.where("categoryPersianName").equals({ $regex: query.categoryPersianName.trim(), $options: 'i' });
            }
            if (query.categoryLatinName && query.categoryLatinName.trim().length > 0) {
                cats = cats.where("categoryLatinName").equals({ $regex: query.categoryLatinName.trim(), $options: 'i' });
            }
            if (query.summary && query.summary.trim().length > 0) {
                cats = cats.where("summary").equals({ $regex: query.summary.trim(), $options: 'i' });
            }
            if (query.description && query.description.trim().length > 0) {
                cats = cats.where("description").equals({ $regex: query.description.trim(), $options: 'i' });
            }
            if (query.categoryImageUrl && query.categoryImageUrl.trim().length > 0) {
                cats = cats.where("categoryImageUrl").equals({ $regex: query.categoryImageUrl.trim(), $options: 'i' });
            }
    
            // انتخاب فیلدهای مورد نیاز
            const q = cats.select([
                "categoryId", 
                "categoryPersianName", 
                "categoryLatinName", 
                "summary", 
                "description", 
                "categoryImageUrl"
            ]);
    
            // دریافت تعداد کل مستندات مطابق با فیلترها
            const count = await categories.countDocuments(cats.getQuery());
    
            // دریافت نتایج صفحه‌بندی شده
            const results = await q
                .sort([["categoryPersianName", "desc"]])
                .skip((page - 1) * limit)  // اصلاح صفحه‌بندی
                .limit(limit);
    
            // ساخت لیست داده‌ها
            const catsList = results.map(item => ({
                categoryId: item.categoryId,
                categoryPersianName: item.categoryPersianName,
                categoryLatinName: item.categoryLatinName,
                description: item.description,
                summary: item.summary,
                categoryImageUrl: item.categoryImageUrl,
            }));
            // محاسبه تعداد کل صفحات
            const totalPages = Math.ceil(count / limit);
    
            return r.succeeded('Categories fetched successfully', {
                data: catsList,
                pagination: {
                    total: count,
                    totalPages: totalPages,
                    currentPage: page,
                    pageSize: limit,
                },
            }, 200);
        } catch (error) {
            console.error("Error in search:", error);
            return r.failed('Failed to fetch categories', undefined, 500);
        }
    };
    
    
    
    
    
}

export default CategoryRepository;
