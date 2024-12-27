import Result from "../base/result.js";
import { boxes } from "../schema/box.js";
import { movies } from "../schema/movie.js";
import { series } from "../schema/serie.js";

class BoxRepository{
    async create(model) {
        const result = new Result('create box');
        try {
            const createResult = await boxes.create(model);
            return result.succeeded('Box created successfully', createResult.boxId, 201);
        } catch (error) {
            console.error("Error in create:", error);
            return result.failed('Failed to create box', undefined, 500);
        }
    }

    
    async hasBoxDuplicatedBoxByThisPersianAndLatinName(boxPersianTitle, boxLatinTitle) {
        try {
            const duplicate = await boxes.find({
                boxPersianTitle,
                boxLatinTitle,
            });
            return duplicate.length > 0;
        } catch (error) {
            console.error("Error in checking duplicate box:", error);
            return false;
        }
    }

    async delete(boxId) {
        const result = new Result('delete box');
        try {
            const deleteResult = await boxes.deleteOne({ boxId });
            if (deleteResult.deletedCount === 0) {
                return result.failed('Box not found', boxId, 404);
            }
            return result.succeeded('Box deleted successfully', boxId, 200);
        } catch (error) {
            console.error("Error in delete:", error);
            return result.failed('Failed to delete box', undefined, 500);
        }
    }

    async hasBoxRelatedMoviesOrSeriesByThisId(boxId) {
        try {
            const [relatedMovies, relatedSeries] = await Promise.all([
                movies.find({ boxId }),
                series.find({ boxId }),
            ]);
            return relatedMovies.length > 0 || relatedSeries.length > 0;
        } catch (error) {
            console.error("Error in checking related movies or series:", error);
            return false;
        }
    }

    async update(model) {
        const result = new Result('update box');
        try {
            const updateResult = await boxes.updateOne(
                { boxId: model.boxId },
                { $set: {boxes:model} }
            );
            if (updateResult.matchedCount === 0) {
                return result.failed('Box not found', model.boxId, 404);
            }
            return result.succeeded('Box updated successfully', model.boxId, 200);
        } catch (error) {
            console.error("Error in update:", error);
            return result.failed('Failed to update box', undefined, 500);
        }
    }

    async isBoxExistedByThisId(boxId) {
        try {
            const box = await boxes.findOne({ boxId });
            return !!box;
        } catch (error) {
            console.error("Error in checking box existence:", error);
            return false;
        }
    }

    async get(boxId) {
        try {
            const box = await boxes.findOne({ boxId:boxId });
            return box
        } catch (error) {
            console.error("Error in get:", error);
            return null;
        }
    }

    async getAll() {
        try {
            return await boxes.find({});
        } catch (error) {
            console.error("Error in getAll:", error);
            return [];
        }
    }

    async search(query = {}, page = 1, limit = 10) {
        const result = new Result('search boxes');
        try {
            // محاسبه‌ی تعداد آیتم‌هایی که باید رد شود
            const skip = (page - 1) * limit;

            // جستجو و دریافت دسته‌بندی‌ها
            const [boxesList, total] = await Promise.all([
                boxes.find(query).skip(skip).limit(limit),
                boxes.countDocuments(query),
            ]);

            // محاسبه‌ی تعداد کل صفحات
            const totalPages = Math.ceil(total / limit);

            // ساختار پاسخ
            return {
                data: boxesList,
                pagination: {
                    total,
                    totalPages,
                    currentPage: page,
                    pageSize: limit,
                },
            }
        } catch (error) {
            console.error("Error in search:", error);
            return result.failed('Failed to fetch boxes', undefined, 500);
        }
    }
}

export default BoxRepository