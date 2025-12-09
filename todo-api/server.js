// server.js
const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const swaggerUi = require('swagger-ui-express');
const swaggerJsDoc = require('swagger-jsdoc');
const db = require('./database');
const { authenticateToken, SECRET_KEY } = require('./authMiddleware');

const app = express();

app.use(cors());
app.use(express.json());

// --- SWAGGER CONFIGURATION ---
const swaggerOptions = {
    swaggerDefinition: {
        openapi: '3.0.0',
        info: {
            title: 'User-Based To-Do API',
            version: '1.0.0',
            description: 'Simple API to manage tasks with JWT Authentication',
        },
        servers: [{ url: 'http://localhost:3000' }],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                },
            },
        },
        security: [{ bearerAuth: [] }],
    },
    apis: ['./server.js'], // Files containing annotations
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// --- ROUTES ---

/**
 * @swagger
 * /register:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       201:
 *         description: User created
 */
app.post('/register', async (req, res) => {
    const { username, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    db.run(`INSERT INTO users (username, password) VALUES (?, ?)`, [username, hashedPassword], function(err) {
        if (err) return res.status(400).json({ error: 'User already exists' });
        res.status(201).json({ message: 'User created', userId: this.lastID });
    });
});

/**
 * @swagger
 * /login:
 *   post:
 *     summary: Login to get a JWT token
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login successful
 */
app.post('/login', (req, res) => {
    const { username, password } = req.body;

    db.get(`SELECT * FROM users WHERE username = ?`, [username], async (err, user) => {
        if (err || !user) return res.status(400).json({ error: 'User not found' });

        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) return res.status(403).json({ error: 'Invalid password' });

        const token = jwt.sign({ id: user.id, username: user.username }, SECRET_KEY, { expiresIn: '1h' });
        res.json({ token });
    });
});

/**
 * @swagger
 * /todos:
 *   get:
 *     summary: Get all todos for the logged-in user
 *     tags: [Todos]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of todos
 */
app.get('/todos', authenticateToken, (req, res) => {
    db.all(`SELECT * FROM todos WHERE userId = ?`, [req.user.id], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

/**
 * @swagger
 * /todos:
 *   post:
 *     summary: Create a new todo
 *     tags: [Todos]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               task:
 *                 type: string
 *     responses:
 *       201:
 *         description: Todo created
 */
app.post('/todos', authenticateToken, (req, res) => {
    const { task } = req.body;
    db.run(`INSERT INTO todos (userId, task) VALUES (?, ?)`, [req.user.id, task], function(err) {
        if (err) return res.status(500).json({ error: err.message });
        res.status(201).json({ id: this.lastID, task, completed: 0 });
    });
});

/**
 * @swagger
 * /todos/{id}:
 *   put:
 *     summary: Update a todo (mark complete/incomplete)
 *     tags: [Todos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               completed:
 *                 type: integer
 *               task:
 *                 type: string
 *     responses:
 *       200:
 *         description: Todo updated
 */
app.put('/todos/:id', authenticateToken, (req, res) => {
    const { task, completed } = req.body;
    const { id } = req.params;
    
    // We check userId ensures users can only update their own todos
    db.run(
        `UPDATE todos SET task = COALESCE(?, task), completed = COALESCE(?, completed) WHERE id = ? AND userId = ?`,
        [task, completed, id, req.user.id],
        function(err) {
            if (err) return res.status(500).json({ error: err.message });
            if (this.changes === 0) return res.status(404).json({ error: 'Todo not found or unauthorized' });
            res.json({ message: 'Todo updated' });
        }
    );
});

/**
 * @swagger
 * /todos/{id}:
 *   delete:
 *     summary: Delete a todo
 *     tags: [Todos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Todo deleted
 */
app.delete('/todos/:id', authenticateToken, (req, res) => {
    db.run(`DELETE FROM todos WHERE id = ? AND userId = ?`, [req.params.id, req.user.id], function(err) {
        if (err) return res.status(500).json({ error: err.message });
        if (this.changes === 0) return res.status(404).json({ error: 'Todo not found or unauthorized' });
        res.json({ message: 'Todo deleted' });
    });
});

// Start Server
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
    console.log(`Swagger Docs available at http://localhost:${PORT}/api-docs`);
});