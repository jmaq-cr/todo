// src/models/Todo.ts
import db from '../database';
import { Todo } from '../types';

class TodoModel {
  static findAllByUserId(userId: number): Promise<Todo[]> {
    return new Promise((resolve, reject) => {
      db.all(
        `SELECT * FROM todos WHERE userId = ?`,
        [userId],
        (err: Error | null, rows: Todo[]) => {
          if (err) {
            reject(err);
          } else {
            resolve(rows || []);
          }
        }
      );
    });
  }

  static create(userId: number, task: string): Promise<Todo> {
    return new Promise((resolve, reject) => {
      db.run(
        `INSERT INTO todos (userId, task) VALUES (?, ?)`,
        [userId, task],
        function(this: any, err: Error | null) {
          if (err) {
            reject(err);
          } else {
            resolve({
              id: this.lastID,
              userId,
              task,
              completed: 0
            });
          }
        }
      );
    });
  }

  static update(
    id: number,
    userId: number,
    task: string | undefined,
    completed: number | undefined
  ): Promise<{ changes: number }> {
    return new Promise((resolve, reject) => {
      db.run(
        `UPDATE todos SET task = COALESCE(?, task), completed = COALESCE(?, completed) WHERE id = ? AND userId = ?`,
        [task, completed, id, userId],
        function(this: any, err: Error | null) {
          if (err) {
            reject(err);
          } else {
            resolve({ changes: this.changes });
          }
        }
      );
    });
  }

  static delete(id: number, userId: number): Promise<{ changes: number }> {
    return new Promise((resolve, reject) => {
      db.run(
        `DELETE FROM todos WHERE id = ? AND userId = ?`,
        [id, userId],
        function(this: any, err: Error | null) {
          if (err) {
            reject(err);
          } else {
            resolve({ changes: this.changes });
          }
        }
      );
    });
  }
}

export default TodoModel;
