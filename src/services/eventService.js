import axios from 'axios';

const API_URL = 'http://localhost:4000/api';

// Get all events
export const getAllEvents = async () => {
  const response = await axios.get(`${API_URL}/events`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
  });
  return response.data;
};

// Get event by ID
export const getEventById = async (id) => {
  const response = await axios.get(`${API_URL}/events/${id}`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
  });
  return response.data;
};

// Create new event
export const createEvent = async (eventData) => {
  const response = await axios.post(`${API_URL}/events`, eventData, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
      'Content-Type': 'application/json',
    },
  });
  return response.data;
};

// Update event
export const updateEvent = async (id, eventData) => {
  const response = await axios.put(`${API_URL}/events/${id}`, eventData, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
      'Content-Type': 'application/json',
    },
  });
  return response.data;
};

// Delete event
export const deleteEvent = async (id) => {
  const response = await axios.delete(`${API_URL}/events/${id}`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
  });
  return response.data;
};

// Register for event
export const registerForEvent = async (id) => {
  const response = await axios.post(`${API_URL}/events/${id}/register`, {}, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
      'Content-Type': 'application/json',
    },
  });
  return response.data;
};

// Unregister from event
export const unregisterFromEvent = async (id) => {
  const response = await axios.post(`${API_URL}/events/${id}/unregister`, {}, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
      'Content-Type': 'application/json',
    },
  });
  return response.data;
};
