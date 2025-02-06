import Result from "../base/result.js";
import { jobs } from "../schema/job.js"; // Import your Job model

class JobRepository {
  async create(model) {
    const result = new Result("create job");
    try {
      const createResult = await jobs.create(model);
      return result.succeeded(
        "Job created successfully",
        createResult.jobId,
        201
      );
    } catch (error) {
      console.error("Error in create:", error);
      return result.failed("Failed to create job", undefined, 500);
    }
  }

  async delete(jobId) {
    const result = new Result("delete job");
    try {
      const deleteResult = await jobs.deleteOne({ jobId });
      if (deleteResult.deletedCount === 0) {
        return result.failed("Job not found", jobId, 404);
      }
      return result.succeeded("Job deleted successfully", jobId, 200);
    } catch (error) {
      console.error("Error in delete:", error);
      return result.failed("Failed to delete job", undefined, 500);
    }
  }

  async update(model) {
    const result = new Result("update job");
    try {
      const updateResult = await jobs.updateOne(
        { jobId: model.jobId },
        { $set: model }
      );
      if (updateResult.matchedCount === 0) {
        return result.failed("Job not found", model.jobId, 404);
      }
      return result.succeeded("Job updated successfully", model.jobId, 200);
    } catch (error) {
      console.error("Error in update:", error);
      return result.failed("Failed to update job", undefined, 500);
    }
  }

  async isJobExistedByThisId(jobId) {
    try {
      const job = await jobs.findOne({ jobId });
      return !!job;
    } catch (error) {
      console.error("Error in checking job existence:", error);
      return false;
    }
  }

  async get(jobId) {
    try {
      return await jobs.findOne({ jobId });
    } catch (error) {
      console.error("Error in get:", error);
      return null;
    }
  }

  async getAll() {
    try {
      return await jobs.find({});
    } catch (error) {
      console.error("Error in getAll:", error);
      return [];
    }
  }

  search = async (query = {}, page = 1, limit = 20) => {
    const r = new Result("search jobs");
    try {
      let cats = jobs.find({});
      // اضافه کردن فیلترها به کوئری
      if (query.jobId && query.jobId.trim().length > 0) {
        cats = cats.where("jobId").equals(query.jobId.trim());
      }
      if (query.jobPersianTitle && query.jobPersianTitle.trim().length > 0) {
        cats = cats
          .where("jobPersianTitle")
          .equals({ $regex: query.jobPersianTitle.trim(), $options: "i" });
      }
      if (query.jobLatinTitle && query.jobLatinTitle.trim().length > 0) {
        cats = cats
          .where("jobLatinTitle")
          .equals({ $regex: query.jobLatinTitle.trim(), $options: "i" });
      }
      if (query.description && query.description.trim().length > 0) {
        cats = cats
          .where("description")
          .equals({ $regex: query.description.trim(), $options: "i" });
      }

      // انتخاب فیلدهای مورد نیاز
      const q = cats.select([
        "jobId",
        "jobPersianTitle",
        "jobLatinTitle",
        "description",
        "jobCoverImageUrl",
      ]);

      // دریافت تعداد کل مستندات مطابق با فیلترها
      const count = await jobs.countDocuments(cats.getQuery());

      // دریافت نتایج صفحه‌بندی شده
      const results = await q
        .sort([["jobPersianTitle", "desc"]])
        .skip((page - 1) * limit) // اصلاح صفحه‌بندی
        .limit(limit);

      // ساخت لیست داده‌ها
      const catsList = results.map((item) => ({
        jobId: item.jobId,
        jobPersianTitle: item.jobPersianTitle,
        jobLatinTitle: item.jobLatinTitle,
        description: item.description,
        jobCoverImageUrl: item.jobCoverImageUrl,
      }));
      // محاسبه تعداد کل صفحات
      const totalPages = Math.ceil(count / limit);

      return r.succeeded(
        "Jobs fetched successfully",
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
      return r.failed("Failed to fetch jobs", undefined, 500);
    }
  };
}

export default JobRepository;
