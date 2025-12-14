// src/services/authService.ts
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import UserModel from '../models/User';
import { AuthResponse, RegisterResponse } from '../types';
import { SECRET_KEY } from '../config/auth';

class AuthService {
  static async register(username: string, password: string): Promise<RegisterResponse> {
    const hashedPassword = await bcrypt.hash(password, 10);
    try {
      const user = await UserModel.create(username, hashedPassword);
      return { 
        message: 'User created',
        userId: user.id 
      };
    } catch (error) {
      throw new Error('User already exists');
    }
  }

  static async login(username: string, password: string): Promise<AuthResponse> {
    const user = await UserModel.findByUsername(username);
    
    if (!user) {
      throw new Error('User not found');
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      throw new Error('Invalid password');
    }

    const token = jwt.sign(
      { id: user.id, username: user.username },
      SECRET_KEY,
      { expiresIn: '1h' }
    );

    return { 
      token, 
      user: { id: user.id, username: user.username } 
    };
  }
}

export default AuthService;
