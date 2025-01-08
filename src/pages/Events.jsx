import React, { useState, useEffect } from 'react';
import {
  Container,
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  Grid,
  Button,
  IconButton,
  Tooltip,
  CircularProgress,
  Alert,
} from '@mui/material';
import {
  Event as EventIcon,
  LocationOn as LocationIcon,
  Groups as GroupsIcon,
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import EventDialog from '../components/EventDialog';
import {
  getAllEvents,
  createEvent,
  updateEvent,
  deleteEvent,
  registerForEvent,
  unregisterFromEvent,
} from '../services/eventService';

const Events = () => {
  const { user } = useAuth();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const response = await getAllEvents();
      setEvents(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch events. Please try again later.');
      console.error('Error fetching events:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleCreateEvent = async (eventData) => {
    try {
      await createEvent(eventData);
      fetchEvents();
    } catch (err) {
      setError('Failed to create event. Please try again.');
      console.error('Error creating event:', err);
    }
  };

  const handleUpdateEvent = async (eventData) => {
    try {
      await updateEvent(selectedEvent._id, eventData);
      fetchEvents();
      setSelectedEvent(null);
    } catch (err) {
      setError('Failed to update event. Please try again.');
      console.error('Error updating event:', err);
    }
  };

  const handleDeleteEvent = async (id) => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      try {
        await deleteEvent(id);
        fetchEvents();
      } catch (err) {
        setError('Failed to delete event. Please try again.');
        console.error('Error deleting event:', err);
      }
    }
  };

  const handleRegisterEvent = async (id, isRegistered) => {
    try {
      if (isRegistered) {
        await unregisterFromEvent(id);
      } else {
        await registerForEvent(id);
      }
      fetchEvents();
    } catch (err) {
      setError('Failed to update registration. Please try again.');
      console.error('Error updating registration:', err);
    }
  };

  const handleOpenDialog = (event = null) => {
    setSelectedEvent(event);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setSelectedEvent(null);
    setOpenDialog(false);
  };

  const isAdmin = user?.role === 'admin';
  const isTeacher = user?.role === 'teacher';
  const canManageEvents = isAdmin || isTeacher;

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 8 }}>
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography variant="h4" gutterBottom>
            Upcoming Events
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            Join us for these exciting school events
          </Typography>
        </Box>
        {canManageEvents && (
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => handleOpenDialog()}
          >
            Create Event
          </Button>
        )}
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Grid container spacing={3}>
        {events.map((event) => {
          const isRegistered = event.participants.some(
            (p) => p._id === user?.id
          );
          const isOrganizer = event.organizer._id === user?.id;

          return (
            <Grid item xs={12} key={event._id}>
              <Card sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' } }}>
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    p: 3,
                    bgcolor: 'primary.main',
                    color: 'primary.contrastText',
                    width: { xs: '100%', md: '200px' },
                  }}
                >
                  <Typography variant="h5" component="div">
                    {new Date(event.date).toLocaleDateString('en-US', { day: 'numeric' })}
                  </Typography>
                  <Typography variant="subtitle1">
                    {new Date(event.date).toLocaleDateString('en-US', { month: 'short' })}
                  </Typography>
                  <Typography variant="body2" sx={{ mt: 1 }}>
                    {event.time}
                  </Typography>
                </Box>

                <CardContent sx={{ flex: 1 }}>
                  <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="h5" component="div">
                      {event.title}
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                      <Chip label={event.type} color="secondary" size="small" />
                      {(isAdmin || isOrganizer) && (
                        <>
                          <Tooltip title="Edit Event">
                            <IconButton
                              size="small"
                              onClick={() => handleOpenDialog(event)}
                            >
                              <EditIcon />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Delete Event">
                            <IconButton
                              size="small"
                              onClick={() => handleDeleteEvent(event._id)}
                            >
                              <DeleteIcon />
                            </IconButton>
                          </Tooltip>
                        </>
                      )}
                    </Box>
                  </Box>

                  <Typography variant="body2" color="text.secondary" paragraph>
                    {event.description}
                  </Typography>

                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, mb: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <LocationIcon color="action" fontSize="small" />
                      <Typography variant="body2" color="text.secondary">
                        {event.venue}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <GroupsIcon color="action" fontSize="small" />
                      <Typography variant="body2" color="text.secondary">
                        {event.participants.length} Registered
                      </Typography>
                    </Box>
                  </Box>

                  <Button
                    variant={isRegistered ? "outlined" : "contained"}
                    startIcon={<EventIcon />}
                    onClick={() => handleRegisterEvent(event._id, isRegistered)}
                  >
                    {isRegistered ? 'Cancel Registration' : 'Register'}
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          );
        })}
      </Grid>

      <EventDialog
        open={openDialog}
        handleClose={handleCloseDialog}
        handleSubmit={selectedEvent ? handleUpdateEvent : handleCreateEvent}
        event={selectedEvent}
      />
    </Container>
  );
};

export default Events;
