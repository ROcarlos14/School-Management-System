const express = require('express');
const { body } = require('express-validator');
const router = express.Router();
const gradeController = require('../controllers/gradeController');
const { authenticate } = require('../middleware/auth');
const { checkRole } = require('../middleware/roles');

// Validation middleware
const gradeValidation = [
  body('term').isIn(['First Term', 'Second Term', 'Final']).withMessage('Invalid term'),
  body('academicYear').notEmpty().withMessage('Academic year is required'),
  body('score').isFloat({ min: 0 }).withMessage('Score must be a positive number'),
  body('maxScore').isFloat({ min: 0 }).withMessage('Max score must be a positive number'),
  body('weight').isFloat({ min: 0, max: 100 }).withMessage('Weight must be between 0 and 100'),
  body('title').notEmpty().withMessage('Title is required'),
];

// Routes
router.get(
  '/student/:studentId',
  authenticate,
  checkRole(['student', 'teacher', 'admin']),
  gradeController.getStudentGrades
);

router.get(
  '/student/:studentId/course/:courseId/:term',
  authenticate,
  checkRole(['student', 'teacher', 'admin']),
  gradeController.getCourseGrade
);

router.post(
  '/student/:studentId/course/:courseId/assignment',
  authenticate,
  checkRole(['teacher', 'admin']),
  gradeValidation,
  gradeController.updateAssignmentGrade
);

router.post(
  '/student/:studentId/course/:courseId/exam',
  authenticate,
  checkRole(['teacher', 'admin']),
  gradeValidation,
  gradeController.updateExamGrade
);

router.get(
  '/student/:studentId/gpa/:term/:academicYear',
  authenticate,
  checkRole(['student', 'teacher', 'admin']),
  gradeController.getStudentGPA
);

router.post(
  '/:gradeId/comment',
  authenticate,
  checkRole(['teacher', 'admin']),
  body('comments').notEmpty().withMessage('Comment is required'),
  gradeController.addGradeComment
);

module.exports = router;
