import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
} from '@mui/material';

const EventDialog = ({ open, handleClose, handleSubmit, event = null }) => {
  const [formData, setFormData] = useState(
    event || {
      title: '',
      description: '',
      date: '',
      time: '',
      venue: '',
      type: 'academic',
    }
  );

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const onSubmit = (e) => {
    e.preventDefault();
    handleSubmit(formData);
    handleClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>{event ? 'Edit Event' : 'Create New Event'}</DialogTitle>
      <form onSubmit={onSubmit}>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              name="title"
              label="Title"
              value={formData.title}
              onChange={handleChange}
              required
              fullWidth
            />
            <TextField
              name="description"
              label="Description"
              value={formData.description}
              onChange={handleChange}
              required
              fullWidth
              multiline
              rows={4}
            />
            <TextField
              name="date"
              label="Date"
              type="date"
              value={formData.date}
              onChange={handleChange}
              required
              fullWidth
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              name="time"
              label="Time"
              type="time"
              value={formData.time}
              onChange={handleChange}
              required
              fullWidth
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              name="venue"
              label="Venue"
              value={formData.venue}
              onChange={handleChange}
              required
              fullWidth
            />
            <FormControl fullWidth required>
              <InputLabel>Type</InputLabel>
              <Select
                name="type"
                value={formData.type}
                onChange={handleChange}
                label="Type"
              >
                <MenuItem value="academic">Academic</MenuItem>
                <MenuItem value="sports">Sports</MenuItem>
                <MenuItem value="cultural">Cultural</MenuItem>
                <MenuItem value="other">Other</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button type="submit" variant="contained" color="primary">
            {event ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default EventDialog;
