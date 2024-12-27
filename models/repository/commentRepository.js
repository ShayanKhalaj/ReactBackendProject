import Result from "../base/result.js";
import { comments } from "../schema/comment.js";

class CommentRepository{
    async create(model) {
        const result = new Result('create comment');
        try {
            const createResult = await comments.create(model);
            return result.succeeded('Comment created successfully', createResult.commentId, 201);
        } catch (error) {
            console.error("Error in create:", error);
            return result.failed('Failed to create comment', undefined, 500);
        }
    }


    async delete(commentId) {
        const result = new Result('delete comment');
        try {
            const deleteResult = await comments.deleteOne({ commentId });
            if (deleteResult.deletedCount === 0) {
                return result.failed('Comment not found', commentId, 404);
            }
            return result.succeeded('Comment deleted successfully', commentId, 200);
        } catch (error) {
            console.error("Error in delete:", error);
            return result.failed('Failed to delete Comment', undefined, 500);
        }
    }

    async answer(model) {
        const result = new Result('answer comment');
        try {
            const updateResult = await comments.updateOne(
                { commentId: model.commentId },
                { $set: model }
            );
            if (updateResult.matchedCount === 0) {
                return result.failed('Comment not found', model.commentId, 404);
            }
            return result.succeeded('Comment answered successfully', model.categoryId, 200);
        } catch (error) {
            console.error("Error in update:", error);
            return result.failed('Failed to update Comment', undefined, 500);
        }
    }

    async get(commentId) {
        try {
            return await comments.findOne({ commentId });
        } catch (error) {
            console.error("Error in get:", error);
            return null;
        }
    }

    async getAll() {
        try {
            return await comments.find({});
        } catch (error) {
            console.error("Error in getAll:", error);
            return [];
        }
    }

    async search(query = {}, page = 1, limit = 10) {
        const result = new Result('search comments');
        try {
            // محاسبه‌ی تعداد آیتم‌هایی که باید رد شود
            const skip = (page - 1) * limit;

            // جستجو و دریافت دسته‌بندی‌ها
            const [commentList, total] = await Promise.all([
                comments.find(query).skip(skip).limit(limit),
                comments.countDocuments(query),
            ]);

            // محاسبه‌ی تعداد کل صفحات
            const totalPages = Math.ceil(total / limit);

            // ساختار پاسخ
            return result.succeeded('Comments fetched successfully', {
                data: commentList,
                pagination: {
                    total,
                    totalPages,
                    currentPage: page,
                    pageSize: limit,
                },
            }, 200);
        } catch (error) {
            console.error("Error in search:", error);
            return result.failed('Failed to fetch comments', undefined, 500);
        }
    }
}

export default CommentRepository