const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const authorize = require('../middleware/authorize');
const Course = require('../models/Course');
const { check, validationResult } = require('express-validator');

// @route   POST /api/courses
// @desc    Create a new course
// @access  Private (Admin only)
router.post('/', [
  auth,
  authorize('admin'),
  [
    check('courseCode', 'Course code is required').not().isEmpty(),
    check('name', 'Course name is required').not().isEmpty(),
    check('description', 'Description is required').not().isEmpty(),
    check('grade', 'Grade is required').not().isEmpty(),
    check('teacher', 'Teacher ID is required').not().isEmpty(),
    check('schedule', 'Schedule is required').isArray({ min: 1 })
  ]
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const course = new Course(req.body);
    await course.save();

    // Update teacher's assigned courses
    const Teacher = require('../models/Teacher');
    await Teacher.findByIdAndUpdate(
      req.body.teacher,
      { $push: { assignedCourses: course._id } }
    );

    res.status(201).json({ success: true, data: course });
  } catch (err) {
    console.error(err);
    if (err.code === 11000) {
      return res.status(400).json({ success: false, message: 'Course code already exists' });
    }
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   GET /api/courses
// @desc    Get all courses
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const courses = await Course.find()
      .populate('teacher', ['name', 'email'])
      .populate('students', ['name', 'email']);
    res.json({ success: true, data: courses });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   GET /api/courses/:id
// @desc    Get course by ID
// @access  Private
router.get('/:id', auth, async (req, res) => {
  try {
    const course = await Course.findById(req.params.id)
      .populate('teacher', ['name', 'email'])
      .populate('students', ['name', 'email']);

    if (!course) {
      return res.status(404).json({ success: false, message: 'Course not found' });
    }

    res.json({ success: true, data: course });
  } catch (err) {
    console.error(err);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ success: false, message: 'Course not found' });
    }
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   PUT /api/courses/:id
// @desc    Update course
// @access  Private (Admin only)
router.put('/:id', [
  auth,
  authorize('admin'),
  [
    check('courseCode', 'Course code is required').optional().not().isEmpty(),
    check('name', 'Course name is required').optional().not().isEmpty(),
    check('description', 'Description is required').optional().not().isEmpty(),
    check('grade', 'Grade is required').optional().not().isEmpty(),
    check('teacher', 'Teacher ID is required').optional().not().isEmpty(),
    check('schedule', 'Schedule is required').optional().isArray({ min: 1 })
  ]
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const course = await Course.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    )
    .populate('teacher', ['name', 'email'])
    .populate('students', ['name', 'email']);

    if (!course) {
      return res.status(404).json({ success: false, message: 'Course not found' });
    }

    // If teacher is being updated, update the teacher's assigned courses
    if (req.body.teacher) {
      const Teacher = require('../models/Teacher');
      
      // Remove course from old teacher's assigned courses
      await Teacher.findByIdAndUpdate(
        course.teacher,
        { $pull: { assignedCourses: course._id } }
      );

      // Add course to new teacher's assigned courses
      await Teacher.findByIdAndUpdate(
        req.body.teacher,
        { $push: { assignedCourses: course._id } }
      );
    }

    res.json({ success: true, data: course });
  } catch (err) {
    console.error(err);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ success: false, message: 'Course not found' });
    }
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   DELETE /api/courses/:id
// @desc    Delete course
// @access  Private (Admin only)
router.delete('/:id', [auth, authorize('admin')], async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) {
      return res.status(404).json({ success: false, message: 'Course not found' });
    }

    // Remove course from teacher's assigned courses
    const Teacher = require('../models/Teacher');
    await Teacher.findByIdAndUpdate(
      course.teacher,
      { $pull: { assignedCourses: course._id } }
    );

    await course.deleteOne();
    res.json({ success: true, message: 'Course removed' });
  } catch (err) {
    console.error(err);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ success: false, message: 'Course not found' });
    }
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   POST /api/courses/:id/enroll
// @desc    Enroll a student in a course
// @access  Private (Admin only)
router.post('/:id/enroll', [
  auth,
  authorize('admin'),
  [
    check('studentId', 'Student ID is required').not().isEmpty()
  ]
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const course = await Course.findById(req.params.id);
    if (!course) {
      return res.status(404).json({ success: false, message: 'Course not found' });
    }

    // Check if student is already enrolled
    if (course.students.includes(req.body.studentId)) {
      return res.status(400).json({ success: false, message: 'Student already enrolled in this course' });
    }

    course.students.push(req.body.studentId);
    await course.save();

    const updatedCourse = await Course.findById(req.params.id)
      .populate('teacher', ['name', 'email'])
      .populate('students', ['name', 'email']);

    res.json({ success: true, data: updatedCourse });
  } catch (err) {
    console.error(err);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ success: false, message: 'Course or student not found' });
    }
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   POST /api/courses/:id/unenroll
// @desc    Unenroll a student from a course
// @access  Private (Admin only)
router.post('/:id/unenroll', [
  auth,
  authorize('admin'),
  [
    check('studentId', 'Student ID is required').not().isEmpty()
  ]
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const course = await Course.findById(req.params.id);
    if (!course) {
      return res.status(404).json({ success: false, message: 'Course not found' });
    }

    // Check if student is enrolled
    if (!course.students.includes(req.body.studentId)) {
      return res.status(400).json({ success: false, message: 'Student not enrolled in this course' });
    }

    course.students = course.students.filter(
      student => student.toString() !== req.body.studentId
    );
    await course.save();

    const updatedCourse = await Course.findById(req.params.id)
      .populate('teacher', ['name', 'email'])
      .populate('students', ['name', 'email']);

    res.json({ success: true, data: updatedCourse });
  } catch (err) {
    console.error(err);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ success: false, message: 'Course or student not found' });
    }
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;
