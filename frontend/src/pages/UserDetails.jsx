import { Box, Typography, Card, CardContent, Stack, Avatar } from '@mui/material';

export default function UserDetails() {
  return (
    <Box>
      <Typography variant="h3" color="#00ffcc" mb={4}>
        profile
      </Typography>
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Stack direction="row" spacing={3} alignItems="center">
            <Avatar
              sx={{
                width: 80,
                height: 80,
                bgcolor: '#ff0080',
                border: '2px solid #000',
                boxShadow: '4px 4px 0px #000',
                fontSize: 32,
                fontWeight: 700,
              }}
            >
              U
            </Avatar>
            <Box>
              <Typography variant="h5" color="#f0f0f0">
                user
              </Typography>
              <Typography variant="body2" color="#a0a0a0">
                user@example.com
              </Typography>
              <Typography variant="body2" color="#a0a0a0" mt={0.5}>
                member since august 2026
              </Typography>
            </Box>
          </Stack>
        </CardContent>
      </Card>
      <Card>
        <CardContent>
          <Typography variant="h5" color="#00ffcc" mb={2}>
            stats
          </Typography>
          <Stack spacing={1.5}>
            <Stack direction="row" justifyContent="space-between">
              <Typography color="#a0a0a0">total workouts</Typography>
              <Typography fontWeight={600} color="#f0f0f0">12</Typography>
            </Stack>
            <Stack direction="row" justifyContent="space-between">
              <Typography color="#a0a0a0">total hours</Typography>
              <Typography fontWeight={600} color="#f0f0f0">8.5</Typography>
            </Stack>
            <Stack direction="row" justifyContent="space-between">
              <Typography color="#a0a0a0">current streak</Typography>
              <Typography fontWeight={600} color="#00ffcc">3 days</Typography>
            </Stack>
            <Stack direction="row" justifyContent="space-between">
              <Typography color="#a0a0a0">longest streak</Typography>
              <Typography fontWeight={600} color="#ff0080">14 days</Typography>
            </Stack>
          </Stack>
        </CardContent>
      </Card>
    </Box>
  );
}