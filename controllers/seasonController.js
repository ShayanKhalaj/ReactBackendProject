import SeasonRepository from "../models/repository/seasonRepository.js";


const seasonRepo = new SeasonRepository();

class SeasonController {
    // برای ایجاد یک فصل جدید
    async create(req, res) {
        const { body } = req;

        try {
            const result = await seasonRepo.create(body);
            return res.status(result.statusCode).json(result);
        } catch (error) {
            console.error("Error creating season:", error);
            return res.status(500).json({ message: "Failed to create season" });
        }
    }

    // برای حذف یک فصل
    async delete(req, res) {
        const { seasonId } = req.params;

        try {
            const result = await seasonRepo.delete(seasonId);
            return res.status(result.statusCode).json(result);
        } catch (error) {
            console.error("Error deleting season:", error);
            return res.status(500).json({ message: "Failed to delete season" });
        }
    }

    // برای بروزرسانی اطلاعات یک فصل
    async update(req, res) {
        const { body } = req;

        try {
            const result = await seasonRepo.update(body);
            return res.status(result.statusCode).json(result);
        } catch (error) {
            console.error("Error updating season:", error);
            return res.status(500).json({ message: "Failed to update season" });
        }
    }

    // برای دریافت یک فصل با استفاده از شناسه
    async get(req, res) {
        const { seasonId } = req.params;

        try {
            const season = await seasonRepo.get(seasonId);
            if (season) {
                return res.status(200).json({ message: "Season fetched successfully", data: season });
            }
            return res.status(404).json({ message: "Season not found" });
        } catch (error) {
            console.error("Error fetching season:", error);
            return res.status(500).json({ message: "Failed to fetch season" });
        }
    }

    // برای دریافت تمام فصل‌ها
    async getAll(req, res) {
        try {
            const seasons = await seasonRepo.getAll();
            return res.status(200).json({ message: "All seasons fetched", data: seasons });
        } catch (error) {
            console.error("Error fetching seasons:", error);
            return res.status(500).json({ message: "Failed to fetch seasons" });
        }
    }

    // برای جستجوی فصل‌ها با توجه به پارامترها
    async search(req, res) {
        const { page = 1, limit = 10, ...query } = req.query;

        try {
            const result = await seasonRepo.search(query, parseInt(page), parseInt(limit));
            return res.status(result.statusCode).json(result);
        } catch (error) {
            console.error("Error searching seasons:", error);
            return res.status(500).json({ message: "Failed to search seasons" });
        }
    }
}

export default SeasonController;
