const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const parentSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  children: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  relationship: {
    type: String,
    required: true,
    enum: ['Father', 'Mother', 'Guardian']
  },
  occupation: String,
  workPhone: String,
  emergencyContact: {
    name: String,
    phone: String,
    relationship: String
  },
  address: {
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: String
  },
  notifications: {
    email: {
      type: Boolean,
      default: true
    },
    sms: {
      type: Boolean,
      default: true
    },
    attendance: {
      type: Boolean,
      default: true
    },
    grades: {
      type: Boolean,
      default: true
    },
    events: {
      type: Boolean,
      default: true
    },
    behavior: {
      type: Boolean,
      default: true
    }
  },
  preferredLanguage: {
    type: String,
    default: 'English'
  },
  lastLogin: Date,
  isVerified: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Virtual for full name
parentSchema.virtual('fullName').get(function() {
  return `${this.user.firstName} ${this.user.lastName}`;
});

const Parent = mongoose.model('Parent', parentSchema);

module.exports = Parent;
