const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  studentId: {
    type: String,
    required: true,
    unique: true
  },
  dateOfBirth: {
    type: Date,
    required: true
  },
  grade: {
    type: String,
    required: true,
    enum: ['1st', '2nd', '3rd', '4th', '5th', '6th', '7th', '8th', '9th', '10th', '11th', '12th']
  },
  section: {
    type: String,
    required: true,
    enum: ['A', 'B', 'C', 'D']
  },
  parentName: {
    type: String,
    required: true
  },
  parentContact: {
    type: String,
    required: true
  },
  address: {
    type: String,
    required: true
  },
  enrolledCourses: [{
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course'
    },
    enrollmentDate: {
      type: Date,
      default: Date.now
    },
    status: {
      type: String,
      enum: ['active', 'completed', 'dropped'],
      default: 'active'
    }
  }],
  attendance: [{
    date: {
      type: Date,
      required: true
    },
    status: {
      type: String,
      enum: ['present', 'absent', 'late'],
      required: true
    },
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course',
      required: true
    },
    markedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    }
  }],
  academicPerformance: [{
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course',
      required: true
    },
    term: {
      type: String,
      enum: ['midterm', 'final'],
      required: true
    },
    marks: {
      type: Number,
      required: true,
      min: 0,
      max: 100
    },
    grade: {
      type: String,
      enum: ['A+', 'A', 'A-', 'B+', 'B', 'B-', 'C+', 'C', 'C-', 'D+', 'D', 'F'],
      required: true
    },
    remarks: String,
    evaluatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    evaluationDate: {
      type: Date,
      default: Date.now
    }
  }],
  extracurricularActivities: [{
    activity: {
      type: String,
      required: true
    },
    role: String,
    startDate: Date,
    endDate: Date,
    achievements: [String]
  }],
  healthRecords: [{
    condition: String,
    details: String,
    emergencyContact: String,
    bloodGroup: String,
    lastUpdated: {
      type: Date,
      default: Date.now
    }
  }]
}, {
  timestamps: true
});

// Virtual field for age calculation
studentSchema.virtual('age').get(function() {
  return Math.floor((Date.now() - this.dateOfBirth) / (365.25 * 24 * 60 * 60 * 1000));
});

// Virtual field for attendance percentage
studentSchema.virtual('attendancePercentage').get(function() {
  if (!this.attendance.length) return 0;
  const present = this.attendance.filter(a => a.status === 'present').length;
  return (present / this.attendance.length) * 100;
});

// Method to calculate GPA
studentSchema.methods.calculateGPA = function() {
  if (!this.academicPerformance.length) return 0;
  
  const gradePoints = {
    'A+': 4.0, 'A': 4.0, 'A-': 3.7,
    'B+': 3.3, 'B': 3.0, 'B-': 2.7,
    'C+': 2.3, 'C': 2.0, 'C-': 1.7,
    'D+': 1.3, 'D': 1.0, 'F': 0.0
  };

  const totalPoints = this.academicPerformance.reduce((sum, performance) => {
    return sum + gradePoints[performance.grade];
  }, 0);

  return totalPoints / this.academicPerformance.length;
};

// Indexes for better query performance
studentSchema.index({ user: 1 });
studentSchema.index({ studentId: 1 });
studentSchema.index({ grade: 1, section: 1 });

module.exports = mongoose.model('Student', studentSchema);
