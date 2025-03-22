import SliderMovieRepository from "../models/repository/sliderMovieRepository.js";

const sliderMovieRepo = new SliderMovieRepository();

class SliderMovieController {
  async create(req, res) {
    const result = await sliderMovieRepo.create(req.body);
    return res.status(result.statusCode).json(result);
  }

  async delete(req, res) {
    const { sliderId, movieId } = req.params;
    const result = await sliderMovieRepo.delete(sliderId, movieId);
    return res.status(result.statusCode).json(result);
  }

  async update(req, res) {
    const result = await sliderMovieRepo.update(req.body);
    return res.status(result.statusCode).json(result);
  }

  async get(req, res) {
    const { sliderId, movieId } = req.params;
    const data = await sliderMovieRepo.get(sliderId, movieId);
    if (!data) return res.status(404).json({ message: "Relation not found" });
    return res.status(200).json(data);
  }

  async getAll(req, res) {
    const data = await sliderMovieRepo.getAll();
    return res.status(200).json(data);
  }

  async search(req, res) {
    const { page = 1, limit = 20, sliderId, movieId } = req.query;
    const query = {};
    if (sliderId) query.sliderId = sliderId;
    if (movieId) query.movieId = movieId;
    
    const result = await sliderMovieRepo.search(query, parseInt(page), parseInt(limit));
    return res.status(result.statusCode).json(result);
  }
}

export default SliderMovieController;
