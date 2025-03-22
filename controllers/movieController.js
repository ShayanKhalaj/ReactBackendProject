import MovieRepository from "../models/repository/movieRepository.js";


const movieRepo = new MovieRepository();

class MovieController {
    async create(req, res) {

        try {
            const result = await movieRepo.create(req.body);
            return res.status(201).json(result);
        } catch (error) {
            console.error("Error creating movie:", error);
            return res.status(500).json({ message: "Failed to create movie" });
        }
    }

    async delete(req, res) {
        const { movieId } = req.params;

        try {
            const result = await movieRepo.delete(movieId);
            return res.status(200).json(result);
        } catch (error) {
            console.error("Error deleting movie:", error);
            return res.status(500).json({ message: "Failed to delete movie" });
        }
    }

    async update(req, res) {
        const { body } = req;

        try {
            const result = await movieRepo.update(body);
            return res.status(200).json(result);
        } catch (error) {
            console.error("Error updating movie:", error);
            return res.status(500).json({ message: "Failed to update movie" });
        }
    }

    async get(req, res) {
        const { movieId } = req.params;

        try {
            const movie = await movieRepo.get(movieId);
            if (movie) {
                return res.status(200).json({ message: "Movie fetched successfully", data: movie });
            }
            return res.status(404).json({ message: "Movie not found" });
        } catch (error) {
            console.error("Error fetching movie:", error);
            return res.status(500).json({ message: "Failed to fetch movie" });
        }
    }

    async getAll(req, res) {
        try {
            const movies = await movieRepo.getAll();
            return res.status(200).json({ message: "All movies fetched", data: movies });
        } catch (error) {
            console.error("Error fetching movies:", error);
            return res.status(500).json({ message: "Failed to fetch movies" });
        }
    }

    async search(req, res) {
        const { page = 1, limit = 10, ...query } = req.query;

        try {
            const result = await movieRepo.search(query, parseInt(page), parseInt(limit));
            return res.status(200).json(result);
        } catch (error) {
            console.error("Error searching movies:", error);
            return res.status(500).json({ message: "Failed to search movies" });
        }
    }
}

export default MovieController;
