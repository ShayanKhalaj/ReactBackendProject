import Result from "../base/result.js";
import { episodes } from "../schema/episode.js";  // Import your Episode model

class EpisodeRepository {
    async create(model) {
        const result = new Result('create episode');
        try {
            const createResult = await episodes.create(model);
            return result.succeeded('Episode created successfully', createResult.episodeId, 201);
        } catch (error) {
            console.error("Error in create:", error);
            return result.failed('Failed to create episode', undefined, 500);
        }
    }

    async delete(episodeId) {
        const result = new Result('delete episode');
        try {
            const deleteResult = await episodes.deleteOne({ episodeId });
            if (deleteResult.deletedCount === 0) {
                return result.failed('Episode not found', episodeId, 404);
            }
            return result.succeeded('Episode deleted successfully', episodeId, 200);
        } catch (error) {
            console.error("Error in delete:", error);
            return result.failed('Failed to delete episode', undefined, 500);
        }
    }

    async update(model) {
        const result = new Result('update episode');
        try {
            const updateResult = await episodes.updateOne(
                { episodeId: model.episodeId },
                { $set: model }
            );
            if (updateResult.matchedCount === 0) {
                return result.failed('Episode not found', model.episodeId, 404);
            }
            return result.succeeded('Episode updated successfully', model.episodeId, 200);
        } catch (error) {
            console.error("Error in update:", error);
            return result.failed('Failed to update episode', undefined, 500);
        }
    }

    async isEpisodeExistedByThisId(episodeId) {
        try {
            const episode = await episodes.findOne({ episodeId });
            return !!episode;
        } catch (error) {
            console.error("Error in checking episode existence:", error);
            return false;
        }
    }

    async get(episodeId) {
        try {
            return await episodes.findOne({ episodeId }).populate('seasonId');
        } catch (error) {
            console.error("Error in get:", error);
            return null;
        }
    }

    async getAll() {
        try {
            return await episodes.find({}).populate('seasonId');
        } catch (error) {
            console.error("Error in getAll:", error);
            return [];
        }
    }

    async search(query = {}, page = 1, limit = 10) {
        const result = new Result('search episodes');
        try {
            const skip = (page - 1) * limit;
            const [episodesList, total] = await Promise.all([
                episodes.find(query).skip(skip).limit(limit).populate('seasonId'),
                episodes.countDocuments(query),
            ]);

            const totalPages = Math.ceil(total / limit);

            return result.succeeded('Episodes fetched successfully', {
                data: episodesList,
                pagination: {
                    total,
                    totalPages,
                    currentPage: page,
                    pageSize: limit,
                },
            }, 200);
        } catch (error) {
            console.error("Error in search:", error);
            return result.failed('Failed to fetch episodes', undefined, 500);
        }
    }
}

export default EpisodeRepository;
