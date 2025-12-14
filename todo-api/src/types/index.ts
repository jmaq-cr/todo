// src/types/index.ts

export interface User {
  id: number;
  username: string;
  password: string;
}

export interface UserCreateInput {
  username: string;
  password: string;
}

export interface UserResponse {
  id: number;
  username: string;
}

export interface Todo {
  id: number;
  userId: number;
  task: string;
  completed: number;
}

export interface TodoCreateInput {
  task: string;
}

export interface TodoUpdateInput {
  task?: string;
  completed?: number;
}

export interface JwtPayload {
  id: number;
  username: string;
}

export interface AuthResponse {
  token: string;
  user?: UserResponse;
}

export interface RegisterResponse {
  message: string;
  userId: number;
}

export interface ErrorResponse {
  error: string;
}

export interface SuccessResponse {
  success: boolean;
  message: string;
}
