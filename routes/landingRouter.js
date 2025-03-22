import express from "express";
import LandingController from "../controllers/landingController.js";

const landingRouter = express.Router()

landingRouter.get("/slider/get",new LandingController().getSlider);
landingRouter.get("/slider/get/:categoryId",new LandingController().getSliderByCategoryId);
landingRouter.get("/boxes/get",new LandingController().getBoxWithMovies);
landingRouter.get("/boxes/get/:categoryId",new LandingController().getBoxWithMoviesByCategoryId);
landingRouter.get("/categories/get",new LandingController().getCategories);
landingRouter.get("/movie/get/:movieId",new LandingController().getMovieById);
landingRouter.get("/genre/get/:genreId",new LandingController().getGenreByMovieId);
landingRouter.get("/director/get/:directorId",new LandingController().getDirectorByMovieId);
landingRouter.get("/actors/get/:movieId",new LandingController().getActorMoviesByMovieId);

export default landingRouter