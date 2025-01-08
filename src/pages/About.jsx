import React from 'react';
import {
  Container,
  Grid,
  Typography,
  Box,
  Card,
  CardContent,
  Avatar,
  Paper,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import {
  School,
  EmojiEvents,
  Groups,
  Timeline,
  CheckCircle,
  Star,
} from '@mui/icons-material';

const About = () => {
  const achievements = [
    "Ranked #1 in Regional Academic Excellence",
    "100% College Acceptance Rate",
    "National STEM Competition Winners",
    "State Champions in Debate",
    "Award-winning Arts Program",
  ];

  const values = [
    {
      title: "Excellence",
      description: "Striving for the highest standards in academic and personal achievement",
      icon: <Star color="primary" />,
    },
    {
      title: "Innovation",
      description: "Embracing new ideas and technologies in education",
      icon: <Timeline color="primary" />,
    },
    {
      title: "Community",
      description: "Fostering a supportive and inclusive learning environment",
      icon: <Groups color="primary" />,
    },
  ];

  const leadership = [
    {
      name: "Dr. Sarah Johnson",
      position: "Principal",
      image: "https://source.unsplash.com/random/150x150/?woman,professional",
      bio: "Ph.D. in Education Leadership with 20 years of experience in academic excellence.",
    },
    {
      name: "Prof. Michael Chen",
      position: "Vice Principal",
      image: "https://source.unsplash.com/random/150x150/?man,professional",
      bio: "Former University Professor with expertise in curriculum development.",
    },
    {
      name: "Ms. Emily Rodriguez",
      position: "Head of Student Affairs",
      image: "https://source.unsplash.com/random/150x150/?woman,teacher",
      bio: "Dedicated to student welfare and development for over 15 years.",
    },
  ];

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 8 }}>
      {/* Hero Section */}
      <Box sx={{ textAlign: 'center', mb: 6 }}>
        <Typography variant="h3" gutterBottom>
          About Triton Academy
        </Typography>
        <Typography variant="h6" color="text.secondary" sx={{ mb: 4 }}>
          Empowering Minds, Shaping Futures
        </Typography>
      </Box>

      {/* Mission and Vision */}
      <Grid container spacing={4} sx={{ mb: 6 }}>
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 4, height: '100%' }}>
            <School color="primary" sx={{ fontSize: 40, mb: 2 }} />
            <Typography variant="h5" gutterBottom>
              Our Mission
            </Typography>
            <Typography variant="body1">
              To provide exceptional education that nurtures intellectual curiosity,
              fosters personal growth, and develops future leaders who will make positive
              contributions to society.
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 4, height: '100%' }}>
            <EmojiEvents color="primary" sx={{ fontSize: 40, mb: 2 }} />
            <Typography variant="h5" gutterBottom>
              Our Vision
            </Typography>
            <Typography variant="body1">
              To be a leading educational institution that sets the standard for academic
              excellence, innovation, and character development, preparing students for
              success in an ever-changing global society.
            </Typography>
          </Paper>
        </Grid>
      </Grid>

      {/* Core Values */}
      <Typography variant="h4" gutterBottom sx={{ mb: 4 }}>
        Our Core Values
      </Typography>
      <Grid container spacing={3} sx={{ mb: 6 }}>
        {values.map((value) => (
          <Grid item xs={12} md={4} key={value.title}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  {value.icon}
                  <Typography variant="h6" sx={{ ml: 1 }}>
                    {value.title}
                  </Typography>
                </Box>
                <Typography variant="body2" color="text.secondary">
                  {value.description}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Achievements */}
      <Paper elevation={3} sx={{ p: 4, mb: 6 }}>
        <Typography variant="h5" gutterBottom>
          Our Achievements
        </Typography>
        <List>
          {achievements.map((achievement, index) => (
            <ListItem key={index}>
              <ListItemIcon>
                <CheckCircle color="primary" />
              </ListItemIcon>
              <ListItemText primary={achievement} />
            </ListItem>
          ))}
        </List>
      </Paper>

      {/* Leadership */}
      <Typography variant="h4" gutterBottom sx={{ mb: 4 }}>
        School Leadership
      </Typography>
      <Grid container spacing={4}>
        {leadership.map((leader) => (
          <Grid item xs={12} md={4} key={leader.name}>
            <Card sx={{ height: '100%' }}>
              <CardContent sx={{ textAlign: 'center' }}>
                <Avatar
                  src={leader.image}
                  sx={{ width: 120, height: 120, mx: 'auto', mb: 2 }}
                />
                <Typography variant="h6" gutterBottom>
                  {leader.name}
                </Typography>
                <Typography variant="subtitle1" color="primary" gutterBottom>
                  {leader.position}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {leader.bio}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default About;
