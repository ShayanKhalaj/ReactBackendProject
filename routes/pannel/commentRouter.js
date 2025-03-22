import express from 'express';
import CommentController from '../../controllers/commentController.js';


const commentRouter = express.Router();
const commentController = new CommentController();

commentRouter.get('/getall', commentController.getAll); 
commentRouter.get('/get/:commentId', commentController.get); 
commentRouter.get('/search', commentController.search); 
commentRouter.post('/create', commentController.create); 
commentRouter.delete('/delete/:commentId', commentController.delete); 
commentRouter.post('/answer', commentController.answer);

export default commentRouter;
