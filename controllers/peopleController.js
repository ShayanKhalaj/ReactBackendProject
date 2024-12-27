import PeopleRepository from "../models/repository/peopleRepository.js";


const peopleRepo = new PeopleRepository();

class PeopleController {
    // برای ایجاد یک شخص جدید
    async create(req, res) {
        const { body } = req;

        try {
            const result = await peopleRepo.create(body);
            return res.status(result.statusCode).json(result);
        } catch (error) {
            console.error("Error creating person:", error);
            return res.status(500).json({ message: "Failed to create person" });
        }
    }

    // برای حذف یک شخص
    async delete(req, res) {
        const { directorId } = req.params;

        try {
            const result = await peopleRepo.delete(directorId);
            return res.status(result.statusCode).json(result);
        } catch (error) {
            console.error("Error deleting person:", error);
            return res.status(500).json({ message: "Failed to delete person" });
        }
    }

    // برای بروزرسانی اطلاعات یک شخص
    async update(req, res) {
        const { body } = req;

        try {
            const result = await peopleRepo.update(body);
            return res.status(result.statusCode).json(result);
        } catch (error) {
            console.error("Error updating person:", error);
            return res.status(500).json({ message: "Failed to update person" });
        }
    }

    // برای دریافت یک شخص با استفاده از شناسه
    async get(req, res) {
        const { directorId } = req.params;

        try {
            const person = await peopleRepo.get(directorId);
            if (person) {
                return res.status(200).json({ message: "Person fetched successfully", data: person });
            }
            return res.status(404).json({ message: "Person not found" });
        } catch (error) {
            console.error("Error fetching person:", error);
            return res.status(500).json({ message: "Failed to fetch person" });
        }
    }

    // برای دریافت تمام افراد
    async getAll(req, res) {
        try {
            const people = await peopleRepo.getAll();
            return res.status(200).json({ message: "All people fetched", data: people });
        } catch (error) {
            console.error("Error fetching people:", error);
            return res.status(500).json({ message: "Failed to fetch people" });
        }
    }

    // برای جستجوی افراد با توجه به پارامترها
    async search(req, res) {
        const { page = 1, limit = 10, ...query } = req.query;

        try {
            const result = await peopleRepo.search(query, parseInt(page), parseInt(limit));
            return res.status(result.statusCode).json(result);
        } catch (error) {
            console.error("Error searching people:", error);
            return res.status(500).json({ message: "Failed to search people" });
        }
    }
}

export default PeopleController;
