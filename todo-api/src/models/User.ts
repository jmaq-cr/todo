// src/models/User.ts
import db from '../database';
import { User } from '../types';

class UserModel {
  static create(username: string, hashedPassword: string): Promise<{ id: number; username: string }> {
    return new Promise((resolve, reject) => {
      db.run(
        `INSERT INTO users (username, password) VALUES (?, ?)`,
        [username, hashedPassword],
        function(this: any, err: Error | null) {
          if (err) {
            reject(err);
          } else {
            resolve({ id: this.lastID, username });
          }
        }
      );
    });
  }

  static findByUsername(username: string): Promise<User | undefined> {
    return new Promise((resolve, reject) => {
      db.get(
        `SELECT * FROM users WHERE username = ?`,
        [username],
        (err: Error | null, row: User | undefined) => {
          if (err) {
            reject(err);
          } else {
            resolve(row);
          }
        }
      );
    });
  }

  static findById(id: number): Promise<User | undefined> {
    return new Promise((resolve, reject) => {
      db.get(
        `SELECT * FROM users WHERE id = ?`,
        [id],
        (err: Error | null, row: User | undefined) => {
          if (err) {
            reject(err);
          } else {
            resolve(row);
          }
        }
      );
    });
  }
}

export default UserModel;
