import React from 'react';
import {
  Container,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
  Box,
  Chip,
} from '@mui/material';
import { AccessTime as TimeIcon } from '@mui/icons-material';

const blogPosts = [
  {
    id: 1,
    title: 'Annual Science Fair 2025',
    excerpt: 'Students showcase innovative projects at this year\'s science exhibition...',
    image: 'https://source.unsplash.com/random/800x600/?science',
    date: '2025-01-05',
    category: 'Events',
  },
  {
    id: 2,
    title: 'Sports Day Champions',
    excerpt: 'Celebrating the outstanding achievements of our athletes in the inter-school competition...',
    image: 'https://source.unsplash.com/random/800x600/?sports',
    date: '2025-01-03',
    category: 'Sports',
  },
  {
    id: 3,
    title: 'New Library Wing Opening',
    excerpt: 'State-of-the-art library facility now open for students with digital resources...',
    image: 'https://source.unsplash.com/random/800x600/?library',
    date: '2025-01-01',
    category: 'Facilities',
  },
];

const Blog = () => {
  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 8 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          School News & Updates
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          Stay updated with the latest happenings at our school
        </Typography>
      </Box>

      <Grid container spacing={4}>
        {blogPosts.map((post) => (
          <Grid item xs={12} md={4} key={post.id}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <CardMedia
                component="img"
                height="200"
                image={post.image}
                alt={post.title}
                sx={{ objectFit: 'cover' }}
              />
              <CardContent sx={{ flexGrow: 1 }}>
                <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Chip label={post.category} color="primary" size="small" />
                  <Typography variant="caption" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <TimeIcon fontSize="small" />
                    {post.date}
                  </Typography>
                </Box>
                <Typography gutterBottom variant="h5" component="h2">
                  {post.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {post.excerpt}
                </Typography>
              </CardContent>
              <Box sx={{ p: 2, pt: 0 }}>
                <Button size="small" color="primary">
                  Read More
                </Button>
              </Box>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default Blog;
