import { useState, useEffect } from 'react';
import Auth from './Auth';
import Todos from './Todos';
import { Container, Box } from '@mui/material';

const API_URL = 'http://localhost:3000';

function App() {
  const [token, setToken] = useState(localStorage.getItem('token'));

  useEffect(() => {
    if (token) {
      localStorage.setItem('token', token);
    } else {
      localStorage.removeItem('token');
    }
  }, [token]);

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 8 }}>
        {!token ? (
          <Auth setToken={setToken} apiUrl={API_URL} />
        ) : (
          <Todos token={token} setToken={setToken} apiUrl={API_URL} />
        )}
      </Box>
    </Container>
  );
}

export default App;