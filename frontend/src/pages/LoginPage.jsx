import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, TextField, Button, Typography } from '@mui/material';

export default function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    sessionStorage.setItem('authed', 'true');
    navigate('/dashboard', { replace: true });
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