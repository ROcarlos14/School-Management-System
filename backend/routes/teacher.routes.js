const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const authorize = require('../middleware/authorize');
const Teacher = require('../models/Teacher');
const { check, validationResult } = require('express-validator');

// @route   POST /api/teachers
// @desc    Create a new teacher
// @access  Private (Admin only)
router.post('/', [
  auth,
  authorize('admin'),
  [
    check('teacherId', 'Teacher ID is required').not().isEmpty(),
    check('qualification', 'Qualification is required').not().isEmpty(),
    check('specialization', 'Specialization is required').not().isEmpty(),
    check('experience', 'Experience is required').isNumeric(),
    check('subjects', 'At least one subject is required').isArray({ min: 1 })
  ]
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const teacher = new Teacher({
      user: req.body.userId,
      ...req.body
    });

    await teacher.save();
    res.status(201).json({ success: true, data: teacher });
  } catch (err) {
    console.error(err);
    if (err.code === 11000) {
      return res.status(400).json({ success: false, message: 'Teacher ID already exists' });
    }
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   GET /api/teachers
// @desc    Get all teachers
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const teachers = await Teacher.find()
      .populate('user', ['name', 'email'])
      .populate('assignedCourses', ['name', 'courseCode']);
    
    res.json({ success: true, data: teachers });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   GET /api/teachers/:id
// @desc    Get teacher by ID
// @access  Private
router.get('/:id', auth, async (req, res) => {
  try {
    const teacher = await Teacher.findById(req.params.id)
      .populate('user', ['name', 'email'])
      .populate('assignedCourses', ['name', 'courseCode']);
    
    if (!teacher) {
      return res.status(404).json({ success: false, message: 'Teacher not found' });
    }

    res.json({ success: true, data: teacher });
  } catch (err) {
    console.error(err);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ success: false, message: 'Teacher not found' });
    }
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   PUT /api/teachers/:id
// @desc    Update teacher
// @access  Private (Admin only)
router.put('/:id', [
  auth,
  authorize('admin'),
  [
    check('teacherId', 'Teacher ID is required').optional().not().isEmpty(),
    check('qualification', 'Qualification is required').optional().not().isEmpty(),
    check('specialization', 'Specialization is required').optional().not().isEmpty(),
    check('experience', 'Experience is required').optional().isNumeric(),
    check('subjects', 'At least one subject is required').optional().isArray({ min: 1 })
  ]
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const teacher = await Teacher.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    ).populate('user', ['name', 'email'])
     .populate('assignedCourses', ['name', 'courseCode']);

    if (!teacher) {
      return res.status(404).json({ success: false, message: 'Teacher not found' });
    }

    res.json({ success: true, data: teacher });
  } catch (err) {
    console.error(err);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ success: false, message: 'Teacher not found' });
    }
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   DELETE /api/teachers/:id
// @desc    Delete teacher
// @access  Private (Admin only)
router.delete('/:id', [auth, authorize('admin')], async (req, res) => {
  try {
    const teacher = await Teacher.findById(req.params.id);
    if (!teacher) {
      return res.status(404).json({ success: false, message: 'Teacher not found' });
    }

    await teacher.deleteOne();
    res.json({ success: true, message: 'Teacher removed' });
  } catch (err) {
    console.error(err);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ success: false, message: 'Teacher not found' });
    }
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   POST /api/teachers/:id/schedule
// @desc    Add or update teacher schedule
// @access  Private (Admin only)
router.post('/:id/schedule', [
  auth,
  authorize('admin'),
  [
    check('day', 'Day is required').isIn(['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']),
    check('periods', 'Periods are required').isArray({ min: 1 })
  ]
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const teacher = await Teacher.findById(req.params.id);
    if (!teacher) {
      return res.status(404).json({ success: false, message: 'Teacher not found' });
    }

    // Update or add new schedule
    const scheduleIndex = teacher.schedule.findIndex(s => s.day === req.body.day);
    if (scheduleIndex > -1) {
      teacher.schedule[scheduleIndex].periods = req.body.periods;
    } else {
      teacher.schedule.push(req.body);
    }

    await teacher.save();
    res.json({ success: true, data: teacher });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   GET /api/teachers/:id/courses
// @desc    Get teacher's courses
// @access  Private
router.get('/:id/courses', auth, async (req, res) => {
  try {
    const teacher = await Teacher.findById(req.params.id)
      .populate('assignedCourses', ['name', 'courseCode', 'grade', 'schedule']);

    if (!teacher) {
      return res.status(404).json({ success: false, message: 'Teacher not found' });
    }

    res.json({ success: true, data: teacher.assignedCourses });
  } catch (err) {
    console.error(err);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ success: false, message: 'Teacher not found' });
    }
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;
