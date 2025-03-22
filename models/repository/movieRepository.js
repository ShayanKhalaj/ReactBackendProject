import Result from "../base/result.js";
import { movies } from "../schema/movie.js";

class MovieRepository {
  async create(model) {
    const result = new Result("create movie");
    try {
      const createResult = await movies.create(model);
      return result.succeeded(
        "Movie created successfully",
        createResult.movieId,
        201
      );
    } catch (error) {
      console.error("Error in create:", error);
      return result.failed("Failed to create movie", undefined, 500);
    }
  }

  async hasMovieDuplicatedByThisTitle(moviePersianTitle, movieLatinTitle) {
    try {
      const duplicate = await movies.find({
        moviePersianTitle,
        movieLatinTitle,
      });
      return duplicate.length > 0;
    } catch (error) {
      console.error("Error in checking duplicate movie:", error);
      return false;
    }
  }

  async delete(movieId) {
    const result = new Result("delete movie");
    try {
      const deleteResult = await movies.deleteOne({ movieId });
      if (deleteResult.deletedCount === 0) {
        return result.failed("Movie not found", movieId, 404);
      }
      return result.succeeded("Movie deleted successfully", movieId, 200);
    } catch (error) {
      console.error("Error in delete:", error);
      return result.failed("Failed to delete movie", undefined, 500);
    }
  }

  async update(model) {
    const result = new Result("update movie");
    try {
      const updateResult = await movies.updateOne(
        { movieId: model.movieId },
        { $set: model }
      );
      if (updateResult.matchedCount === 0) {
        return result.failed("Movie not found", model.movieId, 404);
      }
      return result.succeeded("Movie updated successfully", model.movieId, 200);
    } catch (error) {
      console.error("Error in update:", error);
      return result.failed("Failed to update movie", undefined, 500);
    }
  }

  async isMovieExistedByThisId(movieId) {
    try {
      const movie = await movies.findOne({ movieId });
      return !!movie;
    } catch (error) {
      console.error("Error in checking movie existence:", error);
      return false;
    }
  }

  async get(movieId) {
    try {
      return await movies.findOne({ movieId });
    } catch (error) {
      console.error("Error in get:", error);
      return null;
    }
  }

  async getAll() {
    try {
      return await movies.find({});
    } catch (error) {
      console.error("Error in getAll:", error);
      return [];
    }
  }

  search = async (query = {}, page = 1, limit = 20) => {
    const r = new Result("search movies");
    try {
      let cats = movies.find({});
      // اضافه کردن فیلترها به کوئری
      if (query.genreId && query.genreId.trim().length > 0) {
        cats = cats.where("genreId").equals(query.genreId.trim());
      }
      if (query.categoryId && query.categoryId.trim().length > 0) {
        cats = cats.where("categoryId").equals(query.categoryId.trim());
      }
      if (query.isFree) {
        cats = cats.where("isFree").equals(query.isFree);
      }
      if (query.minAge && query.minAge.trim().length > 0) {
        cats = cats.where("minAge").equals(query.minAge.trim());
      }
      if (query.movieId && query.movieId.trim().length > 0) {
        cats = cats.where("movieId").equals(query.movieId.trim());
      }
      if (
        query.moviePersianTitle &&
        query.moviePersianTitle.trim().length > 0
      ) {
        cats = cats
          .where("moviePersianTitle")
          .equals({ $regex: query.moviePersianTitle.trim(), $options: "i" });
      }
      if (query.movieLatinTitle && query.movieLatinTitle.trim().length > 0) {
        cats = cats
          .where("movieLatinTitle")
          .equals({ $regex: query.movieLatinTitle.trim(), $options: "i" });
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
        "movieId",
        "moviePersianTitle",
        "movieLatinTitle",
        "description",
        "summary",
        "movieCoverImageUrl",
        "duratoin",
        "country",
        "minAge",
        "movieTrailerVideoUrl",
        "movieVideoUrl",
        "isFree",
        "categoryId",
        "genreId",
        "directorId",
        "actors",
      ]);

      // دریافت تعداد کل مستندات مطابق با فیلترها
      const count = await movies.countDocuments(cats.getQuery());

      // دریافت نتایج صفحه‌بندی شده
      const results = await q
        .sort([["moviePersianTitle", "desc"]])
        .skip((page - 1) * limit) // اصلاح صفحه‌بندی
        .limit(limit);

      // ساخت لیست داده‌ها
      const catsList = results.map((item) => ({
        movieId: item.movieId,
        moviePersianTitle: item.moviePersianTitle,
        movieLatinTitle: item.movieLatinTitle,
        description: item.description,
        summary: item.summary,
        movieCoverImageUrl: item.movieCoverImageUrl,
        duratoin: item.duratoin,
        country: item.country,
        minAge: item.minAge,
        movieTrailerVideoUrl: item.movieTrailerVideoUrl,
        movieVideoUrl: item.movieVideoUrl,
        isFree: item.isFree,
        categoryId: item.categoryId,
        genreId: item.genreId,
        directorId: item.directorId,
        actors:item.actors
      }));
      // محاسبه تعداد کل صفحات
      const totalPages = Math.ceil(count / limit);

      return r.succeeded(
        "Movies fetched successfully",
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
      return r.failed("Failed to fetch movies", undefined, 500);
    }
  };
}

export default MovieRepository;
