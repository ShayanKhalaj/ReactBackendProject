import CommentRepository from "../models/repository/CommentRepository.js";



const commentRepo = new CommentRepository();

class CommentController {
    async create(req, res) {
        const { body } = req;

        try {
            // بررسی تکراری بودن یا شرایط خاص
            const result = await commentRepo.create(body);
            return res.status(result.status).json(result); // ارسال نتیجه ایجاد کامنت
        } catch (error) {
            console.error('Error creating comment:', error);
            return res.status(500).json({ message: 'Failed to create comment' });
        }
    }

    async get(req, res) {
        const { commentId } = req.params;

        try {
            const comment = await commentRepo.get(commentId);
            if (comment) {
                return res.status(200).json({ message: "Comment fetched successfully", data: comment });
            }
            return res.status(404).json({ message: "Comment not found" });
        } catch (error) {
            console.error('Error fetching comment:', error);
            return res.status(500).json({ message: 'Failed to fetch comment' });
        }
    }

    async getAll(req, res) {
        try {
            const comments = await commentRepo.getAll();
            return res.status(200).json({ message: "All comments fetched", data: comments });
        } catch (error) {
            console.error('Error fetching all comments:', error);
            return res.status(500).json({ message: 'Failed to fetch comments' });
        }
    }

    async delete(req, res) {
        const { commentId } = req.params;

        try {
            const result = await commentRepo.delete(commentId);
            return res.status(result.status).json(result); // ارسال نتیجه حذف کامنت
        } catch (error) {
            console.error('Error deleting comment:', error);
            return res.status(500).json({ message: 'Failed to delete comment' });
        }
    }

    async answer(req, res) {
        const { body } = req;

        try {
            // بررسی وجود کامنت
            const result = await commentRepo.answer(body);
            return res.status(result.status).json(result); // ارسال نتیجه پاسخ به کامنت
        } catch (error) {
            console.error('Error answering comment:', error);
            return res.status(500).json({ message: 'Failed to answer comment' });
        }
    }

    async search(req, res) {
        const { page = 1, limit = 10, ...query } = req.query;

        try {
            const result = await commentRepo.search(query, parseInt(page), parseInt(limit));
            return res.status(result.status).json(result); // ارسال نتایج جستجو
        } catch (error) {
            console.error('Error searching comments:', error);
            return res.status(500).json({ message: 'Failed to search comments' });
        }
    }
}

export default CommentController;
