const Calendar = require('../models/Calendar');
const Notification = require('../models/Notification');
const { validationResult } = require('express-validator');

// Create academic calendar
exports.createCalendar = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const calendar = new Calendar({
      ...req.body,
      createdBy: req.user.id,
      lastModifiedBy: req.user.id
    });

    await calendar.save();
    res.status(201).json(calendar);
  } catch (error) {
    res.status(500).json({ message: 'Error creating calendar', error: error.message });
  }
};

// Get calendars
exports.getCalendars = async (req, res) => {
  try {
    const query = {};
    
    // Filter by academic year and term if provided
    if (req.query.academicYear) query.academicYear = req.query.academicYear;
    if (req.query.term) query.term = req.query.term;
    
    // Filter by type if provided
    if (req.query.type) query.type = req.query.type;

    // Handle visibility and access control
    if (req.user.role !== 'admin') {
      query.$or = [
        { visibility: 'public' },
        {
          visibility: 'restricted',
          $or: [
            { allowedRoles: req.user.role },
            { allowedGrades: req.user.grade },
            { allowedSections: req.user.section }
          ]
        }
      ];
    }

    const calendars = await Calendar.find(query)
      .populate('createdBy', 'firstName lastName')
      .sort({ startDate: 1 });

    res.json(calendars);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching calendars', error: error.message });
  }
};

// Get calendar by ID
exports.getCalendar = async (req, res) => {
  try {
    const calendar = await Calendar.findById(req.params.calendarId)
      .populate('createdBy', 'firstName lastName')
      .populate('events.createdBy', 'firstName lastName')
      .populate('events.attendees.user', 'firstName lastName role');

    if (!calendar) {
      return res.status(404).json({ message: 'Calendar not found' });
    }

    // Check access rights
    if (calendar.visibility === 'restricted' && req.user.role !== 'admin') {
      const hasAccess = calendar.allowedRoles.includes(req.user.role) ||
                       calendar.allowedGrades.includes(req.user.grade) ||
                       calendar.allowedSections.includes(req.user.section);
      
      if (!hasAccess) {
        return res.status(403).json({ message: 'Access denied' });
      }
    }

    res.json(calendar);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching calendar', error: error.message });
  }
};

// Update calendar
exports.updateCalendar = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const calendar = await Calendar.findById(req.params.calendarId);
    
    if (!calendar) {
      return res.status(404).json({ message: 'Calendar not found' });
    }

    // Only admin or creator can update calendar
    if (req.user.role !== 'admin' && calendar.createdBy.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to update calendar' });
    }

    Object.assign(calendar, req.body, { lastModifiedBy: req.user.id });
    await calendar.save();

    res.json(calendar);
  } catch (error) {
    res.status(500).json({ message: 'Error updating calendar', error: error.message });
  }
};

// Delete calendar
exports.deleteCalendar = async (req, res) => {
  try {
    const calendar = await Calendar.findById(req.params.calendarId);
    
    if (!calendar) {
      return res.status(404).json({ message: 'Calendar not found' });
    }

    // Only admin or creator can delete calendar
    if (req.user.role !== 'admin' && calendar.createdBy.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to delete calendar' });
    }

    await calendar.remove();
    res.json({ message: 'Calendar deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting calendar', error: error.message });
  }
};

// Add event to calendar
exports.addEvent = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const calendar = await Calendar.findById(req.params.calendarId);
    
    if (!calendar) {
      return res.status(404).json({ message: 'Calendar not found' });
    }

    const eventData = {
      ...req.body,
      createdBy: req.user.id,
      lastModifiedBy: req.user.id
    };

    const event = await calendar.addEvent(eventData);

    // Create notifications for attendees
    if (event.attendees && event.attendees.length > 0) {
      const notifications = event.attendees.map(attendee => ({
        recipient: attendee.user,
        title: 'New Calendar Event',
        message: `You have been invited to: ${event.title}`,
        type: 'event',
        priority: event.priority,
        link: `/calendar/${calendar._id}/event/${event._id}`,
        metadata: {
          calendarId: calendar._id,
          eventId: event._id,
          type: 'invitation'
        }
      }));

      await Notification.insertMany(notifications);
    }

    res.status(201).json(event);
  } catch (error) {
    res.status(500).json({ message: 'Error adding event', error: error.message });
  }
};

// Update event
exports.updateEvent = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const calendar = await Calendar.findById(req.params.calendarId);
    
    if (!calendar) {
      return res.status(404).json({ message: 'Calendar not found' });
    }

    const event = calendar.events.id(req.params.eventId);
    
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    // Only admin, calendar creator, or event creator can update event
    if (req.user.role !== 'admin' && 
        calendar.createdBy.toString() !== req.user.id &&
        event.createdBy.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to update event' });
    }

    const eventData = {
      ...req.body,
      lastModifiedBy: req.user.id
    };

    const updatedEvent = await calendar.updateEvent(req.params.eventId, eventData);

    // Notify attendees about event update
    if (updatedEvent.attendees && updatedEvent.attendees.length > 0) {
      const notifications = updatedEvent.attendees.map(attendee => ({
        recipient: attendee.user,
        title: 'Event Updated',
        message: `The event "${updatedEvent.title}" has been updated`,
        type: 'event',
        priority: 'normal',
        link: `/calendar/${calendar._id}/event/${updatedEvent._id}`,
        metadata: {
          calendarId: calendar._id,
          eventId: updatedEvent._id,
          type: 'update'
        }
      }));

      await Notification.insertMany(notifications);
    }

    res.json(updatedEvent);
  } catch (error) {
    res.status(500).json({ message: 'Error updating event', error: error.message });
  }
};

// Delete event
exports.deleteEvent = async (req, res) => {
  try {
    const calendar = await Calendar.findById(req.params.calendarId);
    
    if (!calendar) {
      return res.status(404).json({ message: 'Calendar not found' });
    }

    const event = calendar.events.id(req.params.eventId);
    
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    // Only admin, calendar creator, or event creator can delete event
    if (req.user.role !== 'admin' && 
        calendar.createdBy.toString() !== req.user.id &&
        event.createdBy.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to delete event' });
    }

    await calendar.deleteEvent(req.params.eventId);

    // Notify attendees about event cancellation
    if (event.attendees && event.attendees.length > 0) {
      const notifications = event.attendees.map(attendee => ({
        recipient: attendee.user,
        title: 'Event Cancelled',
        message: `The event "${event.title}" has been cancelled`,
        type: 'event',
        priority: 'normal',
        metadata: {
          calendarId: calendar._id,
          eventId: event._id,
          type: 'cancellation'
        }
      }));

      await Notification.insertMany(notifications);
    }

    res.json({ message: 'Event deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting event', error: error.message });
  }
};

// Respond to event invitation
exports.respondToEvent = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const calendar = await Calendar.findById(req.params.calendarId);
    
    if (!calendar) {
      return res.status(404).json({ message: 'Calendar not found' });
    }

    const event = calendar.events.id(req.params.eventId);
    
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    const attendee = event.attendees.find(a => a.user.toString() === req.user.id);
    
    if (!attendee) {
      return res.status(404).json({ message: 'You are not invited to this event' });
    }

    attendee.status = req.body.status;
    attendee.responseDate = new Date();
    
    await calendar.save();

    // Notify event creator about response
    await Notification.create({
      recipient: event.createdBy,
      title: 'Event Response',
      message: `${req.user.firstName} ${req.user.lastName} has ${req.body.status} the event "${event.title}"`,
      type: 'event',
      priority: 'normal',
      link: `/calendar/${calendar._id}/event/${event._id}`,
      metadata: {
        calendarId: calendar._id,
        eventId: event._id,
        type: 'response',
        status: req.body.status
      }
    });

    res.json({ message: 'Response recorded successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error responding to event', error: error.message });
  }
};
