import Result from "../base/result.js";
import { genres } from "../schema/genre.js";  // Import your Genre model

class GenreRepository {
    async create(model) {
        const result = new Result('create genre');
        try {
            const createResult = await genres.create(model);
            return result.succeeded('Genre created successfully', createResult.genreId, 201);
        } catch (error) {
            console.error("Error in create:", error);
            return result.failed('Failed to create genre', undefined, 500);
        }
    }

    async delete(genreId) {
        const result = new Result('delete genre');
        try {
            const deleteResult = await genres.deleteOne({ genreId });
            if (deleteResult.deletedCount === 0) {
                return result.failed('Genre not found', genreId, 404);
            }
            return result.succeeded('Genre deleted successfully', genreId, 200);
        } catch (error) {
            console.error("Error in delete:", error);
            return result.failed('Failed to delete genre', undefined, 500);
        }
    }

    async update(model) {
        const result = new Result('update genre');
        try {
            const updateResult = await genres.updateOne(
                { genreId: model.genreId },
                { $set: model }
            );
            if (updateResult.matchedCount === 0) {
                return result.failed('Genre not found', model.genreId, 404);
            }
            return result.succeeded('Genre updated successfully', model.genreId, 200);
        } catch (error) {
            console.error("Error in update:", error);
            return result.failed('Failed to update genre', undefined, 500);
        }
    }

    async isGenreExistedByThisId(genreId) {
        try {
            const genre = await genres.findOne({ genreId });
            return !!genre;
        } catch (error) {
            console.error("Error in checking genre existence:", error);
            return false;
        }
    }

    async get(genreId) {
        try {
            return await genres.findOne({ genreId });
        } catch (error) {
            console.error("Error in get:", error);
            return null;
        }
    }

    async getAll() {
        try {
            return await genres.find({});
        } catch (error) {
            console.error("Error in getAll:", error);
            return [];
        }
    }

    async search(query = {}, page = 1, limit = 10) {
        const result = new Result('search genres');
        try {
            const skip = (page - 1) * limit;
            const [genresList, total] = await Promise.all([
                genres.find(query).skip(skip).limit(limit),
                genres.countDocuments(query),
            ]);

            const totalPages = Math.ceil(total / limit);

            return result.succeeded('Genres fetched successfully', {
                data: genresList,
                pagination: {
                    total,
                    totalPages,
                    currentPage: page,
                    pageSize: limit,
                },
            }, 200);
        } catch (error) {
            console.error("Error in search:", error);
            return result.failed('Failed to fetch genres', undefined, 500);
        }
    }
}

export default GenreRepository;
