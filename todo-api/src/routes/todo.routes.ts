// src/routes/todo.routes.ts
import { Router } from 'express';
import TodoController from '../controllers/todoController';
import { authenticateToken } from '../middleware/authMiddleware';

const router = Router();

// All todo routes require authentication
router.use(authenticateToken);

router.get('/', TodoController.getAllTodos);
router.post('/', TodoController.createTodo);
router.put('/:id', TodoController.updateTodo);
router.delete('/:id', TodoController.deleteTodo);

export default router;
