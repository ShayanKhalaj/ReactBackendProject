import express from 'express';
import ActorController from '../../controllers/actorController.js';

const actorRouter = express.Router();
const actorController = new ActorController();

actorRouter.get('/getall', actorController.getAll); 
actorRouter.get('/get/:id', actorController.get); 
actorRouter.get('/search', actorController.search); 
actorRouter.post('/create', actorController.create); 
actorRouter.delete('/delete/:id', actorController.delete);
actorRouter.put('/update', actorController.update); 

export default actorRouter;
