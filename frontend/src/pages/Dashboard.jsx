import { Box, Typography, Card, CardContent, Grid } from '@mui/material';

const STATS = [
  { label: 'workouts this week', value: '5' },
  { label: 'total minutes', value: '248' },
  { label: 'calories burned', value: '1,420' },
  { label: 'avg heart rate', value: '138 bpm' },
];

export default function Dashboard() {
  return (
    <Box>
      <Typography variant="h3" color="#00ffcc" mb={4}>
        dashboard
      </Typography>
      <Grid container spacing={3}>
        {STATS.map((stat) => (
          <Grid item xs={12} sm={6} md={3} key={stat.label}>
            <Card>
              <CardContent>
                <Typography variant="h4" color="#ff0080" fontWeight={700}>
                  {stat.value}
                </Typography>
                <Typography variant="body2" color="#a0a0a0" mt={1}>
                  {stat.label}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
      <Card sx={{ mt: 4 }}>
        <CardContent>
          <Typography variant="h5" color="#00ffcc" mb={2}>
            recent activity
          </Typography>
          <Typography variant="body2" color="#a0a0a0">
            no recent workouts logged. start your first session to see activity here.
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
}