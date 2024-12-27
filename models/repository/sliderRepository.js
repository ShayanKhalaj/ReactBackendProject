import Result from "../base/result.js";
import { sliders } from "../schema/slider.js";  // Import your Slider model

class SliderRepository {
    async create(model) {
        const result = new Result('create slider');
        try {
            const createResult = await sliders.create(model);
            return result.succeeded('Slider created successfully', createResult.sliderId, 201);
        } catch (error) {
            console.error("Error in create:", error);
            return result.failed('Failed to create slider', undefined, 500);
        }
    }

    async delete(sliderId) {
        const result = new Result('delete slider');
        try {
            const deleteResult = await sliders.deleteOne({ sliderId });
            if (deleteResult.deletedCount === 0) {
                return result.failed('Slider not found', sliderId, 404);
            }
            return result.succeeded('Slider deleted successfully', sliderId, 200);
        } catch (error) {
            console.error("Error in delete:", error);
            return result.failed('Failed to delete slider', undefined, 500);
        }
    }

    async update(model) {
        const result = new Result('update slider');
        try {
            const updateResult = await sliders.updateOne(
                { sliderId: model.sliderId },
                { $set: model }
            );
            if (updateResult.matchedCount === 0) {
                return result.failed('Slider not found', model.sliderId, 404);
            }
            return result.succeeded('Slider updated successfully', model.sliderId, 200);
        } catch (error) {
            console.error("Error in update:", error);
            return result.failed('Failed to update slider', undefined, 500);
        }
    }

    async isSliderExistedByThisId(sliderId) {
        try {
            const slider = await sliders.findOne({ sliderId });
            return !!slider;
        } catch (error) {
            console.error("Error in checking slider existence:", error);
            return false;
        }
    }

    async get(sliderId) {
        try {
            return await sliders.findOne({ sliderId }).populate('movies.movieId').populate('series.serieId');
        } catch (error) {
            console.error("Error in get:", error);
            return null;
        }
    }

    async getAll() {
        try {
            return await sliders.find({}).populate('movies.movieId').populate('series.serieId');
        } catch (error) {
            console.error("Error in getAll:", error);
            return [];
        }
    }

    async search(query = {}, page = 1, limit = 10) {
        const result = new Result('search sliders');
        try {
            const skip = (page - 1) * limit;
            const [slidersList, total] = await Promise.all([
                sliders.find(query).skip(skip).limit(limit).populate('movies.movieId').populate('series.serieId'),
                sliders.countDocuments(query),
            ]);

            const totalPages = Math.ceil(total / limit);

            return result.succeeded('Sliders fetched successfully', {
                data: slidersList,
                pagination: {
                    total,
                    totalPages,
                    currentPage: page,
                    pageSize: limit,
                },
            }, 200);
        } catch (error) {
            console.error("Error in search:", error);
            return result.failed('Failed to fetch sliders', undefined, 500);
        }
    }
}

export default SliderRepository;
