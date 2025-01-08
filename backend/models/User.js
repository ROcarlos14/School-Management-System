const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a name'],
    trim: true,
    maxlength: [50, 'Name cannot be more than 50 characters']
  },
  email: {
    type: String,
    required: [true, 'Please add an email'],
    unique: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Please add a valid email'
    ]
  },
  role: {
    type: String,
    enum: ['student', 'teacher', 'admin'],
    default: 'student'
  },
  password: {
    type: String,
    required: [true, 'Please add a password'],
    minlength: [6, 'Password must be at least 6 characters'],
    select: false
  },
  studentInfo: {
    type: {
      studentId: {
        type: String,
        unique: true,
        sparse: true
      },
      grade: {
        type: String,
        enum: ['1st', '2nd', '3rd', '4th', '5th', '6th', '7th', '8th', '9th', '10th', '11th', '12th'],
      },
      section: {
        type: String,
        enum: ['A', 'B', 'C', 'D'],
      },
      enrolledCourses: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course'
      }],
      guardianName: String,
      guardianContact: String,
      dateOfBirth: Date,
      address: String
    },
    required: false
  },
  resetPasswordToken: String,
  resetPasswordExpire: Date,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Encrypt password using bcrypt
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);

  // Generate student ID if role is student and studentId is not set
  if (this.role === 'student' && (!this.studentInfo || !this.studentInfo.studentId)) {
    const currentYear = new Date().getFullYear().toString().slice(-2);
    const randomNum = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    this.studentInfo = {
      ...this.studentInfo,
      studentId: `ST${currentYear}${randomNum}`
    };
  }
});

// Sign JWT and return
userSchema.methods.getSignedJwtToken = function() {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE
  });
};

// Match user entered password to hashed password in database
userSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
