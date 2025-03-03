import DirectorRepository from "../models/repository/directorRepository.js";

const directorRepo = new DirectorRepository();

class DirectorController {
  async create(req, res) {
    const { body } = req;

    // Check for duplicate director by name
    const isDuplicate = await directorRepo.hasDirectorDuplicatedByThisName(
      body.firstname,
      body.lastname
    );
    if (isDuplicate) {
      return res.status(400).json({ message: "Duplicate director detected" });
    }

    const result = await directorRepo.create(body);
    return res.status(result.status).json(result);
  }

  async get(req, res) {
    const { id } = req.params;
    const director = await directorRepo.get(id);
    if (director) {
      return res.status(200).json({ message: "Director fetched successfully", data: director });
    }
    return res.status(404).json({ message: "Director not found" });
  }

  async getAll(req, res) {
    const directors = await directorRepo.getAll();
    return res.status(200).json({ message: "All directors fetched", data: directors });
  }

  async delete(req, res) {
    const { directorId } = req.params;

    // Check for related movies or series
    const hasRelated = await directorRepo.hasDirectorRelatedMoviesOrSeriesByThisId(directorId);
    if (hasRelated) {
      return res.status(400).json({ message: "Director has related movies or series and cannot be deleted" });
    }

    const result = await directorRepo.delete(directorId);
    return res.status(result.status).json(result);
  }

  async update(req, res) {
    const { body } = req;

    const isExisted = await directorRepo.isDirectorExistedByThisId(body.directorId);
    if (!isExisted) {
      return res.status(404).json({ message: "Director not found" });
    }

    const result = await directorRepo.update(body);
    return res.status(result.status).json(result);
  }

  async search(req, res) {
    const { page = 1, limit = 10, ...query } = req.query;
    const result = await directorRepo.search(query, parseInt(page, 10), parseInt(limit, 10));
    return res.status(200).json(result);
  }
}

export default DirectorController;
