
import DirectorRepository from '../models/repository/directorRepository.js'


class DirectorController {
  async create(req, res) {
    const directorRepo = new DirectorRepository();
    const result = await directorRepo.create(req.body);
    return res.status(201).json(result);
  }

  async get(req, res) {
    const { id } = req.params;
    const directorRepo = new DirectorRepository();
    const director = await directorRepo.get(id);
    if (director) {
      return res.status(200).json({ message: "Director fetched successfully", data: director });
    }
    return res.status(404).json({ message: "Director not found" });
  }

  async getAll(req, res) {
    const directorRepo = new DirectorRepository();
    const directors = await directorRepo.getAll();
    return res.status(200).json({ message: "All directors fetched", data: directors });
  }

  async delete(req, res) {
    const id = req.params.id;
    const directorRepo = new DirectorRepository();
    const result = await directorRepo.delete(id);
    return res.status(200).json(result);
  }

  async update(req, res) {
    const { body } = req;

    const directorRepo = new DirectorRepository();

    const result = await directorRepo.update(body);
    return res.status(200).json(result);
  }

  async search(req, res) {
    const directorRepo = new DirectorRepository();
    const { page = req.query.page, limit = req.query.limit, ...query } = req.query; // خواندن فیلتر و پارامترهای صفحه‌بندی
    const result = await directorRepo.search(query, page,limit);
    return res.status(200).json(result);
  }
}

export default DirectorController;
