import Result from "../base/result.js";
import { people } from "../schema/people.js";
import { movies } from "../schema/movie.js";
import { series } from "../schema/serie.js";

class PeopleRepository {
  async create(model) {
    const result = new Result("create person");
    try {
      const createResult = await people.create(model);
      return result.succeeded(
        "Person created successfully",
        createResult.directorId,
        201
      );
    } catch (error) {
      console.error("Error in create:", error);
      return result.failed("Failed to create person", undefined, 500);
    }
  }

  async delete(directorId) {
    const result = new Result("delete person");
    try {
      const deleteResult = await people.deleteOne({ directorId });
      if (deleteResult.deletedCount === 0) {
        return result.failed("Person not found", directorId, 404);
      }
      return result.succeeded("Person deleted successfully", directorId, 200);
    } catch (error) {
      console.error("Error in delete:", error);
      return result.failed("Failed to delete person", undefined, 500);
    }
  }

  async update(model) {
    const result = new Result("update person");
    try {
      const updateResult = await people.updateOne(
        { directorId: model.directorId },
        { $set: model }
      );
      if (updateResult.matchedCount === 0) {
        return result.failed("Person not found", model.directorId, 404);
      }
      return result.succeeded(
        "Person updated successfully",
        model.directorId,
        200
      );
    } catch (error) {
      console.error("Error in update:", error);
      return result.failed("Failed to update person", undefined, 500);
    }
  }

  async get(directorId) {
    try {
      return await people.findOne({ directorId });
    } catch (error) {
      console.error("Error in get:", error);
      return null;
    }
  }

  async getAll() {
    try {
      return await people.find({});
    } catch (error) {
      console.error("Error in getAll:", error);
      return [];
    }
  }

  search = async (query = {}, page = 1, limit = 20) => {
    const r = new Result("search people");
    try {
      let cats = people.find({});
      // اضافه کردن فیلترها به کوئری
      if (query.jobs && query.jobs.trim().length > 0) {
        cats = cats.where("jobs").equals(query.jobs.trim());
      }
      if (query.personId && query.personId.trim().length > 0) {
        cats = cats.where("personId").equals(query.personId.trim());
      }
      if (query.firstname && query.firstname.trim().length > 0) {
        cats = cats
          .where("firstname")
          .equals({ $regex: query.firstname.trim(), $options: "i" });
      }
      if (query.lastname && query.lastname.trim().length > 0) {
        cats = cats
          .where("lastname")
          .equals({ $regex: query.lastname.trim(), $options: "i" });
      }
      if (query.movies && query.movies.trim().length > 0) {
        cats = cats
          .where("movies")
          .equals({ $regex: query.movies.trim(), $options: "i" });
      }
      if (query.series && query.series.trim().length > 0) {
        cats = cats
          .where("series")
          .equals({ $regex: query.series.trim(), $options: "i" });
      }
      if (query.awards && query.awards.trim().length > 0) {
        cats = cats
          .where("categoryImageUrl")
          .equals({ $regex: query.awards.trim(), $options: "i" });
      }

      // انتخاب فیلدهای مورد نیاز
      const q = cats.select([
        "personId",
        "firstname",
        "lastname",
        "profileImageUrl",
        "bio",
        "movies",
        "series",
        "spouse",
        "awards",
        "jobs",
      ]);

      // دریافت تعداد کل مستندات مطابق با فیلترها
      const count = await categories.countDocuments(cats.getQuery());

      // دریافت نتایج صفحه‌بندی شده
      const results = await q
        .sort([["lastname", "desc"]])
        .skip((page - 1) * limit) // اصلاح صفحه‌بندی
        .limit(limit);

      // ساخت لیست داده‌ها
      const catsList = results.map((item) => ({
        personId: item.personId,
        firstname: item.firstname,
        lastname: item.lastname,
        profileImageUrl: item.profileImageUrl,
        bio: item.bio,
        movies: item.movies,
        series: item.series,
        spouse: item.spouse,
        awards: item.awards,
        jobs: item.jobs,
      }));
      // محاسبه تعداد کل صفحات
      const totalPages = Math.ceil(count / limit);

      return r.succeeded(
        "People fetched successfully",
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
      return r.failed("Failed to fetch people", undefined, 500);
    }
  };

  async hasRelatedMoviesOrSeriesByThisId(directorId) {
    try {
      const [relatedMovies, relatedSeries] = await Promise.all([
        movies.find({ "movies.directorId": directorId }),
        series.find({ "series.directorId": directorId }),
      ]);
      return relatedMovies.length > 0 || relatedSeries.length > 0;
    } catch (error) {
      console.error("Error in checking related movies or series:", error);
      return false;
    }
  }
}

export default PeopleRepository;
