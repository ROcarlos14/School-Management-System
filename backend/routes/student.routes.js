const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const authorize = require('../middleware/authorize');
const Student = require('../models/Student');
const Course = require('../models/Course');
const { check, validationResult } = require('express-validator');

// @route   POST /api/students
// @desc    Create a new student
// @access  Private (Admin only)
router.post('/', [
  auth,
  authorize('admin'),
  [
    check('studentId', 'Student ID is required').not().isEmpty(),
    check('dateOfBirth', 'Date of birth is required').isISO8601(),
    check('grade', 'Grade is required').isIn(['1st', '2nd', '3rd', '4th', '5th', '6th', '7th', '8th', '9th', '10th', '11th', '12th']),
    check('section', 'Section is required').isIn(['A', 'B', 'C', 'D']),
    check('parentName', 'Parent name is required').not().isEmpty(),
    check('parentContact', 'Parent contact is required').not().isEmpty(),
    check('address', 'Address is required').not().isEmpty()
  ]
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const student = new Student({
      user: req.body.userId,
      ...req.body
    });

    await student.save();
    res.status(201).json({ success: true, data: student });
  } catch (err) {
    console.error(err);
    if (err.code === 11000) {
      return res.status(400).json({ success: false, message: 'Student ID already exists' });
    }
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   GET /api/students
// @desc    Get all students with filters
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const { grade, section, search } = req.query;
    let query = {};

    // Add filters if provided
    if (grade) query.grade = grade;
    if (section) query.section = section;
    if (search) {
      query.$or = [
        { studentId: { $regex: search, $options: 'i' } },
        { parentName: { $regex: search, $options: 'i' } }
      ];
    }

    const students = await Student.find(query)
      .populate('user', ['name', 'email'])
      .populate('enrolledCourses.course', ['name', 'courseCode'])
      .populate('attendance.course', ['name', 'courseCode'])
      .populate('attendance.markedBy', ['name'])
      .populate('academicPerformance.course', ['name', 'courseCode'])
      .populate('academicPerformance.evaluatedBy', ['name']);
    
    res.json({ success: true, data: students });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   GET /api/students/dashboard
// @desc    Get student dashboard data
// @access  Private (Student only)
router.get('/dashboard', [auth, authorize('student')], async (req, res) => {
  try {
    const student = await Student.findOne({ user: req.user.id })
      .populate('enrolledCourses.course', ['name', 'courseCode', 'teacher'])
      .populate('attendance.course', ['name', 'courseCode'])
      .populate('academicPerformance.course', ['name', 'courseCode']);

    if (!student) {
      return res.status(404).json({ success: false, message: 'Student not found' });
    }

    // Calculate attendance percentage for each course
    const courseAttendance = student.enrolledCourses.map(enrollment => {
      const courseAttendance = student.attendance.filter(a => 
        a.course.toString() === enrollment.course._id.toString()
      );
      const present = courseAttendance.filter(a => a.status === 'present').length;
      const total = courseAttendance.length;
      const percentage = total > 0 ? (present / total) * 100 : 0;

      return {
        course: enrollment.course,
        attendance: percentage,
        totalClasses: total,
        presentClasses: present
      };
    });

    // Get academic performance summary
    const academicSummary = {
      gpa: student.calculateGPA(),
      coursePerformance: student.enrolledCourses.map(enrollment => {
        const performances = student.academicPerformance.filter(p => 
          p.course.toString() === enrollment.course._id.toString()
        );
        return {
          course: enrollment.course,
          performances: performances.map(p => ({
            term: p.term,
            marks: p.marks,
            grade: p.grade
          }))
        };
      })
    };

    res.json({
      success: true,
      data: {
        student,
        courseAttendance,
        academicSummary,
        age: student.age,
        overallAttendance: student.attendancePercentage
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   GET /api/students/:id
// @desc    Get student by ID
// @access  Private
router.get('/:id', auth, async (req, res) => {
  try {
    const student = await Student.findById(req.params.id)
      .populate('user', ['name', 'email'])
      .populate('enrolledCourses.course', ['name', 'courseCode'])
      .populate('attendance.course', ['name', 'courseCode'])
      .populate('attendance.markedBy', ['name'])
      .populate('academicPerformance.course', ['name', 'courseCode'])
      .populate('academicPerformance.evaluatedBy', ['name']);

    if (!student) {
      return res.status(404).json({ success: false, message: 'Student not found' });
    }

    res.json({ success: true, data: student });
  } catch (err) {
    console.error(err);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ success: false, message: 'Student not found' });
    }
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   PUT /api/students/:id
// @desc    Update student
// @access  Private (Admin or Student's own profile)
router.put('/:id', [
  auth,
  async (req, res, next) => {
    try {
      const student = await Student.findById(req.params.id);
      if (!student) {
        return res.status(404).json({ success: false, message: 'Student not found' });
      }
      
      // Allow admin or the student themselves to update
      if (req.user.role !== 'admin' && student.user.toString() !== req.user.id) {
        return res.status(403).json({ success: false, message: 'Not authorized' });
      }
      next();
    } catch (err) {
      console.error(err);
      res.status(500).json({ success: false, message: 'Server error' });
    }
  },
  [
    check('dateOfBirth', 'Invalid date of birth').optional().isISO8601(),
    check('grade').optional().isIn(['1st', '2nd', '3rd', '4th', '5th', '6th', '7th', '8th', '9th', '10th', '11th', '12th']),
    check('section').optional().isIn(['A', 'B', 'C', 'D']),
    check('parentName').optional().not().isEmpty(),
    check('parentContact').optional().not().isEmpty(),
    check('address').optional().not().isEmpty(),
    check('healthRecords').optional().isArray(),
    check('extracurricularActivities').optional().isArray()
  ]
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // Don't allow updating studentId through this route
    delete req.body.studentId;
    delete req.body.user;

    const student = await Student.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    ).populate('user', ['name', 'email']);

    res.json({ success: true, data: student });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   POST /api/students/:id/courses/:courseId
// @desc    Enroll student in a course
// @access  Private (Admin only)
router.post('/:id/courses/:courseId', [auth, authorize('admin')], async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student) {
      return res.status(404).json({ success: false, message: 'Student not found' });
    }

    const course = await Course.findById(req.params.courseId);
    if (!course) {
      return res.status(404).json({ success: false, message: 'Course not found' });
    }

    // Check if already enrolled
    if (student.enrolledCourses.some(e => e.course.toString() === req.params.courseId)) {
      return res.status(400).json({ success: false, message: 'Already enrolled in this course' });
    }

    student.enrolledCourses.push({
      course: req.params.courseId,
      enrollmentDate: Date.now(),
      status: 'active'
    });

    await student.save();

    res.json({ success: true, data: student });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   PUT /api/students/:id/courses/:courseId
// @desc    Update course enrollment status
// @access  Private (Admin only)
router.put('/:id/courses/:courseId', [
  auth,
  authorize('admin'),
  [
    check('status', 'Invalid status').isIn(['active', 'completed', 'dropped'])
  ]
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const student = await Student.findById(req.params.id);
    if (!student) {
      return res.status(404).json({ success: false, message: 'Student not found' });
    }

    const enrollment = student.enrolledCourses.find(e => e.course.toString() === req.params.courseId);
    if (!enrollment) {
      return res.status(404).json({ success: false, message: 'Course enrollment not found' });
    }

    enrollment.status = req.body.status;
    await student.save();

    res.json({ success: true, data: student });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;
