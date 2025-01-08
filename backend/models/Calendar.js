const mongoose = require('mongoose');

const calendarSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: String,
  type: {
    type: String,
    enum: ['academic', 'exam', 'event', 'holiday', 'custom'],
    required: true
  },
  academicYear: {
    type: String,
    required: true
  },
  term: {
    type: String,
    enum: ['First Term', 'Second Term', 'Final'],
    required: true
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true
  },
  color: {
    type: String,
    default: '#2196f3'
  },
  visibility: {
    type: String,
    enum: ['public', 'private', 'restricted'],
    default: 'public'
  },
  allowedRoles: [{
    type: String,
    enum: ['admin', 'teacher', 'student', 'parent']
  }],
  allowedGrades: [{
    type: String
  }],
  allowedSections: [{
    type: String
  }],
  events: [{
    title: {
      type: String,
      required: true
    },
    description: String,
    startDate: {
      type: Date,
      required: true
    },
    endDate: {
      type: Date,
      required: true
    },
    allDay: {
      type: Boolean,
      default: false
    },
    location: String,
    category: {
      type: String,
      enum: ['class', 'exam', 'assignment', 'meeting', 'activity', 'holiday', 'other']
    },
    priority: {
      type: String,
      enum: ['low', 'normal', 'high', 'urgent'],
      default: 'normal'
    },
    status: {
      type: String,
      enum: ['scheduled', 'cancelled', 'postponed', 'completed'],
      default: 'scheduled'
    },
    recurrence: {
      type: {
        type: String,
        enum: ['none', 'daily', 'weekly', 'monthly', 'yearly']
      },
      interval: Number,
      daysOfWeek: [{
        type: Number,
        min: 0,
        max: 6
      }],
      endDate: Date,
      exceptions: [Date]
    },
    reminders: [{
      type: {
        type: String,
        enum: ['email', 'notification', 'both']
      },
      time: {
        value: Number,
        unit: {
          type: String,
          enum: ['minutes', 'hours', 'days']
        }
      }
    }],
    attachments: [{
      name: String,
      url: String,
      type: String
    }],
    attendees: [{
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      },
      status: {
        type: String,
        enum: ['pending', 'accepted', 'declined', 'tentative'],
        default: 'pending'
      },
      responseDate: Date
    }],
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    lastModifiedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  }],
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  lastModifiedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});

// Indexes for better query performance
calendarSchema.index({ academicYear: 1, term: 1 });
calendarSchema.index({ 'events.startDate': 1, 'events.endDate': 1 });
calendarSchema.index({ type: 1, visibility: 1 });

// Virtual for checking if calendar is active
calendarSchema.virtual('isActive').get(function() {
  const now = new Date();
  return now >= this.startDate && now <= this.endDate;
});

// Method to add event
calendarSchema.methods.addEvent = async function(eventData) {
  this.events.push(eventData);
  await this.save();
  return this.events[this.events.length - 1];
};

// Method to update event
calendarSchema.methods.updateEvent = async function(eventId, eventData) {
  const eventIndex = this.events.findIndex(e => e._id.toString() === eventId.toString());
  if (eventIndex === -1) throw new Error('Event not found');
  
  this.events[eventIndex] = {
    ...this.events[eventIndex].toObject(),
    ...eventData,
    lastModifiedBy: eventData.lastModifiedBy
  };
  
  await this.save();
  return this.events[eventIndex];
};

// Method to delete event
calendarSchema.methods.deleteEvent = async function(eventId) {
  const eventIndex = this.events.findIndex(e => e._id.toString() === eventId.toString());
  if (eventIndex === -1) throw new Error('Event not found');
  
  this.events.splice(eventIndex, 1);
  await this.save();
};

// Method to get upcoming events
calendarSchema.methods.getUpcomingEvents = function(days = 7) {
  const now = new Date();
  const future = new Date(now.getTime() + (days * 24 * 60 * 60 * 1000));
  
  return this.events.filter(event => 
    event.startDate >= now && 
    event.startDate <= future &&
    event.status !== 'cancelled'
  ).sort((a, b) => a.startDate - b.startDate);
};

const Calendar = mongoose.model('Calendar', calendarSchema);

module.exports = Calendar;
