import { Router } from 'express';
import { createTask, getTasks, updateTask, deleteTask } from '../controllers/task.controller';
import { verifyToken } from '../middlewares/auth.middleware';

const router: Router = Router();

// Protected routes
router.post('/create', verifyToken, createTask);
router.get('/get', verifyToken, getTasks);
router.put('/update/:taskId', verifyToken, updateTask);
router.delete('/delete/:taskId', verifyToken, deleteTask);

export default router;
