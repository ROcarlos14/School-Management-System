const mongoose = require('mongoose');

const gradeSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: true
  },
  term: {
    type: String,
    required: true,
    enum: ['First Term', 'Second Term', 'Final']
  },
  assignments: [{
    title: String,
    score: Number,
    maxScore: Number,
    weight: Number,
    date: Date
  }],
  exams: [{
    title: String,
    score: Number,
    maxScore: Number,
    weight: Number,
    date: Date
  }],
  finalGrade: {
    type: Number,
    min: 0,
    max: 100
  },
  letterGrade: {
    type: String,
    enum: ['A+', 'A', 'A-', 'B+', 'B', 'B-', 'C+', 'C', 'C-', 'D+', 'D', 'F']
  },
  comments: String,
  academicYear: {
    type: String,
    required: true
  },
  lastUpdated: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for calculating GPA points
gradeSchema.virtual('gpaPoints').get(function() {
  const gpaScale = {
    'A+': 4.0, 'A': 4.0, 'A-': 3.7,
    'B+': 3.3, 'B': 3.0, 'B-': 2.7,
    'C+': 2.3, 'C': 2.0, 'C-': 1.7,
    'D+': 1.3, 'D': 1.0, 'F': 0.0
  };
  return gpaScale[this.letterGrade] || 0;
});

// Method to calculate final grade
gradeSchema.methods.calculateFinalGrade = function() {
  let totalWeightedScore = 0;
  let totalWeight = 0;

  // Calculate weighted scores for assignments
  this.assignments.forEach(assignment => {
    const weightedScore = (assignment.score / assignment.maxScore) * assignment.weight;
    totalWeightedScore += weightedScore;
    totalWeight += assignment.weight;
  });

  // Calculate weighted scores for exams
  this.exams.forEach(exam => {
    const weightedScore = (exam.score / exam.maxScore) * exam.weight;
    totalWeightedScore += weightedScore;
    totalWeight += exam.weight;
  });

  // Calculate final grade as percentage
  this.finalGrade = totalWeight > 0 ? (totalWeightedScore / totalWeight) * 100 : 0;

  // Determine letter grade
  this.letterGrade = this.getLetterGrade(this.finalGrade);

  return this.finalGrade;
};

// Helper method to determine letter grade
gradeSchema.methods.getLetterGrade = function(percentage) {
  if (percentage >= 97) return 'A+';
  if (percentage >= 93) return 'A';
  if (percentage >= 90) return 'A-';
  if (percentage >= 87) return 'B+';
  if (percentage >= 83) return 'B';
  if (percentage >= 80) return 'B-';
  if (percentage >= 77) return 'C+';
  if (percentage >= 73) return 'C';
  if (percentage >= 70) return 'C-';
  if (percentage >= 67) return 'D+';
  if (percentage >= 60) return 'D';
  return 'F';
};

const Grade = mongoose.model('Grade', gradeSchema);

module.exports = Grade;
