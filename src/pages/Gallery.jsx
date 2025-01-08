import React, { useState } from 'react';
import {
  Container,
  Grid,
  Card,
  CardMedia,
  CardContent,
  Typography,
  Box,
  Modal,
  IconButton,
} from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';

const galleryItems = [
  {
    id: 1,
    image: 'https://source.unsplash.com/random/800x600/?school,students',
    title: 'Science Fair 2024',
    description: 'Students showcasing their innovative projects at the annual science fair.',
    category: 'Academic',
  },
  {
    id: 2,
    image: 'https://source.unsplash.com/random/800x600/?graduation',
    title: 'Graduation Ceremony',
    description: 'Celebrating the achievements of our graduating class of 2024.',
    category: 'Events',
  },
  {
    id: 3,
    image: 'https://source.unsplash.com/random/800x600/?sports,field',
    title: 'Sports Day',
    description: 'Annual sports day featuring various athletic competitions and team sports.',
    category: 'Sports',
  },
  {
    id: 4,
    image: 'https://source.unsplash.com/random/800x600/?library',
    title: 'Modern Library',
    description: 'Our state-of-the-art library featuring digital resources and study areas.',
    category: 'Facilities',
  },
  {
    id: 5,
    image: 'https://source.unsplash.com/random/800x600/?laboratory',
    title: 'Science Lab',
    description: 'Advanced laboratory facilities for practical learning and experiments.',
    category: 'Facilities',
  },
  {
    id: 6,
    image: 'https://source.unsplash.com/random/800x600/?concert',
    title: 'Annual Concert',
    description: 'Students performing at the annual cultural concert.',
    category: 'Cultural',
  },
];

const Gallery = () => {
  const [selectedImage, setSelectedImage] = useState(null);

  const handleOpen = (image) => {
    setSelectedImage(image);
  };

  const handleClose = () => {
    setSelectedImage(null);
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 8 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          School Gallery
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          Capturing moments and memories at Triton Academy
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {galleryItems.map((item) => (
          <Grid item xs={12} sm={6} md={4} key={item.id}>
            <Card 
              sx={{ 
                height: '100%', 
                cursor: 'pointer',
                transition: 'transform 0.2s',
                '&:hover': {
                  transform: 'scale(1.02)',
                }
              }}
              onClick={() => handleOpen(item)}
            >
              <CardMedia
                component="img"
                height="260"
                image={item.image}
                alt={item.title}
                sx={{ objectFit: 'cover' }}
              />
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {item.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {item.description}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Modal
        open={Boolean(selectedImage)}
        onClose={handleClose}
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Box sx={{ 
          position: 'relative',
          maxWidth: '90vw',
          maxHeight: '90vh',
          bgcolor: 'background.paper',
          borderRadius: 1,
          boxShadow: 24,
          p: 2,
        }}>
          <IconButton
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
              color: 'white',
              bgcolor: 'rgba(0,0,0,0.5)',
              '&:hover': {
                bgcolor: 'rgba(0,0,0,0.7)',
              },
            }}
            onClick={handleClose}
          >
            <CloseIcon />
          </IconButton>
          {selectedImage && (
            <>
              <img
                src={selectedImage.image}
                alt={selectedImage.title}
                style={{
                  maxWidth: '100%',
                  maxHeight: 'calc(90vh - 200px)',
                  objectFit: 'contain',
                }}
              />
              <Box sx={{ mt: 2 }}>
                <Typography variant="h6">{selectedImage.title}</Typography>
                <Typography variant="body2" color="text.secondary">
                  {selectedImage.description}
                </Typography>
              </Box>
            </>
          )}
        </Box>
      </Modal>
    </Container>
  );
};

export default Gallery;
