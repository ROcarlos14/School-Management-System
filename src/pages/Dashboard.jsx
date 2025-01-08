import React from 'react';
import { Box, Typography, Grid } from '@mui/material';

const Dashboard = () => {
  return (
    <Box sx={{ width: '100%', m: 0, p: 0, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      {/* Hero Section */}
      <Box
        sx={{
          width: '100%',
          height: '400px',
          bgcolor: 'primary.dark',
          color: 'white',
          display: 'flex',
          alignItems: 'center',
          position: 'relative',
          overflow: 'hidden',
          m: 0,
          p: 0,
        }}
      >
        <Box
          sx={{
            width: '100%',
            height: '100%',
            position: 'absolute',
            top: 0,
            left: 0,
            backgroundImage: 'url(https://source.unsplash.com/random/1920x1080/?school,education)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            '&::after': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              bgcolor: 'rgba(0,0,0,0.5)',
            },
          }}
        />
        <Box
          sx={{
            position: 'relative',
            zIndex: 1,
            width: '100%',
            maxWidth: '1200px',
            mx: 'auto',
            textAlign: 'center',
          }}
        >
          <Typography variant="h2" component="h1" sx={{ m: 0, mb: 2 }}>
            Welcome to Triton Academy
          </Typography>
          <Typography variant="h5" sx={{ m: 0 }}>
            Empowering Minds, Shaping Futures
          </Typography>
        </Box>
      </Box>

      {/* Stats Section */}
      <Box sx={{ width: '100%', bgcolor: 'primary.main', color: 'white' }}>
        <Grid 
          container 
          sx={{ 
            maxWidth: '1200px',
            width: '100%',
            mx: 'auto',
            m: 0,
            p: 0,
          }}
        >
          <Grid item xs={12} sm={3} sx={{ textAlign: 'center', py: 2 }}>
            <Typography variant="h3" sx={{ m: 0 }}>500+</Typography>
            <Typography sx={{ m: 0 }}>Students</Typography>
          </Grid>
          <Grid item xs={12} sm={3} sx={{ textAlign: 'center', py: 2 }}>
            <Typography variant="h3" sx={{ m: 0 }}>50+</Typography>
            <Typography sx={{ m: 0 }}>Teachers</Typography>
          </Grid>
          <Grid item xs={12} sm={3} sx={{ textAlign: 'center', py: 2 }}>
            <Typography variant="h3" sx={{ m: 0 }}>30+</Typography>
            <Typography sx={{ m: 0 }}>Courses</Typography>
          </Grid>
          <Grid item xs={12} sm={3} sx={{ textAlign: 'center', py: 2 }}>
            <Typography variant="h3" sx={{ m: 0 }}>95%</Typography>
            <Typography sx={{ m: 0 }}>Success Rate</Typography>
          </Grid>
        </Grid>
      </Box>

      {/* Blog Section will be rendered below this */}
    </Box>
  );
};

export default Dashboard;
