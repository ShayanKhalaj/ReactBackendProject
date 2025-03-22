import Result from "../base/result.js";
import { sliderMovies } from "../schema/SliderMovie.js";

class SliderMovieRepository {
  async create(model) {
    const result = new Result("create slider-movie relation");
    try {
      const createResult = await sliderMovies.create(model);
      return result.succeeded(
        "Slider-Movie relation created successfully",
        createResult._id,
        201
      );
    } catch (error) {
      console.error("Error in create:", error);
      return result.failed("Failed to create slider-movie relation", undefined, 500);
    }
  }

  async delete(sliderId, movieId) {
    const result = new Result("delete slider-movie relation");
    try {
      const deleteResult = await sliderMovies.deleteOne({ sliderId, movieId });
      if (deleteResult.deletedCount === 0) {
        return result.failed("Relation not found", { sliderId, movieId }, 404);
      }
      return result.succeeded("Relation deleted successfully", { sliderId, movieId }, 200);
    } catch (error) {
      console.error("Error in delete:", error);
      return result.failed("Failed to delete relation", undefined, 500);
    }
  }

  async update(model) {
    const result = new Result("update slider-movie relation");
    try {
      const updateResult = await sliderMovies.updateOne(
        { sliderId: model.sliderId, movieId: model.movieId },
        { $set: model }
      );
      if (updateResult.matchedCount === 0) {
        return result.failed("Relation not found", { sliderId: model.sliderId, movieId: model.movieId }, 404);
      }
      return result.succeeded("Relation updated successfully", { sliderId: model.sliderId, movieId: model.movieId }, 200);
    } catch (error) {
      console.error("Error in update:", error);
      return result.failed("Failed to update relation", undefined, 500);
    }
  }

  async get(sliderId, movieId) {
    try {
      return await sliderMovies.findOne({ sliderId, movieId });
    } catch (error) {
      console.error("Error in get:", error);
      return null;
    }
  }

  async getAll() {
    try {
      return await sliderMovies.find({});
    } catch (error) {
      console.error("Error in getAll:", error);
      return [];
    }
  }

  async search(query = {}, page = 1, limit = 20) {
    const r = new Result("search slider-movie relations");
    try {
      let queryBuilder = sliderMovies.find({});

      if (query.sliderId) queryBuilder = queryBuilder.where("sliderId").equals(query.sliderId);
      if (query.movieId) queryBuilder = queryBuilder.where("movieId").equals(query.movieId);

      const count = await sliderMovies.countDocuments(queryBuilder.getQuery());
      const results = await queryBuilder
        .skip((page - 1) * limit)
        .limit(limit)
        .populate("sliderId", "title description") // نمایش اطلاعات اسلایدر
        .populate("movieId", "title releaseYear") // نمایش اطلاعات فیلم
        .sort([["sliderId", "asc"]]);

      const totalPages = Math.ceil(count / limit);

      return r.succeeded("Relations fetched successfully", {
        data: results,
        pagination: {
          total: count,
          totalPages,
          currentPage: page,
          pageSize: limit,
        },
      }, 200);
    } catch (error) {
      console.error("Error in search:", error);
      return r.failed("Failed to fetch slider-movie relations", undefined, 500);
    }
  }
}

export default SliderMovieRepository;
