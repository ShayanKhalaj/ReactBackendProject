import express from "express";
import BoxMovieController from "../../controllers/boxMovieController.js";

const boxMovieRouter = express.Router();
const boxMovieController = new BoxMovieController();

boxMovieRouter.post("/create", boxMovieController.create);
boxMovieRouter.delete("/delete/:boxId/:movieId", boxMovieController.delete);
boxMovieRouter.put("/update", boxMovieController.update);
boxMovieRouter.get("/get/:boxId/:movieId", boxMovieController.get);
boxMovieRouter.get("/getall", boxMovieController.getAll);
boxMovieRouter.get("/search", boxMovieController.search);

export default boxMovieRouter;
