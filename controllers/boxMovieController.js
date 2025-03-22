import BoxMovieRepository from "../models/repository/boxMovieRepository.js";
import Result from "../models/base/result.js";


class BoxMovieController {

  async create(req, res) {
    const repository = new BoxMovieRepository();
    const result = await  repository.create(req.body);
    return res.status(201).json(result);
  }

  async delete(req, res) {
    const repository = new BoxMovieRepository();
    const { boxId, movieId } = req.params;
    const result = await  repository.delete(boxId, movieId);
    return res.status(200).json(result);
  }

  async update(req, res) {
    const repository = new BoxMovieRepository();
    const result = await  repository.update(req.body);
    return res.status(200).json(result);
  }

  async get(req, res) {
    const repository = new BoxMovieRepository();
    const { boxId, movieId } = req.params;
    const data = await  repository.get(boxId, movieId);
    return res.status(200).json(data);
  }

  async getAll(req, res) {
    const repository = new BoxMovieRepository();
    const data = await  repository.getAll();
    return res.status(200).json(data);
  }

  async search(req, res) {
    const repository = new BoxMovieRepository();
    const {  page, limit } = req.query;
    return res.status(200).json(req.body,parseInt(req.body.page),parseInt(req.body.limit));
  }
}

export default BoxMovieController;
