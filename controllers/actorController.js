import Result from "../models/base/result.js";
import ActorRepository from "../models/repository/actorRepository.js";

const actorRepo = new ActorRepository();

class ActorController {
  async create(req, res) {
    const result = await actorRepo.create(req.body);
    return res.status(201).json(result);
  }

  async get(req, res) {
    const { id } = req.params;
    const actor = await actorRepo.get(id);
    if (actor) {
      return res.status(200).json({ message: "Actor fetched successfully", data: actor });
    }
    return res.status(404).json({ message: "Actor not found" });
  }

  async getAll(req, res) {
    const actors = await actorRepo.getAll();
    return res.status(200).json({ message: "All actors fetched", data: actors });
  }

  async delete(req, res) {
    const { actorId } = req.params;
    const result = await actorRepo.delete(actorId);
    return res.status(200).json(result);
  }

  async update(req, res) {
    const { body } = req;
    const result = await actorRepo.update(body);
    return res.status(200).json(result);
  }

  async search(req, res) {
    const { page = 1, limit = 10, ...query } = req.query;
    const result = await actorRepo.search(query, parseInt(page, 10), parseInt(limit, 10));
    return res.status(200).json(result);
  }
  
}

export default ActorController;
