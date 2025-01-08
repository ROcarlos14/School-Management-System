const Grade = require('../models/Grade');
const { validationResult } = require('express-validator');

// Get all grades for a student
exports.getStudentGrades = async (req, res) => {
  try {
    const grades = await Grade.find({ student: req.params.studentId })
      .populate('course', 'name code')
      .sort({ 'course.name': 1 });
    
    res.json(grades);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching grades', error: error.message });
  }
};

// Get grade details for a specific course
exports.getCourseGrade = async (req, res) => {
  try {
    const grade = await Grade.findOne({
      student: req.params.studentId,
      course: req.params.courseId,
      term: req.params.term
    }).populate('course', 'name code');
    
    if (!grade) {
      return res.status(404).json({ message: 'Grade not found' });
    }
    
    res.json(grade);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching grade', error: error.message });
  }
};

// Add or update assignment grade
exports.updateAssignmentGrade = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    let grade = await Grade.findOne({
      student: req.params.studentId,
      course: req.params.courseId,
      term: req.body.term
    });

    if (!grade) {
      grade = new Grade({
        student: req.params.studentId,
        course: req.params.courseId,
        term: req.body.term,
        academicYear: req.body.academicYear,
        assignments: []
      });
    }

    // Add or update assignment
    const assignmentIndex = grade.assignments.findIndex(
      a => a.title === req.body.title
    );

    if (assignmentIndex > -1) {
      grade.assignments[assignmentIndex] = {
        ...grade.assignments[assignmentIndex],
        ...req.body
      };
    } else {
      grade.assignments.push(req.body);
    }

    // Recalculate final grade
    grade.calculateFinalGrade();
    await grade.save();

    res.json(grade);
  } catch (error) {
    res.status(500).json({ message: 'Error updating grade', error: error.message });
  }
};

// Add or update exam grade
exports.updateExamGrade = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    let grade = await Grade.findOne({
      student: req.params.studentId,
      course: req.params.courseId,
      term: req.body.term
    });

    if (!grade) {
      grade = new Grade({
        student: req.params.studentId,
        course: req.params.courseId,
        term: req.body.term,
        academicYear: req.body.academicYear,
        exams: []
      });
    }

    // Add or update exam
    const examIndex = grade.exams.findIndex(
      e => e.title === req.body.title
    );

    if (examIndex > -1) {
      grade.exams[examIndex] = {
        ...grade.exams[examIndex],
        ...req.body
      };
    } else {
      grade.exams.push(req.body);
    }

    // Recalculate final grade
    grade.calculateFinalGrade();
    await grade.save();

    res.json(grade);
  } catch (error) {
    res.status(500).json({ message: 'Error updating grade', error: error.message });
  }
};

// Get student's GPA
exports.getStudentGPA = async (req, res) => {
  try {
    const grades = await Grade.find({
      student: req.params.studentId,
      term: req.params.term,
      academicYear: req.params.academicYear
    });

    if (!grades.length) {
      return res.status(404).json({ message: 'No grades found for the specified term' });
    }

    // Calculate GPA
    const totalPoints = grades.reduce((sum, grade) => sum + grade.gpaPoints, 0);
    const gpa = totalPoints / grades.length;

    res.json({
      gpa: gpa.toFixed(2),
      totalCourses: grades.length,
      term: req.params.term,
      academicYear: req.params.academicYear
    });
  } catch (error) {
    res.status(500).json({ message: 'Error calculating GPA', error: error.message });
  }
};

// Add comments to a grade
exports.addGradeComment = async (req, res) => {
  try {
    const grade = await Grade.findById(req.params.gradeId);
    
    if (!grade) {
      return res.status(404).json({ message: 'Grade not found' });
    }

    grade.comments = req.body.comments;
    await grade.save();

    res.json(grade);
  } catch (error) {
    res.status(500).json({ message: 'Error adding comment', error: error.message });
  }
};
