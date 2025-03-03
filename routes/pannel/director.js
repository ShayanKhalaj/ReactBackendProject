import express from 'express';
import DirectorController from '../../controllers/directorController.js';

const directorRouter = express.Router();
const directorController = new DirectorController();

directorRouter.get('/getall', directorController.getAll); 
directorRouter.get('/get/:id', directorController.get); 
directorRouter.get('/search', directorController.search); 
directorRouter.post('/create', directorController.create); 
directorRouter.delete('/delete/:id', directorController.delete);
directorRouter.put('/update', directorController.update); 

export default directorRouter;
