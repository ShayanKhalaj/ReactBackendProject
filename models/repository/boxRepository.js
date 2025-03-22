import Result from "../base/result.js";
import { boxes } from "../schema/box.js";
import { movies } from "../schema/movie.js";

class BoxRepository {
  async create(model) {
    const result = new Result("create box");
    try {
      const createResult = await boxes.create(model);
      return result.succeeded(
        "Box created successfully",
        createResult.boxId,
        201
      );
    } catch (error) {
      console.error("Error in create:", error);
      return result.failed("Failed to create box", undefined, 500);
    }
  }

  async hasBoxDuplicatedBoxByThisPersianAndLatinName(
    boxPersianTitle,
    boxLatinTitle
  ) {
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
    const result = new Result("delete box");
    try {
      const deleteResult = await boxes.deleteOne({ boxId });
      if (deleteResult.deletedCount === 0) {
        return result.failed("Box not found", boxId, 404);
      }
      return result.succeeded("Box deleted successfully", boxId, 200);
    } catch (error) {
      console.error("Error in delete:", error);
      return result.failed("Failed to delete box", undefined, 500);
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
    const result = new Result("update box");
    try {
      const updateResult = await boxes.updateOne(
        { boxId: model.boxId },
        { $set: { boxes: model } }
      );
      if (updateResult.matchedCount === 0) {
        return result.failed("Box not found", model.boxId, 404);
      }
      return result.succeeded("Box updated successfully", model.boxId, 200);
    } catch (error) {
      console.error("Error in update:", error);
      return result.failed("Failed to update box", undefined, 500);
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
      const box = await boxes.findOne({ boxId: boxId });
      return box;
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

  search = async (query = {}, page = 1, limit = 20) => {
    const r = new Result("search boxes");
    try {
      let cats = boxes.find({});

      // اضافه کردن فیلترها به کوئری
      if (query.boxId && query.boxId.trim().length > 0) {
        cats = cats.where("boxId").equals(query.boxId.trim());
      }
      if (query.boxPersianTitle && query.boxPersianTitle.trim().length > 0) {
        cats = cats
          .where("boxPersianTitle")
          .equals({ $regex: query.boxPersianTitle.trim(), $options: "i" });
      }
      if (query.boxLatinTitle && query.boxLatinTitle.trim().length > 0) {
        cats = cats
          .where("boxLatinTitle")
          .equals({ $regex: query.boxLatinTitle.trim(), $options: "i" });
      }
      if (query.description && query.description.trim().length > 0) {
        cats = cats
          .where("description")
          .equals({ $regex: query.description.trim(), $options: "i" });
      }

      // انتخاب فیلدهای مورد نیاز
      const q = cats.select([
        "boxId",
        "boxPersianTitle",
        "boxLatinTitle",
        "description",
        "position",
        "pageUrl",
        "movies"
      ]);

      // دریافت تعداد کل مستندات مطابق با فیلترها
      const count = await boxes.countDocuments(cats.getQuery());

      // دریافت نتایج صفحه‌بندی شده
      const results = await q
        .sort([["boxPersianTitle", "desc"]])
        .skip((page - 1) * limit) // اصلاح صفحه‌بندی
        .limit(limit);

      // ساخت لیست داده‌ها
      const catsList = results.map((item) => ({
        boxId:item.boxId,
        boxPersianTitle:item.boxPersianTitle,
        boxLatinTitle:item.boxLatinTitle,
        description:item.description,
        position:item.position,
        pageUrl:item.pageUrl,
        movies:item.movies
      }));
      // محاسبه تعداد کل صفحات
      const totalPages = Math.ceil(count / limit);

      return r.succeeded(
        "Boxes fetched successfully",
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
      return r.failed("Failed to fetch boxes", undefined, 500);
    }
  };
}

export default BoxRepository;
