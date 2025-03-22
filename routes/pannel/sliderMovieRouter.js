import express from "express";
import SliderMovieController from "../../controllers/sliderMovieController.js";

const sliderMovieRouter = express.Router();
const sliderMovieController = new SliderMovieController();

sliderMovieRouter.post("/create", sliderMovieController.create);
sliderMovieRouter.delete("/delete/:sliderId/:movieId", sliderMovieController.delete);
sliderMovieRouter.put("/update", sliderMovieController.update);
sliderMovieRouter.get("/get/:sliderId/:movieId", sliderMovieController.get);
sliderMovieRouter.get("/getall", sliderMovieController.getAll);
sliderMovieRouter.get("/search", sliderMovieController.search);

export default sliderMovieRouter;
