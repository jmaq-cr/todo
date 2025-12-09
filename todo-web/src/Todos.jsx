import { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Paper, Typography, TextField, Button, List, ListItem, 
  ListItemText, IconButton, Checkbox, Box, AppBar, Toolbar 
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import LogoutIcon from '@mui/icons-material/Logout';

function Todos({ token, setToken, apiUrl }) {
  const [todos, setTodos] = useState([]);
  const [newTask, setNewTask] = useState('');

  const authAxios = axios.create({
    baseURL: apiUrl,
    headers: { Authorization: `Bearer ${token}` },
  });

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    try {
      const res = await authAxios.get('/todos');
      setTodos(res.data);
    } catch (err) {
      if (err.response && err.response.status === 403) setToken(null);
    }
  };

  const addTodo = async (e) => {
    e.preventDefault();
    if (!newTask.trim()) return;
    try {
      const res = await authAxios.post('/todos', { task: newTask });
      setTodos([...todos, res.data]);
      setNewTask('');
    } catch (err) {
      console.error(err);
    }
  };

  const toggleComplete = async (id, currentStatus) => {
    try {
      await authAxios.put(`/todos/${id}`, { completed: currentStatus ? 0 : 1 });
      setTodos(todos.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
    } catch (err) {
      console.error(err);
    }
  };

  const deleteTodo = async (id) => {
    try {
      await authAxios.delete(`/todos/${id}`);
      setTodos(todos.filter(t => t.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Paper elevation={3} sx={{ overflow: 'hidden' }}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            My Tasks
          </Typography>
          <Button color="inherit" startIcon={<LogoutIcon />} onClick={() => setToken(null)}>
            Logout
          </Button>
        </Toolbar>
      </AppBar>

      <Box sx={{ p: 2 }}>
        <form onSubmit={addTodo} style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
          <TextField
            fullWidth
            size="small"
            label="New Task"
            variant="outlined"
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
          />
          <Button type="submit" variant="contained" color="primary">
            Add
          </Button>
        </form>

        <List>
          {todos.map((todo) => (
            <ListItem
              key={todo.id}
              secondaryAction={
                <IconButton edge="end" aria-label="delete" onClick={() => deleteTodo(todo.id)}>
                  <DeleteIcon color="error" />
                </IconButton>
              }
              disablePadding
            >
              <Checkbox
                edge="start"
                checked={!!todo.completed}
                onChange={() => toggleComplete(todo.id, todo.completed)}
                tabIndex={-1}
                disableRipple
              />
              <ListItemText 
                primary={todo.task} 
                sx={{ 
                  textDecoration: todo.completed ? 'line-through' : 'none',
                  color: todo.completed ? 'text.disabled' : 'text.primary'
                }} 
              />
            </ListItem>
          ))}
          {todos.length === 0 && (
            <Typography variant="body2" color="text.secondary" align="center" sx={{ mt: 2 }}>
              No tasks yet.
            </Typography>
          )}
        </List>
      </Box>
    </Paper>
  );
}

export default Todos;