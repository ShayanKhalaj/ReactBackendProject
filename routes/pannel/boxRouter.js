import express from 'express';
import BoxController from '../../controllers/boxController.js';

const boxRouter = express.Router();
const boxController = new BoxController();

boxRouter.get('/getall', boxController.getAll); 
boxRouter.get('/get/:id', boxController.get); 
boxRouter.get('/search', boxController.search); 
boxRouter.post('/create', boxController.create); 
boxRouter.delete('/delete/:id', boxController.delete);
boxRouter.put('/update', boxController.update); 


export default boxRouter;
