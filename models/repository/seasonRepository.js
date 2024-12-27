import Result from "../base/result.js";
import { seasons } from "../schema/season.js";

class SeasonRepository {
    async create(model) {
        const result = new Result('create season');
        try {
            const createResult = await seasons.create(model);
            return result.succeeded('Season created successfully', createResult.seasonId, 201);
        } catch (error) {
            console.error("Error in create:", error);
            return result.failed('Failed to create season', undefined, 500);
        }
    }

    async delete(seasonId) {
        const result = new Result('delete season');
        try {
            const deleteResult = await seasons.deleteOne({ seasonId });
            if (deleteResult.deletedCount === 0) {
                return result.failed('Season not found', seasonId, 404);
            }
            return result.succeeded('Season deleted successfully', seasonId, 200);
        } catch (error) {
            console.error("Error in delete:", error);
            return result.failed('Failed to delete season', undefined, 500);
        }
    }

    async update(model) {
        const result = new Result('update season');
        try {
            const updateResult = await seasons.updateOne(
                { seasonId: model.seasonId },
                { $set: model }
            );
            if (updateResult.matchedCount === 0) {
                return result.failed('Season not found', model.seasonId, 404);
            }
            return result.succeeded('Season updated successfully', model.seasonId, 200);
        } catch (error) {
            console.error("Error in update:", error);
            return result.failed('Failed to update season', undefined, 500);
        }
    }

    async get(seasonId) {
        try {
            return await seasons.findOne({ seasonId });
        } catch (error) {
            console.error("Error in get:", error);
            return null;
        }
    }

    async getAll() {
        try {
            return await seasons.find({});
        } catch (error) {
            console.error("Error in getAll:", error);
            return [];
        }
    }

    async search(query = {}, page = 1, limit = 10) {
        const result = new Result('search seasons');
        try {
            const skip = (page - 1) * limit;
            const [seasonList, total] = await Promise.all([
                seasons.find(query).skip(skip).limit(limit),
                seasons.countDocuments(query),
            ]);
            const totalPages = Math.ceil(total / limit);
            return result.succeeded('Seasons fetched successfully', {
                data: seasonList,
                pagination: {
                    total,
                    totalPages,
                    currentPage: page,
                    pageSize: limit,
                },
            }, 200);
        } catch (error) {
            console.error("Error in search:", error);
            return result.failed('Failed to fetch seasons', undefined, 500);
        }
    }
}

export default SeasonRepository;
