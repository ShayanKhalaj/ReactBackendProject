import EpisodeRepository from "../models/repository/episodeRepository.js";


const episodeRepo = new EpisodeRepository();

class EpisodeController {
    async create(req, res) {
        const { body } = req;

        try {
            const result = await episodeRepo.create(body);
            return res.status(result.statusCode).json(result);
        } catch (error) {
            console.error("Error creating episode:", error);
            return res.status(500).json({ message: "Failed to create episode" });
        }
    }

    async delete(req, res) {
        const { episodeId } = req.params;

        try {
            const result = await episodeRepo.delete(episodeId);
            return res.status(result.statusCode).json(result);
        } catch (error) {
            console.error("Error deleting episode:", error);
            return res.status(500).json({ message: "Failed to delete episode" });
        }
    }

    async update(req, res) {
        const { body } = req;

        try {
            const result = await episodeRepo.update(body);
            return res.status(result.statusCode).json(result);
        } catch (error) {
            console.error("Error updating episode:", error);
            return res.status(500).json({ message: "Failed to update episode" });
        }
    }

    async get(req, res) {
        const { episodeId } = req.params;

        try {
            const episode = await episodeRepo.get(episodeId);
            if (episode) {
                return res.status(200).json({ message: "Episode fetched successfully", data: episode });
            }
            return res.status(404).json({ message: "Episode not found" });
        } catch (error) {
            console.error("Error fetching episode:", error);
            return res.status(500).json({ message: "Failed to fetch episode" });
        }
    }

    async getAll(req, res) {
        try {
            const episodes = await episodeRepo.getAll();
            return res.status(200).json({ message: "All episodes fetched", data: episodes });
        } catch (error) {
            console.error("Error fetching episodes:", error);
            return res.status(500).json({ message: "Failed to fetch episodes" });
        }
    }

    async search(req, res) {
        const { page = 1, limit = 10, ...query } = req.query;

        try {
            const result = await episodeRepo.search(query, parseInt(page), parseInt(limit));
            return res.status(result.statusCode).json(result);
        } catch (error) {
            console.error("Error searching episodes:", error);
            return res.status(500).json({ message: "Failed to search episodes" });
        }
    }
}

export default EpisodeController;
