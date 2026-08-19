import { Box, Typography, Card, CardContent, Button, Stack } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';

const WORKOUTS = [
  { name: 'upper body push', date: '2026-08-18', duration: '45 min' },
  { name: 'lower body', date: '2026-08-16', duration: '50 min' },
  { name: 'cardio hiit', date: '2026-08-14', duration: '30 min' },
];

export default function Workouts() {
  return (
    <Box>
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={4}>
        <Typography variant="h3" color="#00ffcc">
          workouts
        </Typography>
        <Button variant="contained" color="primary" startIcon={<AddIcon />}>
          new workout
        </Button>
      </Stack>
      <Stack spacing={2}>
        {WORKOUTS.map((w) => (
          <Card key={w.name}>
            <CardContent>
              <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Box>
                  <Typography variant="h6" color="#f0f0f0">
                    {w.name}
                  </Typography>
                  <Typography variant="body2" color="#a0a0a0" mt={0.5}>
                    {w.date} &middot; {w.duration}
                  </Typography>
                </Box>
                <Button variant="outlined" size="small">
                  view
                </Button>
              </Stack>
            </CardContent>
          </Card>
        ))}
      </Stack>
    </Box>
  );
}