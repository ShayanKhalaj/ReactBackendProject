import Result from "../base/result.js";
import { series } from "../schema/serie.js";
import { categories } from "../schema/category.js";
import { genres } from "../schema/genre.js";
import { people } from "../schema/people.js";

class SerieRepository {
  async create(model) {
    const result = new Result("create serie");
    try {
      const createResult = await series.create(model);
      return result.succeeded(
        "Serie created successfully",
        createResult.serieId,
        201
      );
    } catch (error) {
      console.error("Error in create:", error);
      return result.failed("Failed to create serie", undefined, 500);
    }
  }

  async delete(serieId) {
    const result = new Result("delete serie");
    try {
      const deleteResult = await series.deleteOne({ serieId });
      if (deleteResult.deletedCount === 0) {
        return result.failed("Serie not found", serieId, 404);
      }
      return result.succeeded("Serie deleted successfully", serieId, 200);
    } catch (error) {
      console.error("Error in delete:", error);
      return result.failed("Failed to delete serie", undefined, 500);
    }
  }

  async update(model) {
    const result = new Result("update serie");
    try {
      const updateResult = await series.updateOne(
        { serieId: model.serieId },
        { $set: model }
      );
      if (updateResult.matchedCount === 0) {
        return result.failed("Serie not found", model.serieId, 404);
      }
      return result.succeeded("Serie updated successfully", model.serieId, 200);
    } catch (error) {
      console.error("Error in update:", error);
      return result.failed("Failed to update serie", undefined, 500);
    }
  }

  async isSerieExistedByThisId(serieId) {
    try {
      const serie = await series.findOne({ serieId });
      return !!serie;
    } catch (error) {
      console.error("Error in checking serie existence:", error);
      return false;
    }
  }

  async get(serieId) {
    try {
      return await series
        .findOne({ serieId })
        .populate("categoryId genreId people.personId people.jobId");
    } catch (error) {
      console.error("Error in get:", error);
      return null;
    }
  }

  async getAll() {
    try {
      return await series
        .find({})
        .populate("categoryId genreId people.personId people.jobId");
    } catch (error) {
      console.error("Error in getAll:", error);
      return [];
    }
  }

  search = async (query = {}, page = 1, limit = 20) => {
    const r = new Result("search series");
    try {
      let cats = series.find({});

      // اضافه کردن فیلترها به کوئری
      if (query.genreId && query.genreId.trim().length > 0) {
        cats = cats.where("genreId").equals(query.genreId.trim());
      }
      if (query.categoryId && query.categoryId.trim().length > 0) {
        cats = cats.where("categoryId").equals(query.categoryId.trim());
      }
      if (query.minAge && query.minAge.trim().length > 0) {
        cats = cats.where("minAge").equals(query.minAge.trim());
      }
      if (query.serieId && query.serieId.trim().length > 0) {
        cats = cats.where("serieId").equals(query.serieId.trim());
      }
      if (
        query.seriePersianTitle &&
        query.seriePersianTitle.trim().length > 0
      ) {
        cats = cats
          .where("seriePersianTitle")
          .equals({ $regex: query.seriePersianTitle.trim(), $options: "i" });
      }
      if (query.serieLatinTitle && query.serieLatinTitle.trim().length > 0) {
        cats = cats
          .where("serieLatinTitle")
          .equals({ $regex: query.serieLatinTitle.trim(), $options: "i" });
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
      if (query.country && query.country.trim().length > 0) {
        cats = cats
          .where("country")
          .equals({ $regex: query.country.trim(), $options: "i" });
      }

      // انتخاب فیلدهای مورد نیاز
      const q = cats.select([
        "serieId",
        "seriePersianTitle",
        "serieLatinTitle",
        "description",
        "summary",
        "country",
        "minAge",
        "serieCoverImageUrl",
        "serieTrailerVideoUrl",
        "categoryId",
        "genreId",
        "people",
      ]);

      // دریافت تعداد کل مستندات مطابق با فیلترها
      const count = await categories.countDocuments(cats.getQuery());

      // دریافت نتایج صفحه‌بندی شده
      const results = await q
        .sort([["seriePersianTitle", "desc"]])
        .skip((page - 1) * limit) // اصلاح صفحه‌بندی
        .limit(limit);

      // ساخت لیست داده‌ها
      const catsList = results.map((item) => ({
        serieId: item.serieId,
        seriePersianTitle: item.seriePersianTitle,
        serieLatinTitle: item.serieLatinTitle,
        description: item.description,
        summary: item.summary,
        country: item.country,
        minAge: item.minAge,
        serieCoverImageUrl: item.serieCoverImageUrl,
        serieTrailerVideoUrl: item.serieTrailerVideoUrl,
        categoryId: item.categoryId,
        genreId: item.genreId,
        people: item.people,
      }));
      // محاسبه تعداد کل صفحات
      const totalPages = Math.ceil(count / limit);

      return r.succeeded(
        "Series fetched successfully",
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
      return r.failed("Failed to fetch series", undefined, 500);
    }
  };
}

export default SerieRepository;
