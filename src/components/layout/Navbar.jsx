import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Box,
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Avatar,
  Menu,
  MenuItem,
  Tabs,
  Tab,
} from '@mui/material';
import {
  Home,
  School,
  Event,
  Collections,
  Group,
  Info,
  HowToReg,
  AccountCircle,
  Logout,
} from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';

const Navbar = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();

  const menuItems = [
    { text: 'Home', icon: <Home />, path: '/' },
    { text: 'Student Portal', icon: <School />, path: '/portal', requireAuth: true },
    { text: 'Events', icon: <Event />, path: '/events' },
    { text: 'Gallery', icon: <Collections />, path: '/gallery' },
    { text: 'Teachers & Staff', icon: <Group />, path: '/teachers' },
    { text: 'About Us', icon: <Info />, path: '/about' },
  ];

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    handleMenuClose();
    logout();
    navigate('/');
  };

  const currentTabValue = menuItems.findIndex(item => item.path === location.pathname);

  return (
    <AppBar position="fixed" sx={{ bgcolor: 'white', color: 'primary.main' }}>
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        {/* Logo and Brand */}
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Avatar
            src="/logo.svg"
            alt="Triton Academy"
            sx={{ width: 40, height: 40, mr: 1, bgcolor: 'primary.main' }}
          />
          <Typography variant="h6" noWrap component="div" sx={{ display: { xs: 'none', sm: 'block' } }}>
            Triton Academy
          </Typography>
        </Box>

        {/* Navigation Tabs */}
        <Box sx={{ display: { xs: 'none', md: 'block' } }}>
          <Tabs 
            value={currentTabValue === -1 ? false : currentTabValue}
            indicatorColor="primary"
            textColor="primary"
          >
            {menuItems
              .filter(item => !item.requireAuth || (item.requireAuth && user))
              .map((item, index) => (
                <Tab
                  key={item.text}
                  icon={item.icon}
                  label={item.text}
                  onClick={() => navigate(item.path)}
                  sx={{
                    minHeight: 64,
                    '&:hover': {
                      color: 'primary.dark',
                    },
                  }}
                />
              ))}
          </Tabs>
        </Box>

        {/* Auth Buttons */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {!user ? (
            <>
              <Button
                variant="outlined"
                startIcon={<HowToReg />}
                onClick={() => navigate('/enroll')}
                sx={{ display: { xs: 'none', sm: 'flex' } }}
              >
                Enroll Now
              </Button>
              <Button
                variant="contained"
                startIcon={<AccountCircle />}
                onClick={() => navigate('/login')}
              >
                Login
              </Button>
            </>
          ) : (
            <>
              <Typography variant="body1" sx={{ display: { xs: 'none', sm: 'block' } }}>
                {user.name}
              </Typography>
              <IconButton onClick={handleMenuOpen} color="inherit">
                <Avatar sx={{ bgcolor: 'primary.main' }}>
                  {user.name ? user.name[0].toUpperCase() : 'U'}
                </Avatar>
              </IconButton>
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
                onClick={handleMenuClose}
              >
                <MenuItem onClick={() => navigate('/portal')}>
                  <School sx={{ mr: 1 }} /> Dashboard
                </MenuItem>
                <MenuItem onClick={handleLogout}>
                  <Logout sx={{ mr: 1 }} /> Logout
                </MenuItem>
              </Menu>
            </>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
