/// <reference path="./types/express.d.ts" />
// src/server.ts
import express from 'express';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs';
import path from 'path';

// Import routes
import authRoutes from './routes/auth.routes';
import todoRoutes from './routes/todo.routes';

const app = express();

app.use(cors());
app.use(express.json());

// --- SWAGGER CONFIGURATION ---
const swaggerDocument = YAML.load(path.join(__dirname, '../swagger.yml'));
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// --- ROUTES ---
app.use('/', authRoutes);
app.use('/todos', todoRoutes);

// Start Server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`Swagger Docs available at http://localhost:${PORT}/api-docs`);
});

