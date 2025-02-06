import Result from "../base/result.js";
import { comments } from "../schema/comment.js";

class CommentRepository {
  async create(model) {
    const result = new Result("create comment");
    try {
      const createResult = await comments.create(model);
      return result.succeeded(
        "Comment created successfully",
        createResult.commentId,
        201
      );
    } catch (error) {
      console.error("Error in create:", error);
      return result.failed("Failed to create comment", undefined, 500);
    }
  }

  async delete(commentId) {
    const result = new Result("delete comment");
    try {
      const deleteResult = await comments.deleteOne({ commentId });
      if (deleteResult.deletedCount === 0) {
        return result.failed("Comment not found", commentId, 404);
      }
      return result.succeeded("Comment deleted successfully", commentId, 200);
    } catch (error) {
      console.error("Error in delete:", error);
      return result.failed("Failed to delete Comment", undefined, 500);
    }
  }

  async answer(model) {
    const result = new Result("answer comment");
    try {
      const updateResult = await comments.updateOne(
        { commentId: model.commentId },
        { $set: model }
      );
      if (updateResult.matchedCount === 0) {
        return result.failed("Comment not found", model.commentId, 404);
      }
      return result.succeeded(
        "Comment answered successfully",
        model.categoryId,
        200
      );
    } catch (error) {
      console.error("Error in update:", error);
      return result.failed("Failed to update Comment", undefined, 500);
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

  search = async (query = {}, page = 1, limit = 20) => {
    const r = new Result("search comments");
    try {
      let cats = comments.find({});
      // اضافه کردن فیلترها به کوئری
      if (query.commentId && query.commentId.trim().length > 0) {
        cats = cats.where("commentId").equals(query.commentId.trim());
      }
      if (query.text && query.text.trim().length > 0) {
        cats = cats
          .where("text")
          .equals({ $regex: query.text.trim(), $options: "i" });
      }
      if (query.answer && query.answer.trim().length > 0) {
        cats = cats
          .where("answer")
          .equals({ $regex: query.answer.trim(), $options: "i" });
      }
      if (query.isAccepted && query.isAccepted.trim().length > 0) {
        cats = cats
          .where("isAccepted")
          .equals({ $regex: query.isAccepted.trim(), $options: "i" });
      }
      if (query.serieId && query.serieId.trim().length > 0) {
        cats = cats
          .where("serieId")
          .equals({ $regex: query.serieId.trim(), $options: "i" });
      }
      if (query.movieId && query.movieId.trim().length > 0) {
        cats = cats
          .where("movieId")
          .equals({ $regex: query.movieId.trim(), $options: "i" });
      }
      if (query.userId && query.userId.trim().length > 0) {
        cats = cats
          .where("userId")
          .equals({ $regex: query.userId.trim(), $options: "i" });
      }

      // انتخاب فیلدهای مورد نیاز
      const q = cats.select([
        "commentId",
        "text",
        "answer",
        "isAccepted",
        "likeCount",
        "serieId",
        "movieId",
        "userId  ",
      ]);

      // دریافت تعداد کل مستندات مطابق با فیلترها
      const count = await comments.countDocuments(cats.getQuery());

      // دریافت نتایج صفحه‌بندی شده
      const results = await q
        .sort([["isAccepted", "desc"]])
        .skip((page - 1) * limit) // اصلاح صفحه‌بندی
        .limit(limit);

      // ساخت لیست داده‌ها
      const catsList = results.map((item) => ({
        commentId: item.commentId,
        text: item.text,
        answer: item.answer,
        isAccepted: item.isAccepted,
        likeCount: item.likeCount,
        serieId: item.serieId,
        movieId: item.movieId,
        userId: item.userId,
      }));
      // محاسبه تعداد کل صفحات
      const totalPages = Math.ceil(count / limit);

      return r.succeeded(
        "Comments fetched successfully",
        {
          data: catsList,
          pagination: {
            total: count,
            totalPages: totalPages,
            currentPage: page,
            pageSize: limit,
          },
        },
        200
      );
    } catch (error) {
      console.error("Error in search:", error);
      return r.failed("Failed to fetch comments", undefined, 500);
    }
  };
}

export default CommentRepository;
