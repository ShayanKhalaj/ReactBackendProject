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

    search = async (query = {}, page = 1, limit = 20) => {
        const r = new Result('search sliders');
        try {
            let cats = sliders.find({});

            // اضافه کردن فیلترها به کوئری
            if (query.sliderId && query.sliderId.trim().length > 0) {
                cats = cats.where("sliderId").equals(query.sliderId.trim());
            }
            if (query.sliderPersianTitle && query.sliderPersianTitle.trim().length > 0) {
                cats = cats.where("sliderPersianTitle").equals({ $regex: query.sliderPersianTitle.trim(), $options: 'i' });
            }
            if (query.sliderLatinTitle && query.sliderLatinTitle.trim().length > 0) {
                cats = cats.where("sliderLatinTitle").equals({ $regex: query.sliderLatinTitle.trim(), $options: 'i' });
            }
            if (query.summary && query.summary.trim().length > 0) {
                cats = cats.where("summary").equals({ $regex: query.summary.trim(), $options: 'i' });
            }
            if (query.description && query.description.trim().length > 0) {
                cats = cats.where("description").equals({ $regex: query.description.trim(), $options: 'i' });
            }
            if (query.pageUrl && query.pageUrl.trim().length > 0) {
                cats = cats.where("pageUrl").equals({ $regex: query.pageUrl.trim(), $options: 'i' });
            }
    
            // انتخاب فیلدهای مورد نیاز
            const q = cats.select([
                'sliderId',
                'sliderPersianTitle',
                'sliderLatinTitle',
                'saummary',
                'description',
                'pageUrl',
                'movies',
        
            ]);
    
            // دریافت تعداد کل مستندات مطابق با فیلترها
            const count = await sliders.countDocuments(cats.getQuery());
    
            // دریافت نتایج صفحه‌بندی شده
            const results = await q
                .sort([["sliderPersianTitle", "desc"]])
                .skip((page - 1) * limit)  // اصلاح صفحه‌بندی
                .limit(limit);
    
            // ساخت لیست داده‌ها
            const catsList = results.map(item => ({
                sliderId:item.sliderId,
                sliderPersianTitle:item.sliderPersianTitle,
                sliderLatinTitle:item.sliderLatinTitle,
                saummary:item.saummary,
                description:item.description,
                pageUrl:item.pageUrl,
                movies:item.movies,
            }));
            // محاسبه تعداد کل صفحات
            const totalPages = Math.ceil(count / limit);
    
            return r.succeeded('Sliders fetched successfully', {
                data: catsList,
                pagination: {
                    total: count,
                    totalPages: totalPages,
                    currentPage: page,
                    pageSize: limit,
                },
            }, 200);
        } catch (error) {
            console.error("Error in search:", error);
            return r.failed('Failed to fetch sliders', undefined, 500);
        }
    };
}

export default SliderRepository;
