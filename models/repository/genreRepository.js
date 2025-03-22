import Result from "../base/result.js";
import { genres } from "../schema/genre.js"; // Import your Genre model

class GenreRepository {
  async create(model) {
    const result = new Result("create genre");
    try {
      const createResult = await genres.create(model);
      return result.succeeded(
        "Genre created successfully",
        createResult.genreId,
        201
      );
    } catch (error) {
      console.error("Error in create:", error);
      return result.failed("Failed to create genre", undefined, 500);
    }
  }

  async delete(genreId) {
    const result = new Result("delete genre");
    try {
      const deleteResult = await genres.deleteOne({ genreId });
      if (deleteResult.deletedCount === 0) {
        return result.failed("Genre not found", genreId, 404);
      }
      return result.succeeded("Genre deleted successfully", genreId, 200);
    } catch (error) {
      console.error("Error in delete:", error);
      return result.failed("Failed to delete genre", undefined, 500);
    }
  }

  async update(model) {
    const result = new Result("update genre");
    try {
      const updateResult = await genres.updateOne(
        { genreId: model.genreId },
        { $set: model }
      );
      if (updateResult.matchedCount === 0) {
        return result.failed("Genre not found", model.genreId, 404);
      }
      return result.succeeded("Genre updated successfully", model.genreId, 200);
    } catch (error) {
      console.error("Error in update:", error);
      return result.failed("Failed to update genre", undefined, 500);
    }
  }

  async isGenreExistedByThisId(genreId) {
    try {
      const genre = await genres.findOne({ genreId });
      return !!genre;
    } catch (error) {
      console.error("Error in checking genre existence:", error);
      return false;
    }
  }

  async get(genreId) {
    try {
      return await genres.findOne({ genreId });
    } catch (error) {
      console.error("Error in get:", error);
      return null;
    }
  }

  async getAll() {
    try {
      return await genres.find({});
    } catch (error) {
      console.error("Error in getAll:", error);
      return [];
    }
  }

  search = async (query = {}, page = 1, limit = 20) => {
    const r = new Result("search genres");
    try {
      let cats = genres.find({});
      // اضافه کردن فیلترها به کوئری
      if (query.genreId && query.genreId.trim().length > 0) {
        cats = cats.where("genreId").equals(query.genreId.trim());
      }
      if (query.genrePersianName && query.genrePersianName.trim().length > 0) {
        cats = cats
          .where("genrePersianName")
          .equals({ $regex: query.genrePersianName.trim(), $options: "i" });
      }
      if (query.genreLatinName && query.genreLatinName.trim().length > 0) {
        cats = cats
          .where("genreLatinName")
          .equals({ $regex: query.genreLatinName.trim(), $options: "i" });
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

      // انتخاب فیلدهای مورد نیاز
      const q = cats.select([
        "genreId",
        "genrePersianName",
        "genreLatinName",
        "description",
        "summary",
        "genreCoverImageUrl",
      ]);

      // دریافت تعداد کل مستندات مطابق با فیلترها
      const count = await genres.countDocuments(cats.getQuery());

      // دریافت نتایج صفحه‌بندی شده
      const results = await q
        .sort([["genrePersianTitle", "desc"]])
        .skip((page - 1) * limit) // اصلاح صفحه‌بندی
        .limit(limit);

      // ساخت لیست داده‌ها
      const catsList = results.map((item) => ({
        genreId: item.genreId,
        genrePersianName: item.genrePersianName,
        genreLatinName: item.genreLatinName,
        description: item.description,
        summary: item.summary,
        genreCoverImageUrl: item.genreCoverImageUrl,
      }));
      // محاسبه تعداد کل صفحات
      const totalPages = Math.ceil(count / limit);

      return r.succeeded(
        "Genres fetched successfully",
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
      return r.failed("Failed to fetch genres", undefined, 500);
    }
  };
}

export default GenreRepository;
