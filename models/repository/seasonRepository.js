import Result from "../base/result.js";
import { seasons } from "../schema/season.js";

class SeasonRepository {
  async create(model) {
    const result = new Result("create season");
    try {
      const createResult = await seasons.create(model);
      return result.succeeded(
        "Season created successfully",
        createResult.seasonId,
        201
      );
    } catch (error) {
      console.error("Error in create:", error);
      return result.failed("Failed to create season", undefined, 500);
    }
  }

  async delete(seasonId) {
    const result = new Result("delete season");
    try {
      const deleteResult = await seasons.deleteOne({ seasonId });
      if (deleteResult.deletedCount === 0) {
        return result.failed("Season not found", seasonId, 404);
      }
      return result.succeeded("Season deleted successfully", seasonId, 200);
    } catch (error) {
      console.error("Error in delete:", error);
      return result.failed("Failed to delete season", undefined, 500);
    }
  }

  async update(model) {
    const result = new Result("update season");
    try {
      const updateResult = await seasons.updateOne(
        { seasonId: model.seasonId },
        { $set: model }
      );
      if (updateResult.matchedCount === 0) {
        return result.failed("Season not found", model.seasonId, 404);
      }
      return result.succeeded(
        "Season updated successfully",
        model.seasonId,
        200
      );
    } catch (error) {
      console.error("Error in update:", error);
      return result.failed("Failed to update season", undefined, 500);
    }
  }

  async get(seasonId) {
    try {
      return await seasons.findOne({ seasonId });
    } catch (error) {
      console.error("Error in get:", error);
      return null;
    }
  }

  async getAll() {
    try {
      return await seasons.find({});
    } catch (error) {
      console.error("Error in getAll:", error);
      return [];
    }
  }

  search = async (query = {}, page = 1, limit = 20) => {
    const r = new Result("search seasons");
    try {
      let cats = seasons.find({});
      // اضافه کردن فیلترها به کوئری
      if (query.seasonId && query.seasonId.trim().length > 0) {
        cats = cats.where("seasonId").equals(query.seasonId.trim());
      }
      if (
        query.seasonPersianTitle &&
        query.seasonPersianTitle.trim().length > 0
      ) {
        cats = cats
          .where("seasonPersianTitle")
          .equals({ $regex: query.seasonPersianTitle.trim(), $options: "i" });
      }
      if (query.seasonLatinTitle && query.seasonLatinTitle.trim().length > 0) {
        cats = cats
          .where("seasonLatinTitle")
          .equals({ $regex: query.seasonLatinTitle.trim(), $options: "i" });
      }
      if (query.summary && query.summary.trim().length > 0) {
        cats = cats
          .where("summary")
          .equals({ $regex: query.summary.trim(), $options: "i" });
      }
      if (query.description && query.description.trim().length > 0) {
        cats = cats
          .where("description")
          .equals({ $regex: query.description.trim(), $options: "i" });
      }
      if (query.serieId && query.serieId.trim().length > 0) {
        cats = cats
          .where("serieId")
          .equals({ $regex: query.serieId.trim(), $options: "i" });
      }

      // انتخاب فیلدهای مورد نیاز
      const q = cats.select([
        "seasonId",
        "seasonPersianTitle",
        "seasonLatinTitle",
        "description",
        "summary",
        "serieId",
      ]);

      // دریافت تعداد کل مستندات مطابق با فیلترها
      const count = await seasons.countDocuments(cats.getQuery());

      // دریافت نتایج صفحه‌بندی شده
      const results = await q
        .sort([["seasonPersianTitle", "desc"]])
        .skip((page - 1) * limit) // اصلاح صفحه‌بندی
        .limit(limit);

      // ساخت لیست داده‌ها
      const catsList = results.map((item) => ({
        seasonId: item.seasonId,
        seasonPersianTitle: item.seasonPersianTitle,
        seasonLatinTitle: item.seasonLatinTitle,
        description: item.description,
        summary: item.summary,
        serieId: item.serieId,
      }));
      // محاسبه تعداد کل صفحات
      const totalPages = Math.ceil(count / limit);

      return r.succeeded(
        "Seasons fetched successfully",
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
      return r.failed("Failed to fetch seasons", undefined, 500);
    }
  };
}

export default SeasonRepository;
