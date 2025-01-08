import React from 'react';
import { Box, Container, Grid, Typography, Link, IconButton } from '@mui/material';
import {
  Facebook,
  Twitter,
  Instagram,
  LinkedIn,
} from '@mui/icons-material';

const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        bgcolor: 'primary.dark',
        color: 'white',
        py: 6,
        width: '100%',
      }}
    >
      <Container maxWidth="xl">
        <Grid container spacing={4}>
          <Grid item xs={12} sm={4}>
            <Typography variant="h6" gutterBottom>
              Triton Academy
            </Typography>
            <Typography variant="body2">
              Empowering minds, building futures. Our commitment to excellence in education
              shapes tomorrow's leaders.
            </Typography>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Typography variant="h6" gutterBottom>
              Quick Links
            </Typography>
            <Typography variant="body2" component="div">
              <Link href="/about" color="inherit" display="block" sx={{ mb: 1 }}>
                About Us
              </Link>
              <Link href="/events" color="inherit" display="block" sx={{ mb: 1 }}>
                Events
              </Link>
              <Link href="/gallery" color="inherit" display="block" sx={{ mb: 1 }}>
                Gallery
              </Link>
              <Link href="/teachers" color="inherit" display="block">
                Teachers & Staff
              </Link>
            </Typography>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Typography variant="h6" gutterBottom>
              Connect With Us
            </Typography>
            <Box>
              <IconButton color="inherit" aria-label="Facebook">
                <Facebook />
              </IconButton>
              <IconButton color="inherit" aria-label="Twitter">
                <Twitter />
              </IconButton>
              <IconButton color="inherit" aria-label="Instagram">
                <Instagram />
              </IconButton>
              <IconButton color="inherit" aria-label="LinkedIn">
                <LinkedIn />
              </IconButton>
            </Box>
            <Typography variant="body2" sx={{ mt: 2 }}>
              Contact: +1 234 567 8900
              <br />
              Email: info@tritonacademy.edu
            </Typography>
          </Grid>
        </Grid>
        <Typography
          variant="body2"
          align="center"
          sx={{ mt: 4, borderTop: '1px solid rgba(255, 255, 255, 0.1)', pt: 2 }}
        >
          {new Date().getFullYear()} Triton Academy. All rights reserved.
        </Typography>
      </Container>
    </Box>
  );
};

export default Footer;
