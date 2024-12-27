import Result from "../base/result.js";
import { people } from "../schema/people.js";
import { movies } from "../schema/movie.js";
import { series } from "../schema/serie.js";

class PeopleRepository {
    async create(model) {
        const result = new Result('create person');
        try {
            const createResult = await people.create(model);
            return result.succeeded('Person created successfully', createResult.directorId, 201);
        } catch (error) {
            console.error("Error in create:", error);
            return result.failed('Failed to create person', undefined, 500);
        }
    }

    async delete(directorId) {
        const result = new Result('delete person');
        try {
            const deleteResult = await people.deleteOne({ directorId });
            if (deleteResult.deletedCount === 0) {
                return result.failed('Person not found', directorId, 404);
            }
            return result.succeeded('Person deleted successfully', directorId, 200);
        } catch (error) {
            console.error("Error in delete:", error);
            return result.failed('Failed to delete person', undefined, 500);
        }
    }

    async update(model) {
        const result = new Result('update person');
        try {
            const updateResult = await people.updateOne(
                { directorId: model.directorId },
                { $set: model }
            );
            if (updateResult.matchedCount === 0) {
                return result.failed('Person not found', model.directorId, 404);
            }
            return result.succeeded('Person updated successfully', model.directorId, 200);
        } catch (error) {
            console.error("Error in update:", error);
            return result.failed('Failed to update person', undefined, 500);
        }
    }

    async get(directorId) {
        try {
            return await people.findOne({ directorId });
        } catch (error) {
            console.error("Error in get:", error);
            return null;
        }
    }

    async getAll() {
        try {
            return await people.find({});
        } catch (error) {
            console.error("Error in getAll:", error);
            return [];
        }
    }

    async search(query = {}, page = 1, limit = 10) {
        const result = new Result('search people');
        try {
            const skip = (page - 1) * limit;
            const [peopleList, total] = await Promise.all([
                people.find(query).skip(skip).limit(limit),
                people.countDocuments(query),
            ]);

            const totalPages = Math.ceil(total / limit);

            return result.succeeded('People fetched successfully', {
                data: peopleList,
                pagination: {
                    total,
                    totalPages,
                    currentPage: page,
                    pageSize: limit,
                },
            }, 200);
        } catch (error) {
            console.error("Error in search:", error);
            return result.failed('Failed to fetch people', undefined, 500);
        }
    }

    async hasRelatedMoviesOrSeriesByThisId(directorId) {
        try {
            const [relatedMovies, relatedSeries] = await Promise.all([
                movies.find({ 'movies.directorId': directorId }),
                series.find({ 'series.directorId': directorId }),
            ]);
            return relatedMovies.length > 0 || relatedSeries.length > 0;
        } catch (error) {
            console.error("Error in checking related movies or series:", error);
            return false;
        }
    }
}

export default PeopleRepository;
