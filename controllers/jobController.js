import JobRepository from "../models/repository/jobRepository.js";


const jobRepo = new JobRepository();

class JobController {
    async create(req, res) {
        const { body } = req;

        try {
            const result = await jobRepo.create(body);
            return res.status(result.statusCode).json(result);
        } catch (error) {
            console.error("Error creating job:", error);
            return res.status(500).json({ message: "Failed to create job" });
        }
    }

    async delete(req, res) {
        const { jobId } = req.params;

        try {
            const result = await jobRepo.delete(jobId);
            return res.status(result.statusCode).json(result);
        } catch (error) {
            console.error("Error deleting job:", error);
            return res.status(500).json({ message: "Failed to delete job" });
        }
    }

    async update(req, res) {
        const { body } = req;

        try {
            const result = await jobRepo.update(body);
            return res.status(result.statusCode).json(result);
        } catch (error) {
            console.error("Error updating job:", error);
            return res.status(500).json({ message: "Failed to update job" });
        }
    }

    async get(req, res) {
        const { jobId } = req.params;

        try {
            const job = await jobRepo.get(jobId);
            if (job) {
                return res.status(200).json({ message: "Job fetched successfully", data: job });
            }
            return res.status(404).json({ message: "Job not found" });
        } catch (error) {
            console.error("Error fetching job:", error);
            return res.status(500).json({ message: "Failed to fetch job" });
        }
    }

    async getAll(req, res) {
        try {
            const jobs = await jobRepo.getAll();
            return res.status(200).json({ message: "All jobs fetched", data: jobs });
        } catch (error) {
            console.error("Error fetching jobs:", error);
            return res.status(500).json({ message: "Failed to fetch jobs" });
        }
    }

    async search(req, res) {
        const { page = 1, limit = 10, ...query } = req.query;

        try {
            const result = await jobRepo.search(query, parseInt(page), parseInt(limit));
            return res.status(result.statusCode).json(result);
        } catch (error) {
            console.error("Error searching jobs:", error);
            return res.status(500).json({ message: "Failed to search jobs" });
        }
    }
}

export default JobController;
