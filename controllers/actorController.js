import ActorRepository from "../models/repository/actorRepository.js";

const actorRepo = new ActorRepository();

class ActorController {
  async create(req, res) {
    const { body } = req;

    // Check for duplicate actor by name
    const isDuplicate = await actorRepo.hasActorDuplicatedByThisName(
      body.firstname,
      body.lastname
    );
    if (isDuplicate) {
      return res.status(400).json({ message: "Duplicate actor detected" });
    }

    const result = await actorRepo.create(body);
    return res.status(result.status).json(result);
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

    // Check for related movies or series
    const hasRelated = await actorRepo.hasActorRelatedMoviesOrSeriesByThisId(actorId);
    if (hasRelated) {
      return res.status(400).json({ message: "Actor has related movies or series and cannot be deleted" });
    }

    const result = await actorRepo.delete(actorId);
    return res.status(result.status).json(result);
  }

  async update(req, res) {
    const { body } = req;

    const isExisted = await actorRepo.isActorExistedByThisId(body.actorId);
    if (!isExisted) {
      return res.status(404).json({ message: "Actor not found" });
    }

    const result = await actorRepo.update(body);
    return res.status(result.status).json(result);
  }

  async search(req, res) {
    const { page = 1, limit = 10, ...query } = req.query;
    const result = await actorRepo.search(query, parseInt(page, 10), parseInt(limit, 10));
    return res.status(200).json(result);
  }
}

export default ActorController;
