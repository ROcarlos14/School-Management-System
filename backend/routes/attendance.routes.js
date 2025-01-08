const express = require('express');
const router = express.Router();
const Student = require('../models/student.model');
const auth = require('../middleware/auth');
const { isTeacher } = require('../middleware/roles');

// Add attendance record
router.post('/students/:studentId/attendance', auth, isTeacher, async (req, res) => {
    try {
        const { studentId } = req.params;
        const { course, date, status, remarks } = req.body;

        const student = await Student.findById(studentId);
        if (!student) {
            return res.status(404).json({ success: false, message: 'Student not found' });
        }

        // Add attendance record
        student.attendance.push({
            course,
            date: new Date(date),
            status,
            remarks,
            recordedBy: req.user.id
        });

        await student.save();

        res.status(200).json({
            success: true,
            data: student
        });
    } catch (error) {
        console.error('Error adding attendance:', error);
        res.status(500).json({
            success: false,
            message: 'Error adding attendance record'
        });
    }
});

// Get student attendance
router.get('/students/:studentId/attendance', auth, async (req, res) => {
    try {
        const { studentId } = req.params;
        const student = await Student.findById(studentId)
            .populate('attendance.course', 'name courseCode')
            .populate('attendance.recordedBy', 'name');

        if (!student) {
            return res.status(404).json({ success: false, message: 'Student not found' });
        }

        res.status(200).json({
            success: true,
            data: student.attendance
        });
    } catch (error) {
        console.error('Error fetching attendance:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching attendance records'
        });
    }
});

// Update attendance record
router.put('/students/:studentId/attendance/:attendanceId', auth, isTeacher, async (req, res) => {
    try {
        const { studentId, attendanceId } = req.params;
        const { status, remarks } = req.body;

        const student = await Student.findById(studentId);
        if (!student) {
            return res.status(404).json({ success: false, message: 'Student not found' });
        }

        const attendance = student.attendance.id(attendanceId);
        if (!attendance) {
            return res.status(404).json({ success: false, message: 'Attendance record not found' });
        }

        attendance.status = status;
        attendance.remarks = remarks;
        attendance.updatedAt = new Date();

        await student.save();

        res.status(200).json({
            success: true,
            data: student
        });
    } catch (error) {
        console.error('Error updating attendance:', error);
        res.status(500).json({
            success: false,
            message: 'Error updating attendance record'
        });
    }
});

module.exports = router;
