import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Typography,
  Fab,
  Snackbar,
  Alert,
} from '@mui/material';
import { Feedback as FeedbackIcon } from '@mui/icons-material';

const SuggestionBox = () => {
  const [open, setOpen] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [formData, setFormData] = useState({
    category: '',
    subject: '',
    message: '',
    name: '',
    email: '',
  });

  const categories = [
    'Academic Programs',
    'Facilities',
    'Student Services',
    'Teaching Methods',
    'Extra-curricular Activities',
    'Safety & Security',
    'Other',
  ];

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you would typically send the data to your backend
    console.log('Suggestion submitted:', formData);
    setSnackbarOpen(true);
    handleClose();
    setFormData({
      category: '',
      subject: '',
      message: '',
      name: '',
      email: '',
    });
  };

  return (
    <>
      <Fab
        color="primary"
        aria-label="suggestion"
        sx={{
          position: 'fixed',
          bottom: 20,
          right: 20,
          zIndex: 1000,
        }}
        onClick={handleOpen}
      >
        <FeedbackIcon />
      </Fab>

      <Dialog
        open={open}
        onClose={handleClose}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <FeedbackIcon color="primary" />
            <Typography variant="h6">
              Share Your Suggestions
            </Typography>
          </Box>
        </DialogTitle>
        
        <DialogContent>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            We value your feedback! Please share your suggestions, ideas, or concerns to help us improve.
          </Typography>
          
          <Box component="form" sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <FormControl fullWidth required>
              <InputLabel>Category</InputLabel>
              <Select
                name="category"
                value={formData.category}
                onChange={handleChange}
                label="Category"
              >
                {categories.map((category) => (
                  <MenuItem key={category} value={category}>
                    {category}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <TextField
              required
              fullWidth
              label="Subject"
              name="subject"
              value={formData.subject}
              onChange={handleChange}
            />

            <TextField
              required
              fullWidth
              multiline
              rows={4}
              label="Your Suggestion"
              name="message"
              value={formData.message}
              onChange={handleChange}
            />

            <TextField
              fullWidth
              label="Your Name (Optional)"
              name="name"
              value={formData.name}
              onChange={handleChange}
            />

            <TextField
              fullWidth
              type="email"
              label="Your Email (Optional)"
              name="email"
              value={formData.email}
              onChange={handleChange}
              helperText="We'll only use this to follow up if needed"
            />
          </Box>
        </DialogContent>

        <DialogActions sx={{ p: 3 }}>
          <Button onClick={handleClose}>Cancel</Button>
          <Button
            variant="contained"
            onClick={handleSubmit}
            disabled={!formData.category || !formData.subject || !formData.message}
          >
            Submit Suggestion
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={() => setSnackbarOpen(false)}
          severity="success"
          variant="filled"
          sx={{ width: '100%' }}
        >
          Thank you for your suggestion! We'll review it carefully.
        </Alert>
      </Snackbar>
    </>
  );
};

export default SuggestionBox;
