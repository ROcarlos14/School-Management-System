const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
    course: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course',
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    status: {
        type: String,
        enum: ['present', 'absent', 'late', 'excused'],
        required: true
    },
    remarks: String,
    recordedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
}, { timestamps: true });

const academicPerformanceSchema = new mongoose.Schema({
    course: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course',
        required: true
    },
    assessmentType: {
        type: String,
        enum: ['quiz', 'test', 'exam', 'assignment', 'project'],
        required: true
    },
    score: {
        type: Number,
        required: true
    },
    maxScore: {
        type: Number,
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    remarks: String,
    recordedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, { timestamps: true });

const studentSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true
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
        required: true
    },
    section: {
        type: String,
        required: true
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
    attendance: [attendanceSchema],
    academicPerformance: [academicPerformanceSchema],
    extracurricularActivities: [{
        activity: String,
        role: String,
        startDate: Date,
        endDate: Date,
        achievements: String
    }],
    healthRecords: [{
        condition: String,
        details: String,
        date: Date,
        treatment: String
    }]
}, { timestamps: true });

// Add indexes for better query performance
studentSchema.index({ studentId: 1 });
studentSchema.index({ grade: 1, section: 1 });
studentSchema.index({ 'enrolledCourses.course': 1 });

module.exports = mongoose.models.Student || mongoose.model('Student', studentSchema);
