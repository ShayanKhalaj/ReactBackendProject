import Result from "../base/result.js";
import { actors } from "../schema/actor.js";

class ActorRepository {
  async create(model) {
    const result = new Result("create actor");
    try {
      const createResult = await actors.create(model);
      return result.succeeded(
        "Actor created successfully",
        createResult.actorId,
        201
      );
    } catch (error) {
      console.error("Error in create:", error);
      return result.failed("Failed to create actor", undefined, 500);
    }
  }

  async delete(actorId) {
    const result = new Result("delete actor");
    try {
      const deleteResult = await actors.deleteOne({ actorId });
      if (deleteResult.deletedCount === 0) {
        return result.failed("Actor not found", actorId, 404);
      }
      return result.succeeded("Actor deleted successfully", actorId, 200);
    } catch (error) {
      console.error("Error in delete:", error);
      return result.failed("Failed to delete actor", undefined, 500);
    }
  }

  async update(model) {
    const result = new Result("update actor");
    try {
      const updateResult = await actors.updateOne(
        { actorId: model.actorId },
        { $set: model }
      );
      if (updateResult.matchedCount === 0) {
        return result.failed("Actor not found", model.actorId, 404);
      }
      return result.succeeded(
        "Actor updated successfully",
        model.actorId,
        200
      );
    } catch (error) {
      console.error("Error in update:", error);
      return result.failed("Failed to update actor", undefined, 500);
    }
  }

  async get(actorId) {
    try {
      return await actors.findOne({ actorId });
    } catch (error) {
      console.error("Error in get:", error);
      return null;
    }
  }

  async getAll() {
    try {
      return await actors.find({});
    } catch (error) {
      console.error("Error in getAll:", error);
      return [];
    }
  }



  search = async (query = {}, page = 1, limit = 20) => {
    const r = new Result('search actors');
    try {
        let actorsQuery = actors.find({});
        
        // فیلترهای جستجو
        if (query.actorId) actorsQuery = actorsQuery.where("_id").equals(query.actorId);
        if (query.firstname) actorsQuery = actorsQuery.where("firstname").regex(new RegExp(query.firstname, 'i'));
        if (query.lastname) actorsQuery = actorsQuery.where("lastname").regex(new RegExp(query.lastname, 'i'));
        if (query.nation) actorsQuery = actorsQuery.where("nation").regex(new RegExp(query.nation, 'i'));
        if (query.gender !== undefined) actorsQuery = actorsQuery.where("gender").equals(query.gender);

        const count = await actors.countDocuments(actorsQuery.getQuery());

        // گرفتن نتایج صفحه‌بندی شده
        const results = await actorsQuery
            .select("_id firstname lastname gender nation actorImageUrl")
            .skip((page - 1) * limit)
            .limit(limit)
            .sort([["lastname", "asc"]]);

        const actorsList = results.map((item) => ({
            actorId: item.actorId,
            firstname: item.firstname,
            lastname: item.lastname,
            gender: item.gender,
            nation: item.nation,
            actorImageUrl: item.actorImageUrl,
        }));

        const totalPages = Math.ceil(count / limit);

        return r.succeeded('Categories fetched successfully', {
          data: actorsList,
          pagination: {
              total: count,
              totalPages: totalPages,
              currentPage: page,
              pageSize: limit,
          },
      }, 200);
    } catch (error) {
        console.error("Error in search:", error);
        return { error: "Failed to fetch actors" };
    }
};

  
}

export default ActorRepository;
