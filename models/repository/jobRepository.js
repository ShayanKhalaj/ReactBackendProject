import Result from "../base/result.js";
import { jobs } from "../schema/job.js";  // Import your Job model

class JobRepository {
    async create(model) {
        const result = new Result('create job');
        try {
            const createResult = await jobs.create(model);
            return result.succeeded('Job created successfully', createResult.jobId, 201);
        } catch (error) {
            console.error("Error in create:", error);
            return result.failed('Failed to create job', undefined, 500);
        }
    }

    async delete(jobId) {
        const result = new Result('delete job');
        try {
            const deleteResult = await jobs.deleteOne({ jobId });
            if (deleteResult.deletedCount === 0) {
                return result.failed('Job not found', jobId, 404);
            }
            return result.succeeded('Job deleted successfully', jobId, 200);
        } catch (error) {
            console.error("Error in delete:", error);
            return result.failed('Failed to delete job', undefined, 500);
        }
    }

    async update(model) {
        const result = new Result('update job');
        try {
            const updateResult = await jobs.updateOne(
                { jobId: model.jobId },
                { $set: model }
            );
            if (updateResult.matchedCount === 0) {
                return result.failed('Job not found', model.jobId, 404);
            }
            return result.succeeded('Job updated successfully', model.jobId, 200);
        } catch (error) {
            console.error("Error in update:", error);
            return result.failed('Failed to update job', undefined, 500);
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

    async search(query = {}, page = 1, limit = 10) {
        const result = new Result('search jobs');
        try {
            const skip = (page - 1) * limit;
            const [jobsList, total] = await Promise.all([
                jobs.find(query).skip(skip).limit(limit),
                jobs.countDocuments(query),
            ]);

            const totalPages = Math.ceil(total / limit);

            return result.succeeded('Jobs fetched successfully', {
                data: jobsList,
                pagination: {
                    total,
                    totalPages,
                    currentPage: page,
                    pageSize: limit,
                },
            }, 200);
        } catch (error) {
            console.error("Error in search:", error);
            return result.failed('Failed to fetch jobs', undefined, 500);
        }
    }
}

export default JobRepository;
