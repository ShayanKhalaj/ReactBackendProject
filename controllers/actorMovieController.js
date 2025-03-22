import ActorMovieRepository from "../models/repository/actorMovieRepository.js";

const actorMovieRepo = new ActorMovieRepository();

class ActorMovieController {
    async create(req, res) {
        const { body } = req;
        const result = await actorMovieRepo.create(body);
        return res.status(201).json(result);
    }

    async get(req, res) {
        const { actorId, movieId } = req.params;
        const relation = await actorMovieRepo.get(actorId, movieId);
        if (relation) {
            return res.status(200).json({ message: "Relation fetched successfully", data: relation });
        }
        return res.status(404).json({ message: "Relation not found" });
    }

    async getAll(req, res) {
        const relations = await actorMovieRepo.getAll();
        return res.status(200).json({ message: "All relations fetched", data: relations });
    }

    async delete(req, res) {
        const { actorId, movieId } = req.params;
        const result = await actorMovieRepo.delete(actorId, movieId);
        return res.status(200).json(result);
    }

    async update(req, res) {
        const { body } = req;
        const result = await actorMovieRepo.update(body);
        return res.status(200).json(result);
    }

    async search(req, res) {
        const { page = 1, limit = 20, ...query } = req.query;
        const result = await actorMovieRepo.search(query, Number(page), Number(limit));
        return res.status(200).json(result);
    }
}

export default ActorMovieController;