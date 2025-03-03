import Result from "../base/result.js";
import { directors } from "../schema/director.js";

class DirectorRepository {
  async create(model) {
    const result = new Result("create director");
    try {
      const createResult = await directors.create(model);
      return result.succeeded(
        "Director created successfully",
        createResult.directorId,
        201
      );
    } catch (error) {
      console.error("Error in create:", error);
      return result.failed("Failed to create director", undefined, 500);
    }
  }

  async delete(directorId) {
    const result = new Result("delete director");
    try {
      const deleteResult = await directors.deleteOne({ directorId });
      if (deleteResult.deletedCount === 0) {
        return result.failed("Director not found", directorId, 404);
      }
      return result.succeeded("Director deleted successfully", directorId, 200);
    } catch (error) {
      console.error("Error in delete:", error);
      return result.failed("Failed to delete director", undefined, 500);
    }
  }

  async update(model) {
    const result = new Result("update director");
    try {
      const updateResult = await directors.updateOne(
        { directorId: model.directorId },
        { $set: model }
      );
      if (updateResult.matchedCount === 0) {
        return result.failed("Director not found", model.directorId, 404);
      }
      return result.succeeded(
        "Director updated successfully",
        model.directorId,
        200
      );
    } catch (error) {
      console.error("Error in update:", error);
      return result.failed("Failed to update director", undefined, 500);
    }
  }

  async get(directorId) {
    try {
      return await directors.findOne({ directorId });
    } catch (error) {
      console.error("Error in get:", error);
      return null;
    }
  }

  async getAll() {
    try {
      return await directors.find({});
    } catch (error) {
      console.error("Error in getAll:", error);
      return [];
    }
  }

  search = async (query = {}, page = 1, limit = 20) => {
    const r = new Result("search directors");
    try {
      let dirs = directors.find({});
      // Add filters to the query
      if (query.directorId && query.directorId.trim().length > 0) {
        dirs = dirs.where("directorId").equals(query.directorId.trim());
      }
      if (query.firstname && query.firstname.trim().length > 0) {
        dirs = dirs
          .where("firstname")
          .equals({ $regex: query.firstname.trim(), $options: "i" });
      }
      if (query.lastname && query.lastname.trim().length > 0) {
        dirs = dirs
          .where("lastname")
          .equals({ $regex: query.lastname.trim(), $options: "i" });
      }
      if (query.gender !== undefined) {
        dirs = dirs.where("gender").equals(query.gender);
      }
      if (query.nation && query.nation.trim().length > 0) {
        dirs = dirs
          .where("nation")
          .equals({ $regex: query.nation.trim(), $options: "i" });
      }

      // Select needed fields
      const q = dirs.select([
        "directorId",
        "firstname",
        "lastname",
        "gender",
        "nation",
      ]);

      // Get total number of documents matching the filters
      const count = await directors.countDocuments(dirs.getQuery());

      // Get paginated results
      const results = await q
        .sort([["firstname", "asc"]])
        .skip((page - 1) * limit) // Correct pagination
        .limit(limit);

      // Build list of data
      const dirsList = results.map((item) => ({
        directorId: item.directorId,
        firstname: item.firstname,
        lastname: item.lastname,
        gender: item.gender,
        nation: item.nation,
      }));

      // Calculate total number of pages
      const totalPages = Math.ceil(count / limit);

      return r.succeeded(
        "Directors fetched successfully",
        {
          data: dirsList,
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
      return r.failed("Failed to fetch directors", undefined, 500);
    }
  };
}

export default DirectorRepository;
