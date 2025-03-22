import GenreRepository from "../models/repository/genreRepository.js";


const genreRepo = new GenreRepository();

class GenreController {
    async create(req, res) {
        const { body } = req;

        try {
            const result = await genreRepo.create(body);
            return res.status(result.statusCode).json(result);
        } catch (error) {
            console.error("Error creating genre:", error);
            return res.status(500).json({ message: "Failed to create genre" });
        }
    }

    async delete(req, res) {
        const { genreId } = req.params;

        try {
            const result = await genreRepo.delete(genreId);
            return res.status(result.statusCode).json(result);
        } catch (error) {
            console.error("Error deleting genre:", error);
            return res.status(500).json({ message: "Failed to delete genre" });
        }
    }

    async update(req, res) {
        const { body } = req;

        try {
            const result = await genreRepo.update(body);
            return res.status(result.statusCode).json(result);
        } catch (error) {
            console.error("Error updating genre:", error);
            return res.status(500).json({ message: "Failed to update genre" });
        }
    }

    async get(req, res) {
        const { genreId } = req.params;

        try {
            const genre = await genreRepo.get(genreId);
            if (genre) {
                return res.status(200).json({ message: "Genre fetched successfully", data: genre });
            }
            return res.status(404).json({ message: "Genre not found" });
        } catch (error) {
            console.error("Error fetching genre:", error);
            return res.status(500).json({ message: "Failed to fetch genre" });
        }
    }

    async getAll(req, res) {
        try {
            const genres = await genreRepo.getAll();
            return res.status(200).json({ message: "All genres fetched", data: genres });
        } catch (error) {
            console.error("Error fetching genres:", error);
            return res.status(500).json({ message: "Failed to fetch genres" });
        }
    }

    async search(req, res) {
        const { page = 1, limit = 10, ...query } = req.query;

        try {
            const result = await genreRepo.search(query, parseInt(page), parseInt(limit));
            return res.status(result.statusCode).json(result);
        } catch (error) {
            console.error("Error searching genres:", error);
            return res.status(500).json({ message: "Failed to search genres" });
        }
    }
}

export default GenreController;
