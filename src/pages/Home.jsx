import React from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Button,
  Paper,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();

  const features = [
    {
      title: 'Quality Education',
      description: 'Providing world-class education with experienced faculty',
      image: '/images/education.jpg',
    },
    {
      title: 'Modern Facilities',
      description: 'State-of-the-art infrastructure and learning resources',
      image: '/images/facilities.jpg',
    },
    {
      title: 'Student Life',
      description: 'Rich campus life with diverse extracurricular activities',
      image: '/images/student-life.jpg',
    },
  ];

  return (
    <Box sx={{ width: '100%' }}>
      {/* Hero Section */}
      <Box
        sx={{
          bgcolor: 'primary.main',
          color: 'white',
          py: 8,
          mb: 6,
          width: '100%',
        }}
      >
        <Container maxWidth="xl">
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={6}>
              <Typography
                variant="h2"
                component="h1"
                gutterBottom
                sx={{
                  fontWeight: 'bold',
                  fontSize: { xs: '2.5rem', md: '3.5rem' },
                }}
              >
                Welcome to Triton Academy
              </Typography>
              <Typography
                variant="h5"
                sx={{ mb: 4, opacity: 0.9 }}
              >
                Empowering minds, building futures. Join us in our journey of excellence.
              </Typography>
              <Button
                variant="contained"
                color="secondary"
                size="large"
                onClick={() => navigate('/enroll')}
                sx={{ mr: 2 }}
              >
                Enroll Now
              </Button>
              <Button
                variant="outlined"
                color="inherit"
                size="large"
                onClick={() => navigate('/about')}
              >
                Learn More
              </Button>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box
                component="img"
                src="/images/hero-image.jpg"
                alt="Students studying"
                sx={{
                  width: '100%',
                  maxHeight: 400,
                  objectFit: 'cover',
                  borderRadius: 2,
                }}
              />
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Features Section */}
      <Container maxWidth="xl" sx={{ mb: 6 }}>
        <Typography
          variant="h3"
          component="h2"
          align="center"
          gutterBottom
          sx={{ mb: 6 }}
        >
          Why Choose Triton Academy?
        </Typography>
        <Grid container spacing={4}>
          {features.map((feature, index) => (
            <Grid item xs={12} md={4} key={index}>
              <Card sx={{ height: '100%' }}>
                <CardMedia
                  component="img"
                  height="200"
                  image={feature.image}
                  alt={feature.title}
                />
                <CardContent>
                  <Typography variant="h5" component="h3" gutterBottom>
                    {feature.title}
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    {feature.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Stats Section */}
      <Box sx={{ bgcolor: 'background.default', py: 6, mb: 6 }}>
        <Container maxWidth="xl">
          <Grid container spacing={4}>
            <Grid item xs={12} sm={3}>
              <Paper sx={{ p: 3, textAlign: 'center' }}>
                <Typography variant="h3" color="primary" gutterBottom>
                  500+
                </Typography>
                <Typography variant="h6">Students</Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} sm={3}>
              <Paper sx={{ p: 3, textAlign: 'center' }}>
                <Typography variant="h3" color="primary" gutterBottom>
                  50+
                </Typography>
                <Typography variant="h6">Expert Teachers</Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} sm={3}>
              <Paper sx={{ p: 3, textAlign: 'center' }}>
                <Typography variant="h3" color="primary" gutterBottom>
                  20+
                </Typography>
                <Typography variant="h6">Programs</Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} sm={3}>
              <Paper sx={{ p: 3, textAlign: 'center' }}>
                <Typography variant="h3" color="primary" gutterBottom>
                  95%
                </Typography>
                <Typography variant="h6">Success Rate</Typography>
              </Paper>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* CTA Section */}
      <Container maxWidth="xl" sx={{ mb: 6 }}>
        <Paper
          sx={{
            p: 6,
            textAlign: 'center',
            background: 'linear-gradient(45deg, #1565c0 30%, #1a237e 90%)',
            color: 'white',
          }}
        >
          <Typography variant="h4" gutterBottom>
            Ready to Start Your Journey?
          </Typography>
          <Typography variant="h6" sx={{ mb: 4, opacity: 0.9 }}>
            Join Triton Academy and be part of our growing community of learners.
          </Typography>
          <Button
            variant="contained"
            color="secondary"
            size="large"
            onClick={() => navigate('/enroll')}
          >
            Apply Now
          </Button>
        </Paper>
      </Container>
    </Box>
  );
};

export default Home;
