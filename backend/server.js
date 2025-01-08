const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const helmet = require('helmet');
const morgan = require('morgan');
const mongoSanitize = require('mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const rateLimit = require('express-rate-limit');
const compression = require('compression');

// Load environment variables
dotenv.config();

// Create Express app
const app = express();

// Environment variables
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI;
const NODE_ENV = process.env.NODE_ENV;
const FRONTEND_URL = process.env.FRONTEND_URL;

// Log environment variables
console.log('Environment variables:');
console.log('PORT:', PORT);
console.log('MONGODB_URI:', MONGODB_URI);
console.log('NODE_ENV:', NODE_ENV);
console.log('FRONTEND_URL:', FRONTEND_URL);

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
  origin: FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));

// Security middleware
app.use(helmet());
app.use(mongoSanitize());
app.use(xss());
app.use(hpp());

// Rate limiting
const limiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use('/api/', limiter);

// Compression
app.use(compression());

// Import routes
const authRoutes = require('./routes/auth.routes');
const teacherRoutes = require('./routes/teacher.routes');
const courseRoutes = require('./routes/course.routes');
const eventRoutes = require('./routes/event.routes');
const studentRoutes = require('./routes/student.routes');
const attendanceRoutes = require('./routes/attendance.routes');
const gradeRoutes = require('./routes/grade.routes');
const parentRoutes = require('./routes/parent.routes');
const messageRoutes = require('./routes/message.routes');
const notificationRoutes = require('./routes/notification.routes');
const calendarRoutes = require('./routes/calendar.routes');

// Use routes
app.use('/api/auth', authRoutes);
app.use('/api/students', studentRoutes);
app.use('/api/teachers', teacherRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/api/grades', gradeRoutes);
app.use('/api/parents', parentRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/calendar', calendarRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    error: NODE_ENV === 'development' ? err.message : 'Server Error'
  });
});

// Connect to MongoDB with retries
const connectDB = async (retries = 5) => {
  try {
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('Connected to MongoDB');
    // Start server only after successful DB connection
  } catch (err) {
    console.error('MongoDB connection error:', err.message);
    if (retries > 0) {
      console.log(`Retrying connection... (${retries} attempts remaining)`);
      setTimeout(() => connectDB(retries - 1), 5000);
    } else {
      console.error('Failed to connect to MongoDB after multiple attempts');
      process.exit(1);
    }
  }
};

// Start the connection process
connectDB();

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
  console.error(`Error: ${err.message}`);
  // Close server & exit process
  server.close(() => process.exit(1));
});

const server = app.listen(PORT, () => {
  console.log(`Server running in ${NODE_ENV} mode on port ${PORT}`);
});
