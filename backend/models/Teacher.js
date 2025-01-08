const mongoose = require('mongoose');

const teacherSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  teacherId: {
    type: String,
    required: true,
    unique: true
  },
  qualification: {
    type: String,
    required: true
  },
  specialization: {
    type: String,
    required: true
  },
  experience: {
    type: Number,
    required: true
  },
  subjects: [{
    type: String,
    required: true
  }],
  assignedCourses: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course'
  }],
  schedule: [{
    day: {
      type: String,
      enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
      required: true
    },
    periods: [{
      courseId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course'
      },
      startTime: String,
      endTime: String,
      room: String
    }]
  }],
  contact: {
    phone: String,
    emergencyContact: String,
    address: String
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Teacher', teacherSchema);
