const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
  courseCode: {
    type: String,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  grade: {
    type: String,
    required: true
  },
  teacher: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Teacher',
    required: true
  },
  students: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student'
  }],
  schedule: [{
    day: {
      type: String,
      enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
      required: true
    },
    startTime: {
      type: String,
      required: true
    },
    endTime: {
      type: String,
      required: true
    },
    room: {
      type: String,
      required: true
    }
  }],
  syllabus: [{
    unit: {
      type: String,
      required: true
    },
    topics: [{
      type: String,
      required: true
    }],
    duration: {
      type: String,
      required: true
    }
  }],
  assessments: [{
    type: {
      type: String,
      enum: ['quiz', 'test', 'exam', 'assignment'],
      required: true
    },
    date: Date,
    totalMarks: Number,
    weightage: Number
  }]
}, {
  timestamps: true
});

module.exports = mongoose.model('Course', courseSchema);
