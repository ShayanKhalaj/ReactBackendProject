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
    const r = new Result("search actors");
    try {
      let act = actors.find({});
      // اضافه کردن فیلترها به کوئری
      if (query.actorId && query.actorId.trim().length > 0) {
        act = act.where("actorId").equals(query.actorId.trim());
      }
      if (query.firstname && query.firstname.trim().length > 0) {
        act = act
          .where("firstname")
          .equals({ $regex: query.firstname.trim(), $options: "i" });
      }
      if (query.lastname && query.lastname.trim().length > 0) {
        act = act
          .where("lastname")
          .equals({ $regex: query.lastname.trim(), $options: "i" });
      }
      if (query.gender !== undefined) {
        act = act.where("gender").equals(query.gender);
      }
      if (query.nation && query.nation.trim().length > 0) {
        act = act
          .where("nation")
          .equals({ $regex: query.nation.trim(), $options: "i" });
      }

      // انتخاب فیلدهای مورد نیاز
      const q = act.select([
        "actorId",
        "firstname",
        "lastname",
        "gender",
        "nation",
      ]);

      // دریافت تعداد کل مستندات مطابق با فیلترها
      const count = await actors.countDocuments(act.getQuery());

      // دریافت نتایج صفحه‌بندی شده
      const results = await q
        .sort([["lastname", "asc"]])
        .skip((page - 1) * limit) // اصلاح صفحه‌بندی
        .limit(limit);

      // ساخت لیست داده‌ها
      const actList = results.map((item) => ({
        actorId: item.actorId,
        firstname: item.firstname,
        lastname: item.lastname,
        gender: item.gender,
        nation: item.nation,
      }));
      // محاسبه تعداد کل صفحات
      const totalPages = Math.ceil(count / limit);

      return r.succeeded(
        "Actors fetched successfully",
        {
          data: actList,
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
      return r.failed("Failed to fetch actors", undefined, 500);
    }
  };
}

export default ActorRepository;
