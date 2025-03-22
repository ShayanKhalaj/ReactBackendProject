import express from "express";
import ActorMovieController from "../../controllers/actorMovieController.js";

const actorMovieRouter = express.Router();
const actorMovieController = new ActorMovieController();

actorMovieRouter.post("/create", actorMovieController.create);
actorMovieRouter.delete("/delete/:actorId/:movieId", actorMovieController.delete);
actorMovieRouter.put("/update", actorMovieController.update);
actorMovieRouter.get("/get/:actorId/:movieId", actorMovieController.get);
actorMovieRouter.get("/getall", actorMovieController.getAll);
actorMovieRouter.get("/search", actorMovieController.search);

export default actorMovieRouter;
