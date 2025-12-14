// src/controllers/authController.ts
import { Request, Response } from 'express';
import AuthService from '../services/authService';

class AuthController {
  static async register(req: Request, res: Response): Promise<void> {
    try {
      const { username, password } = req.body;
      
      if (!username || !password) {
        res.status(400).json({ error: 'Username and password are required' });
        return;
      }

      const result = await AuthService.register(username, password);
      res.status(201).json(result);
    } catch (error) {
      res.status(400).json({ error: (error as Error).message });
    }
  }

  static async login(req: Request, res: Response): Promise<void> {
    try {
      const { username, password } = req.body;
      
      if (!username || !password) {
        res.status(400).json({ error: 'Username and password are required' });
        return;
      }

      const result = await AuthService.login(username, password);
      res.json({ token: result.token });
    } catch (error) {
      const statusCode = (error as Error).message === 'User not found' ? 400 : 403;
      res.status(statusCode).json({ error: (error as Error).message });
    }
  }
}

export default AuthController;
