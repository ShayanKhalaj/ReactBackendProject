import mongoose from "mongoose";
import Result from "../base/result.js";
import { actorMovies } from "../schema/actorMovie.js";

class ActorMovieRepository {
  async create(model) {
    const result = new Result("create actor-movie relation");
    try {
      const createResult = await actorMovies.create(model);
      return result.succeeded(
        "Actor-Movie relation created successfully",
        createResult._id,
        201
      );
    } catch (error) {
      console.error("Error in create:", error);
      return result.failed("Failed to create actor-movie relation", undefined, 500);
    }
  }

  async delete(actorId, movieId) {
    const result = new Result("delete actor-movie relation");
    try {
      const deleteResult = await actorMovies.deleteOne({ actorId, movieId });
      if (deleteResult.deletedCount === 0) {
        return result.failed("Relation not found", { actorId, movieId }, 404);
      }
      return result.succeeded("Relation deleted successfully", { actorId, movieId }, 200);
    } catch (error) {
      console.error("Error in delete:", error);
      return result.failed("Failed to delete relation", undefined, 500);
    }
  }

  async update(model) {
    const result = new Result("update actor-movie relation");
    try {
      const updateResult = await actorMovies.updateOne(
        { actorId: model.actorId, movieId: model.movieId },
        { $set: model }
      );
      if (updateResult.matchedCount === 0) {
        return result.failed("Relation not found", { actorId: model.actorId, movieId: model.movieId }, 404);
      }
      return result.succeeded("Relation updated successfully", { actorId: model.actorId, movieId: model.movieId }, 200);
    } catch (error) {
      console.error("Error in update:", error);
      return result.failed("Failed to update relation", undefined, 500);
    }
  }

  async get(actorId, movieId) {
    try {
      return await actorMovies.findOne({ actorId, movieId });
    } catch (error) {
      console.error("Error in get:", error);
      return null;
    }
  }

  async getAll() {
    try {
      return await actorMovies.find({});
    } catch (error) {
      console.error("Error in getAll:", error);
      return [];
    }
  }

  async search(query = {}, page = 1, limit = 20) {
    const r = new Result("search actor-movie relations");
    try {
      let queryBuilder = actorMovies.find({});

      if (query.actorId) queryBuilder = queryBuilder.where("actorId").equals(query.actorId);
      if (query.movieId) queryBuilder = queryBuilder.where("movieId").equals(query.movieId);

      const count = await actorMovies.countDocuments(queryBuilder.getQuery());
      const results = await queryBuilder
        .skip((page - 1) * limit)
        .limit(limit)
        .populate("actorId", "firstname lastname") // نمایش اطلاعات بازیگر
        .populate("movieId", "title releaseYear") // نمایش اطلاعات فیلم
        .sort([["actorId", "asc"]]);

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
      return r.failed("Failed to fetch actor-movie relations", undefined, 500);
    }
  }
}

export default ActorMovieRepository;
