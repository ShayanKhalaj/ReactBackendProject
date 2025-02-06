import Result from "../base/result.js";
import { episodes } from "../schema/episode.js"; // Import your Episode model

class EpisodeRepository {
  async create(model) {
    const result = new Result("create episode");
    try {
      const createResult = await episodes.create(model);
      return result.succeeded(
        "Episode created successfully",
        createResult.episodeId,
        201
      );
    } catch (error) {
      console.error("Error in create:", error);
      return result.failed("Failed to create episode", undefined, 500);
    }
  }

  async delete(episodeId) {
    const result = new Result("delete episode");
    try {
      const deleteResult = await episodes.deleteOne({ episodeId });
      if (deleteResult.deletedCount === 0) {
        return result.failed("Episode not found", episodeId, 404);
      }
      return result.succeeded("Episode deleted successfully", episodeId, 200);
    } catch (error) {
      console.error("Error in delete:", error);
      return result.failed("Failed to delete episode", undefined, 500);
    }
  }

  async update(model) {
    const result = new Result("update episode");
    try {
      const updateResult = await episodes.updateOne(
        { episodeId: model.episodeId },
        { $set: model }
      );
      if (updateResult.matchedCount === 0) {
        return result.failed("Episode not found", model.episodeId, 404);
      }
      return result.succeeded(
        "Episode updated successfully",
        model.episodeId,
        200
      );
    } catch (error) {
      console.error("Error in update:", error);
      return result.failed("Failed to update episode", undefined, 500);
    }
  }

  async isEpisodeExistedByThisId(episodeId) {
    try {
      const episode = await episodes.findOne({ episodeId });
      return !!episode;
    } catch (error) {
      console.error("Error in checking episode existence:", error);
      return false;
    }
  }

  async get(episodeId) {
    try {
      return await episodes.findOne({ episodeId }).populate("seasonId");
    } catch (error) {
      console.error("Error in get:", error);
      return null;
    }
  }

  async getAll() {
    try {
      return await episodes.find({}).populate("seasonId");
    } catch (error) {
      console.error("Error in getAll:", error);
      return [];
    }
  }

  search = async (query = {}, page = 1, limit = 20) => {
    const r = new Result("search episodes");
    try {
      let cats = episodes.find({});

      // اضافه کردن فیلترها به کوئری
      if (query.isFree) {
        cats = cats.where("isFree").equals(query.isFree);
      }
      if (query.episodeId && query.episodeId.trim().length > 0) {
        cats = cats.where("episodeId").equals(query.episodeId.trim());
      }
      if (
        query.episodePersianTitle &&
        query.episodePersianTitle.trim().length > 0
      ) {
        cats = cats
          .where("episodePersianTitle")
          .equals({ $regex: query.episodePersianTitle.trim(), $options: "i" });
      }
      if (
        query.episodeLatinTitle &&
        query.episodeLatinTitle.trim().length > 0
      ) {
        cats = cats
          .where("episodeLatinTitle")
          .equals({ $regex: query.episodeLatinTitle.trim(), $options: "i" });
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
        "episodeId",
        "episodePersianTitle",
        "episodeLatinTitle",
        "description",
        "summary",
        "duratoin",
        "episodeCoverImageUrl",
        "episodeVideoUrl",
        "isFree",
        "seasonId",
      ]);

      // دریافت تعداد کل مستندات مطابق با فیلترها
      const count = await episodes.countDocuments(cats.getQuery());

      // دریافت نتایج صفحه‌بندی شده
      const results = await q
        .sort([["episodePersianTitle", "desc"]])
        .skip((page - 1) * limit) // اصلاح صفحه‌بندی
        .limit(limit);

      // ساخت لیست داده‌ها
      const catsList = results.map((item) => ({
        episodeId:item.episodeId,
        episodePersianTitle:item.episodePersianTitle,
        episodeLatinTitle:item.episodeLatinTitle,
        description:item.description,
        summary:item.summary,
        duratoin:item.duratoin,
        episodeCoverImageUrl:item.episodeCoverImageUrl,
        episodeVideoUrl:item.episodeVideoUrl,
        isFree:item.isFree,
        seasonId:item.seasonId,
      }));
      // محاسبه تعداد کل صفحات
      const totalPages = Math.ceil(count / limit);

      return r.succeeded(
        "Episode fetched successfully",
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
      return r.failed("Failed to fetch episodes", undefined, 500);
    }
  };
}

export default EpisodeRepository;
