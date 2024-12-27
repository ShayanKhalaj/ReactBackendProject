import Result from "../base/result.js";
import { series } from "../schema/serie.js";
import { categories } from "../schema/category.js";
import { genres } from "../schema/genre.js";
import { people } from "../schema/people.js";

class SerieRepository {
    async create(model) {
        const result = new Result('create serie');
        try {
            const createResult = await series.create(model);
            return result.succeeded('Serie created successfully', createResult.serieId, 201);
        } catch (error) {
            console.error("Error in create:", error);
            return result.failed('Failed to create serie', undefined, 500);
        }
    }

    async delete(serieId) {
        const result = new Result('delete serie');
        try {
            const deleteResult = await series.deleteOne({ serieId });
            if (deleteResult.deletedCount === 0) {
                return result.failed('Serie not found', serieId, 404);
            }
            return result.succeeded('Serie deleted successfully', serieId, 200);
        } catch (error) {
            console.error("Error in delete:", error);
            return result.failed('Failed to delete serie', undefined, 500);
        }
    }

    async update(model) {
        const result = new Result('update serie');
        try {
            const updateResult = await series.updateOne(
                { serieId: model.serieId },
                { $set: model }
            );
            if (updateResult.matchedCount === 0) {
                return result.failed('Serie not found', model.serieId, 404);
            }
            return result.succeeded('Serie updated successfully', model.serieId, 200);
        } catch (error) {
            console.error("Error in update:", error);
            return result.failed('Failed to update serie', undefined, 500);
        }
    }

    async isSerieExistedByThisId(serieId) {
        try {
            const serie = await series.findOne({ serieId });
            return !!serie;
        } catch (error) {
            console.error("Error in checking serie existence:", error);
            return false;
        }
    }

    async get(serieId) {
        try {
            return await series.findOne({ serieId }).populate('categoryId genreId people.personId people.jobId');
        } catch (error) {
            console.error("Error in get:", error);
            return null;
        }
    }

    async getAll() {
        try {
            return await series.find({}).populate('categoryId genreId people.personId people.jobId');
        } catch (error) {
            console.error("Error in getAll:", error);
            return [];
        }
    }

    async search(query = {}, page = 1, limit = 10) {
        const result = new Result('search series');
        try {
            const skip = (page - 1) * limit;
            const [seriesList, total] = await Promise.all([
                series.find(query).skip(skip).limit(limit).populate('categoryId genreId people.personId people.jobId'),
                series.countDocuments(query),
            ]);

            const totalPages = Math.ceil(total / limit);

            return result.succeeded('Series fetched successfully', {
                data: seriesList,
                pagination: {
                    total,
                    totalPages,
                    currentPage: page,
                    pageSize: limit,
                },
            }, 200);
        } catch (error) {
            console.error("Error in search:", error);
            return result.failed('Failed to fetch series', undefined, 500);
        }
    }
}

export default SerieRepository;
