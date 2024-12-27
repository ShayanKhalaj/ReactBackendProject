import SerieRepository from "../models/repository/serieRepository.js";


const serieRepo = new SerieRepository();

class SerieController {
    // برای ایجاد یک سریال جدید
    async create(req, res) {
        const { body } = req;

        try {
            const result = await serieRepo.create(body);
            return res.status(result.statusCode).json(result);
        } catch (error) {
            console.error("Error creating serie:", error);
            return res.status(500).json({ message: "Failed to create serie" });
        }
    }

    // برای حذف یک سریال
    async delete(req, res) {
        const { serieId } = req.params;

        try {
            const result = await serieRepo.delete(serieId);
            return res.status(result.statusCode).json(result);
        } catch (error) {
            console.error("Error deleting serie:", error);
            return res.status(500).json({ message: "Failed to delete serie" });
        }
    }

    // برای بروزرسانی اطلاعات یک سریال
    async update(req, res) {
        const { body } = req;

        try {
            const result = await serieRepo.update(body);
            return res.status(result.statusCode).json(result);
        } catch (error) {
            console.error("Error updating serie:", error);
            return res.status(500).json({ message: "Failed to update serie" });
        }
    }

    // برای بررسی وجود سریال با شناسه
    async isSerieExistedByThisId(req, res) {
        const { serieId } = req.params;

        try {
            const exists = await serieRepo.isSerieExistedByThisId(serieId);
            if (exists) {
                return res.status(200).json({ message: "Serie exists" });
            }
            return res.status(404).json({ message: "Serie not found" });
        } catch (error) {
            console.error("Error checking serie existence:", error);
            return res.status(500).json({ message: "Failed to check serie existence" });
        }
    }

    // برای دریافت یک سریال با استفاده از شناسه
    async get(req, res) {
        const { serieId } = req.params;

        try {
            const serie = await serieRepo.get(serieId);
            if (serie) {
                return res.status(200).json({ message: "Serie fetched successfully", data: serie });
            }
            return res.status(404).json({ message: "Serie not found" });
        } catch (error) {
            console.error("Error fetching serie:", error);
            return res.status(500).json({ message: "Failed to fetch serie" });
        }
    }

    // برای دریافت تمام سریال‌ها
    async getAll(req, res) {
        try {
            const series = await serieRepo.getAll();
            return res.status(200).json({ message: "All series fetched", data: series });
        } catch (error) {
            console.error("Error fetching series:", error);
            return res.status(500).json({ message: "Failed to fetch series" });
        }
    }

    // برای جستجوی سریال‌ها با توجه به پارامترها
    async search(req, res) {
        const { page = 1, limit = 10, ...query } = req.query;

        try {
            const result = await serieRepo.search(query, parseInt(page), parseInt(limit));
            return res.status(result.statusCode).json(result);
        } catch (error) {
            console.error("Error searching series:", error);
            return res.status(500).json({ message: "Failed to search series" });
        }
    }
}

export default SerieController;
