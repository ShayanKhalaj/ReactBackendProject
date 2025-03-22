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
        let dirs = directors.find({});  // شروع با جستجوی تمام مستندات

        // اضافه کردن فیلترها به کوئری
        if (query.directorId && query.directorId.trim().length > 0) {
            dirs = dirs.where("directorId").equals(query.directorId.trim());
        }

        if (query.firstname && query.firstname.trim().length > 0) {
            dirs = dirs.where("firstname").equals({ $regex: query.firstname.trim(), $options: "i" });
        }

        if (query.lastname && query.lastname.trim().length > 0) {
            dirs = dirs.where("lastname").equals({ $regex: query.lastname.trim(), $options: "i" });
        }

        if(typeof query.gender === typeof true){
          dirs = dirs.where("gender").equals(query.gender);

        }

        if (query.nation && query.nation.trim().length > 0) {
            dirs = dirs.where("nation").equals({ $regex: query.nation.trim(), $options: "i" });
        }


        // انتخاب فیلدهای مورد نیاز
        const q = dirs.select([
            "directorId", 
            "firstname", 
            "lastname", 
            "nation", 
            "directorImageUrl"
        ]);

        // دریافت تعداد کل مستندات مطابق با فیلترها
        const count = await directors.countDocuments(dirs.getQuery());  // استفاده از getQuery برای دریافت فیلترهای اعمال شده

        // دریافت نتایج صفحه‌بندی شده
        const results = await q
            .sort([["lastname", "desc"]])  // مرتب‌سازی نتایج
            .skip((page - 1) * limit)  // اصلاح صفحه‌بندی
            .limit(limit);  // محدود کردن تعداد نتایج به حد تعیین شده

        // ساخت لیست داده‌ها
        const directorsList = results.map(item => ({
            directorId: item.directorId,
            firstname: item.firstname,
            lastname: item.lastname,
            nation: item.nation,
            directorImageUrl: item.directorImageUrl,
        }));

        // محاسبه تعداد کل صفحات
        const totalPages = Math.ceil(count / limit);

        return r.succeeded("Directors fetched successfully", {
            data: directorsList,
            pagination: {
                total: count,
                totalPages: totalPages,
                currentPage: page,
                pageSize: limit,
            },
        }, 200);
    } catch (error) {
        console.error("Error in search:", error);
        return r.failed("Failed to fetch directors", undefined, 500);
    }
};


  
}

export default DirectorRepository;
