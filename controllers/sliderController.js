import SliderRepository from "../models/repository/sliderRepository.js";


const sliderRepo = new SliderRepository();

class SliderController {
    // برای ایجاد یک اسلاید جدید
    async create(req, res) {
        const { body } = req;

        try {
            const result = await sliderRepo.create(body);
            return res.status(result.statusCode).json(result);
        } catch (error) {
            console.error("Error creating slider:", error);
            return res.status(500).json({ message: "Failed to create slider" });
        }
    }

    // برای حذف یک اسلاید
    async delete(req, res) {
        const { sliderId } = req.params;

        try {
            const result = await sliderRepo.delete(sliderId);
            return res.status(result.statusCode).json(result);
        } catch (error) {
            console.error("Error deleting slider:", error);
            return res.status(500).json({ message: "Failed to delete slider" });
        }
    }

    // برای بروزرسانی اطلاعات یک اسلاید
    async update(req, res) {
        const { body } = req;

        try {
            const result = await sliderRepo.update(body);
            return res.status(result.statusCode).json(result);
        } catch (error) {
            console.error("Error updating slider:", error);
            return res.status(500).json({ message: "Failed to update slider" });
        }
    }

    // برای بررسی وجود اسلاید با شناسه
    async isSliderExistedByThisId(req, res) {
        const { sliderId } = req.params;

        try {
            const exists = await sliderRepo.isSliderExistedByThisId(sliderId);
            if (exists) {
                return res.status(200).json({ message: "Slider exists" });
            }
            return res.status(404).json({ message: "Slider not found" });
        } catch (error) {
            console.error("Error checking slider existence:", error);
            return res.status(500).json({ message: "Failed to check slider existence" });
        }
    }

    // برای دریافت یک اسلاید با استفاده از شناسه
    async get(req, res) {
        const { sliderId } = req.params;

        try {
            const slider = await sliderRepo.get(sliderId);
            if (slider) {
                return res.status(200).json({ message: "Slider fetched successfully", data: slider });
            }
            return res.status(404).json({ message: "Slider not found" });
        } catch (error) {
            console.error("Error fetching slider:", error);
            return res.status(500).json({ message: "Failed to fetch slider" });
        }
    }

    // برای دریافت تمامی اسلایدها
    async getAll(req, res) {
        try {
            const sliders = await sliderRepo.getAll();
            return res.status(200).json({ message: "All sliders fetched", data: sliders });
        } catch (error) {
            console.error("Error fetching sliders:", error);
            return res.status(500).json({ message: "Failed to fetch sliders" });
        }
    }

    // برای جستجوی اسلایدها با توجه به پارامترها
    async search(req, res) {
        const { page = 1, limit = 10, ...query } = req.query;

        try {
            const result = await sliderRepo.search(query, parseInt(page), parseInt(limit));
            return res.status(result.statusCode).json(result);
        } catch (error) {
            console.error("Error searching sliders:", error);
            return res.status(500).json({ message: "Failed to search sliders" });
        }
    }
}

export default SliderController;
