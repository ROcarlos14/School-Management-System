const Parent = require('../models/Parent');
const User = require('../models/User');
const { validationResult } = require('express-validator');

// Get parent profile
exports.getParentProfile = async (req, res) => {
  try {
    const parent = await Parent.findOne({ user: req.user.id })
      .populate('user', '-password')
      .populate('children', 'firstName lastName grade section studentId');

    if (!parent) {
      return res.status(404).json({ message: 'Parent profile not found' });
    }

    res.json(parent);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching parent profile', error: error.message });
  }
};

// Update parent profile
exports.updateParentProfile = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const parent = await Parent.findOne({ user: req.user.id });
    
    if (!parent) {
      return res.status(404).json({ message: 'Parent profile not found' });
    }

    // Update fields
    const updateFields = [
      'occupation', 'workPhone', 'emergencyContact',
      'address', 'notifications', 'preferredLanguage'
    ];

    updateFields.forEach(field => {
      if (req.body[field] !== undefined) {
        parent[field] = req.body[field];
      }
    });

    await parent.save();
    res.json(parent);
  } catch (error) {
    res.status(500).json({ message: 'Error updating parent profile', error: error.message });
  }
};

// Get children's progress
exports.getChildrenProgress = async (req, res) => {
  try {
    const parent = await Parent.findOne({ user: req.user.id });
    
    if (!parent) {
      return res.status(404).json({ message: 'Parent profile not found' });
    }

    const progress = await Promise.all(parent.children.map(async (childId) => {
      const child = await User.findById(childId)
        .select('firstName lastName grade section studentId');
      
      // Get attendance
      const attendance = await Attendance.find({ student: childId })
        .sort({ date: -1 })
        .limit(30);

      // Get recent grades
      const grades = await Grade.find({ student: childId })
        .populate('course', 'name')
        .sort({ updatedAt: -1 })
        .limit(10);

      // Get behavior records
      const behavior = await Behavior.find({ student: childId })
        .sort({ date: -1 })
        .limit(5);

      return {
        student: child,
        attendance: {
          total: attendance.length,
          present: attendance.filter(a => a.status === 'present').length,
          absent: attendance.filter(a => a.status === 'absent').length,
          late: attendance.filter(a => a.status === 'late').length
        },
        recentGrades: grades,
        recentBehavior: behavior
      };
    }));

    res.json(progress);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching children progress', error: error.message });
  }
};

// Update notification preferences
exports.updateNotificationPreferences = async (req, res) => {
  try {
    const parent = await Parent.findOne({ user: req.user.id });
    
    if (!parent) {
      return res.status(404).json({ message: 'Parent profile not found' });
    }

    parent.notifications = {
      ...parent.notifications,
      ...req.body.notifications
    };

    await parent.save();
    res.json(parent.notifications);
  } catch (error) {
    res.status(500).json({ message: 'Error updating notification preferences', error: error.message });
  }
};

// Get child's detailed report
exports.getChildDetailedReport = async (req, res) => {
  try {
    const parent = await Parent.findOne({ user: req.user.id });
    
    if (!parent) {
      return res.status(404).json({ message: 'Parent profile not found' });
    }

    // Verify if the child belongs to the parent
    if (!parent.children.includes(req.params.childId)) {
      return res.status(403).json({ message: 'Not authorized to view this child\'s report' });
    }

    const child = await User.findById(req.params.childId)
      .select('firstName lastName grade section studentId');

    // Get comprehensive data
    const [attendance, grades, behavior, events] = await Promise.all([
      Attendance.find({ student: req.params.childId })
        .sort({ date: -1 }),
      Grade.find({ student: req.params.childId })
        .populate('course', 'name')
        .sort({ updatedAt: -1 }),
      Behavior.find({ student: req.params.childId })
        .sort({ date: -1 }),
      Event.find({ 
        participants: req.params.childId,
        date: { $gte: new Date() }
      }).sort({ date: 1 })
    ]);

    res.json({
      student: child,
      attendance,
      grades,
      behavior,
      upcomingEvents: events
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching child\'s detailed report', error: error.message });
  }
};

// Link child to parent
exports.linkChild = async (req, res) => {
  try {
    const parent = await Parent.findOne({ user: req.user.id });
    
    if (!parent) {
      return res.status(404).json({ message: 'Parent profile not found' });
    }

    const child = await User.findOne({ studentId: req.body.studentId, role: 'student' });
    
    if (!child) {
      return res.status(404).json({ message: 'Student not found' });
    }

    if (parent.children.includes(child._id)) {
      return res.status(400).json({ message: 'Child already linked to parent' });
    }

    parent.children.push(child._id);
    await parent.save();

    res.json({ message: 'Child linked successfully', child: {
      id: child._id,
      firstName: child.firstName,
      lastName: child.lastName,
      grade: child.grade,
      section: child.section,
      studentId: child.studentId
    }});
  } catch (error) {
    res.status(500).json({ message: 'Error linking child', error: error.message });
  }
};
