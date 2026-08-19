import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  Button,
} from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import PersonIcon from '@mui/icons-material/Person';

const NAV_ITEMS = [
  { label: 'dashboard', path: '/dashboard', icon: <DashboardIcon /> },
  { label: 'workouts', path: '/workouts', icon: <FitnessCenterIcon /> },
  { label: 'profile', path: '/user', icon: <PersonIcon /> },
];

const DRAWER_WIDTH = 260;

export default function Layout() {
  const navigate = useNavigate();

  const handleLogout = () => {
    sessionStorage.removeItem('authed');
    navigate('/login', { replace: true });
  };

  return (
    <Box display="flex" minHeight="100vh">
      <Drawer
        variant="permanent"
        sx={{
          width: DRAWER_WIDTH,
          flexShrink: 0,
          '& .MuiDrawer-paper': { width: DRAWER_WIDTH, p: 2 },
        }}
      >
        <Typography variant="h6" fontWeight={700} color="#00ffcc" mb={4} mt={1}>
          fitness tracker
        </Typography>
        <List>
          {NAV_ITEMS.map((item) => (
            <ListItem key={item.path} disablePadding sx={{ mb: 0.5 }}>
              <ListItemButton
                component={NavLink}
                to={item.path}
                sx={{
                  borderRadius: 0,
                  border: '2px solid transparent',
                  '&.active': {
                    border: '2px solid #000',
                    boxShadow: '4px 4px 0px #000',
                    bgcolor: '#00ffcc',
                    color: '#000',
                    '& .MuiListItemIcon-root': { color: '#000' },
                  },
                  '&:hover': { bgcolor: '#1a1a1a' },
                }}
              >
                <ListItemIcon sx={{ minWidth: 40 }}>{item.icon}</ListItemIcon>
                <ListItemText primary={item.label} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
        <Box flex={1} />
        <Button
          variant="outlined"
          color="secondary"
          fullWidth
          onClick={handleLogout}
        >
          sign out
        </Button>
      </Drawer>
      <Box
        component="main"
        flex={1}
        p={4}
        sx={{ ml: `${DRAWER_WIDTH}px` }}
      >
        <Outlet />
      </Box>
    </Box>
  );
}