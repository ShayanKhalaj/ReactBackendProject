import BoxRepository from "../models/repository/boxRepository.js";

const boxRepo=new BoxRepository()
class BoxController{
    async create(req, res) {
        const { body } = req;

        const isDuplicate = await boxRepo.hasBoxDuplicatedBoxByThisPersianAndLatinName(
            body.boxPersianTitle,
            body.boxLatinTitle,
        );
        if (isDuplicate) {
            return res.status(400).json({ message: "Duplicate box detected" });
        }

        const result = await boxRepo.create(body);
        return res.status(201).json(result);
    }

    async get(req, res) {
        const { id } = req.params;
        const box = await boxRepo.get(id);
        if (box) {
            return res.status(200).json({ message: "Box fetched successfully", data: box });
        }
        return res.status(404).json({ message: "Box not found" });
    }

    async getAll(req, res) {
        const boxes = await boxRepo.getAll();
        return res.status(200).json({ message: "All boxes fetched", data: boxes });
    }

    async delete(req, res) {
        const { boxId } = req.params;

        const hasRelated = await boxRepo.hasBoxRelatedMoviesOrSeriesByThisId(boxId);
        if (hasRelated) {
            return res.status(400).json({ message: "Box has related movies or series and cannot be deleted" });
        }

        const result = await boxRepo.delete(boxId);
        return res.status(201).json(result);
    }

    async update(req, res) {
        const { body } = req;

        const isExisted = await boxRepo.isBoxExistedByThisId(body.boxId);
        if (!isExisted) {
            return res.status(404).json({ message: "Box not found" });
        }

        const result = await boxRepo.update(body);
        return res.status(201).json(result);
    }

    async search(req, res) {
        const { page = 1, limit = 10, ...query } = req.query;
        const result = await boxRepo.search(query, parseInt(page, 10), parseInt(limit, 10));
        return res.status(200).json(result);
    }

}

export default BoxController