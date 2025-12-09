import { useState } from 'react';
import axios from 'axios';
import { 
  Paper, Typography, TextField, Button, Box, Alert, Link 
} from '@mui/material';

function Auth({ setToken, apiUrl }) {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const endpoint = isLogin ? '/login' : '/register';

    try {
      const response = await axios.post(`${apiUrl}${endpoint}`, { username, password });
      
      if (isLogin) {
        setToken(response.data.token);
      } else {
        setIsLogin(true);
        setError('Registration successful! Please login.'); // Using error state for success msg temporarily
      }
    } catch (err) {
      setError(err.response?.data?.error || 'An error occurred');
    }
  };

  return (
    <Paper elevation={3} sx={{ p: 4, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <Typography component="h1" variant="h5" gutterBottom>
        {isLogin ? 'Sign in' : 'Sign up'}
      </Typography>

      {error && (
        <Alert severity={error.includes('successful') ? 'success' : 'error'} sx={{ width: '100%', mb: 2 }}>
          {error}
        </Alert>
      )}

      <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1, width: '100%' }}>
        <TextField
          margin="normal"
          required
          fullWidth
          label="Username"
          autoFocus
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <TextField
          margin="normal"
          required
          fullWidth
          label="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Button
          type="submit"
          fullWidth
          variant="contained"
          sx={{ mt: 3, mb: 2 }}
        >
          {isLogin ? 'Sign In' : 'Sign Up'}
        </Button>
        <Box textAlign="center">
          <Link 
            component="button"
            variant="body2"
            type="button"
            onClick={() => { setIsLogin(!isLogin); setError(''); }}
          >
            {isLogin ? "Don't have an account? Sign Up" : "Already have an account? Sign In"}
          </Link>
        </Box>
      </Box>
    </Paper>
  );
}

export default Auth;