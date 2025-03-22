import mongoose from "mongoose";
import Result from "../base/result.js";
import { boxMovies } from "../schema/boxMovie.js";

class BoxMovieRepository {
  async create(model) {
    const result = new Result("create box-movie relation");
    try {
      const createResult = await boxMovies.create(model);
      return result.succeeded(
        "Box-Movie relation created successfully",
        createResult._id,
        201
      );
    } catch (error) {
      console.error("Error in create:", error);
      return result.failed("Failed to create box-movie relation", undefined, 500);
    }
  }

  async delete(boxId, movieId) {
    const result = new Result("delete box-movie relation");
    try {
      const deleteResult = await boxMovies.deleteOne({ boxId, movieId });
      if (deleteResult.deletedCount === 0) {
        return result.failed("Relation not found", { boxId, movieId }, 404);
      }
      return result.succeeded("Relation deleted successfully", { boxId, movieId }, 200);
    } catch (error) {
      console.error("Error in delete:", error);
      return result.failed("Failed to delete relation", undefined, 500);
    }
  }

  async update(model) {
    const result = new Result("update box-movie relation");
    try {
      const updateResult = await boxMovies.updateOne(
        { boxId: model.boxId, movieId: model.movieId },
        { $set: model }
      );
      if (updateResult.matchedCount === 0) {
        return result.failed("Relation not found", { boxId: model.boxId, movieId: model.movieId }, 404);
      }
      return result.succeeded("Relation updated successfully", { boxId: model.boxId, movieId: model.movieId }, 200);
    } catch (error) {
      console.error("Error in update:", error);
      return result.failed("Failed to update relation", undefined, 500);
    }
  }

  async get(boxId, movieId) {
    try {
      return await boxMovies.findOne({ boxId, movieId });
    } catch (error) {
      console.error("Error in get:", error);
      return null;
    }
  }

  async getAll() {
    try {
      return await boxMovies.find({});
    } catch (error) {
      console.error("Error in getAll:", error);
      return [];
    }
  }

  async search(query = {}, page = 1, limit = 20) {
    const r = new Result("search box-movie relations");
    try {
      let queryBuilder = boxMovies.find({});

      if (query.boxId) queryBuilder = queryBuilder.where("boxId").equals(query.boxId);
      if (query.movieId) queryBuilder = queryBuilder.where("movieId").equals(query.movieId);

      const count = await boxMovies.countDocuments(queryBuilder.getQuery());
      const results = await queryBuilder
        .skip((page - 1) * limit)
        .limit(limit)
        .populate("boxId", "name description") // نمایش اطلاعات جعبه
        .populate("movieId", "title releaseYear") // نمایش اطلاعات فیلم
        .sort([["boxId", "asc"]]);

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
      return r.failed("Failed to fetch box-movie relations", undefined, 500);
    }
  }
}

export default BoxMovieRepository;
