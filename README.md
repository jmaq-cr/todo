# Todo Application

A full-stack todo application with JWT authentication, built with Express.js and React.

## Project Structure

- **todo-api** - Backend REST API built with Express.js
- **todo-web** - Frontend React application built with Vite

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn

## Getting Started

### Backend (todo-api)

1. Navigate to the API directory:
   ```bash
   cd todo-api
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```

   The API will run on `http://localhost:3000`

4. Access the API documentation:
   - Swagger UI: `http://localhost:3000/api-docs`

### Frontend (todo-web)

1. Navigate to the web directory:
   ```bash
   cd todo-web
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

   The application will run on `http://localhost:5173` (or another port if 5173 is in use)

4. Build for production:
   ```bash
   npm run build
   ```

5. Preview production build:
   ```bash
   npm run preview
   ```

## Features

- User registration and authentication with JWT
- Create, read, update, and delete todos
- Mark todos as complete/incomplete
- Material-UI based responsive interface
- SQLite database for data persistence

## Technology Stack

### Backend
- Express.js
- SQLite3
- JWT (jsonwebtoken)
- bcryptjs
- Swagger (API documentation)

### Frontend
- React 19
- Vite
- Material-UI
- Axios
- React Hooks

## License

MIT License

Copyright (c) 2025

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
