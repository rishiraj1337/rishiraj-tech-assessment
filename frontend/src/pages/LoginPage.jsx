import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, TextField, Button, Typography } from '@mui/material';
import api from '../api';

export default function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const AUTH_ENABLED = import.meta.env.VITE_AUTH_ENABLED === 'true';

  const handleLogin = async () => {
    if (!AUTH_ENABLED) {
      sessionStorage.setItem('authed', 'true');
      navigate('/dashboard', { replace: true });
      return;
    }

    try {
      const res = await api.post('/api/auth/login', { email, password });
      sessionStorage.setItem('jwt', res.data.token);
      sessionStorage.setItem('authed', 'true');
      navigate('/dashboard', { replace: true });
    } catch {
      setError('Invalid email or password');
    }
  };

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      minHeight="100vh"
      bgcolor="#0a0a0a"
      px={2}
    >
      <Box
        p={4}
        bgcolor="#121212"
        border="2px solid #000"
        boxShadow="8px 8px 0px #000"
        maxWidth={400}
        width="100%"
      >
        <Typography variant="h4" fontWeight={700} mb={1} color="#00ffcc">
          fitness tracker
        </Typography>
        <Typography variant="body2" color="#a0a0a0" mb={3}>
          sign in to continue
        </Typography>
        {error && (
          <Typography color="#ff0080" mb={2} variant="body2">
            {error}
          </Typography>
        )}
        <TextField
          fullWidth
          label="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          sx={{ mb: 2 }}
        />
        <TextField
          fullWidth
          label="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          sx={{ mb: 3 }}
        />
        <Button
          fullWidth
          variant="contained"
          color="primary"
          onClick={handleLogin}
          size="large"
        >
          sign in
        </Button>
      </Box>
    </Box>
  );
}