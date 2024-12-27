import Result from "../base/result.js";
import { movies } from "../schema/movie.js";

class MovieRepository {
    async create(model) {
        const result = new Result('create movie');
        try {
            const createResult = await movies.create(model);
            return result.succeeded('Movie created successfully', createResult.movieId, 201);
        } catch (error) {
            console.error("Error in create:", error);
            return result.failed('Failed to create movie', undefined, 500);
        }
    }

    async hasMovieDuplicatedByThisTitle(moviePersianTitle, movieLatinTitle) {
        try {
            const duplicate = await movies.find({
                moviePersianTitle,
                movieLatinTitle,
            });
            return duplicate.length > 0;
        } catch (error) {
            console.error("Error in checking duplicate movie:", error);
            return false;
        }
    }

    async delete(movieId) {
        const result = new Result('delete movie');
        try {
            const deleteResult = await movies.deleteOne({ movieId });
            if (deleteResult.deletedCount === 0) {
                return result.failed('Movie not found', movieId, 404);
            }
            return result.succeeded('Movie deleted successfully', movieId, 200);
        } catch (error) {
            console.error("Error in delete:", error);
            return result.failed('Failed to delete movie', undefined, 500);
        }
    }

    async update(model) {
        const result = new Result('update movie');
        try {
            const updateResult = await movies.updateOne(
                { movieId: model.movieId },
                { $set: model }
            );
            if (updateResult.matchedCount === 0) {
                return result.failed('Movie not found', model.movieId, 404);
            }
            return result.succeeded('Movie updated successfully', model.movieId, 200);
        } catch (error) {
            console.error("Error in update:", error);
            return result.failed('Failed to update movie', undefined, 500);
        }
    }

    async isMovieExistedByThisId(movieId) {
        try {
            const movie = await movies.findOne({ movieId });
            return !!movie;
        } catch (error) {
            console.error("Error in checking movie existence:", error);
            return false;
        }
    }

    async get(movieId) {
        try {
            return await movies.findOne({ movieId });
        } catch (error) {
            console.error("Error in get:", error);
            return null;
        }
    }

    async getAll() {
        try {
            return await movies.find({});
        } catch (error) {
            console.error("Error in getAll:", error);
            return [];
        }
    }

    async search(query = {}, page = 1, limit = 10) {
        const result = new Result('search movies');
        try {
            const skip = (page - 1) * limit;

            const [moviesList, total] = await Promise.all([
                movies.find(query).skip(skip).limit(limit),
                movies.countDocuments(query),
            ]);

            const totalPages = Math.ceil(total / limit);

            return result.succeeded('Movies fetched successfully', {
                data: moviesList,
                pagination: {
                    total,
                    totalPages,
                    currentPage: page,
                    pageSize: limit,
                },
            }, 200);
        } catch (error) {
            console.error("Error in search:", error);
            return result.failed('Failed to fetch movies', undefined, 500);
        }
    }
}

export default MovieRepository;
