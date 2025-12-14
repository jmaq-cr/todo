// src/services/todoService.ts
import TodoModel from '../models/Todo';
import { Todo, SuccessResponse } from '../types';

class TodoService {
  static async getAllTodos(userId: number): Promise<Todo[]> {
    return await TodoModel.findAllByUserId(userId);
  }

  static async createTodo(userId: number, task: string): Promise<Todo> {
    if (!task || task.trim() === '') {
      throw new Error('Task cannot be empty');
    }
    return await TodoModel.create(userId, task);
  }

  static async updateTodo(
    id: number,
    userId: number,
    task: string | undefined,
    completed: number | undefined
  ): Promise<SuccessResponse> {
    const result = await TodoModel.update(id, userId, task, completed);
    
    if (result.changes === 0) {
      throw new Error('Todo not found or unauthorized');
    }
    
    return { success: true, message: 'Todo updated' };
  }

  static async deleteTodo(id: number, userId: number): Promise<SuccessResponse> {
    const result = await TodoModel.delete(id, userId);
    
    if (result.changes === 0) {
      throw new Error('Todo not found or unauthorized');
    }
    
    return { success: true, message: 'Todo deleted' };
  }
}

export default TodoService;
