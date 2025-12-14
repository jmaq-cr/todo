// src/controllers/todoController.ts
import { Request, Response } from 'express';
import TodoService from '../services/todoService';

class TodoController {
  static async getAllTodos(req: Request, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
      }
      
      const todos = await TodoService.getAllTodos(req.user.id);
      res.json(todos);
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  }

  static async createTodo(req: Request, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
      }
      
      const { task } = req.body;
      const todo = await TodoService.createTodo(req.user.id, task);
      res.status(201).json(todo);
    } catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  }

  static async updateTodo(req: Request, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
      }
      
      const { id } = req.params;
      const { task, completed } = req.body;
      
      const result = await TodoService.updateTodo(
        parseInt(id),
        req.user.id,
        task,
        completed
      );
      
      res.json(result);
    } catch (error) {
      const statusCode = (error as Error).message === 'Todo not found or unauthorized' ? 404 : 500;
      res.status(statusCode).json({ error: (error as Error).message });
    }
  }

  static async deleteTodo(req: Request, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
      }
      
      const { id } = req.params;
      const result = await TodoService.deleteTodo(parseInt(id), req.user.id);
      res.json(result);
    } catch (error) {
      const statusCode = (error as Error).message === 'Todo not found or unauthorized' ? 404 : 500;
      res.status(statusCode).json({ error: (error as Error).message });
    }
  }
}

export default TodoController;
