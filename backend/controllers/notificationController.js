const Notification = require('../models/Notification');
const { validationResult } = require('express-validator');

// Get user notifications
exports.getNotifications = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;
    const status = req.query.status || ['unread', 'read'];

    const notifications = await Notification.find({
      recipient: req.user.id,
      status: { $in: Array.isArray(status) ? status : [status] }
    })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

    const total = await Notification.countDocuments({
      recipient: req.user.id,
      status: { $in: Array.isArray(status) ? status : [status] }
    });

    const unreadCount = await Notification.getUnreadCount(req.user.id);

    res.json({
      notifications,
      unreadCount,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching notifications', error: error.message });
  }
};

// Mark notification as read
exports.markAsRead = async (req, res) => {
  try {
    const notification = await Notification.findOne({
      _id: req.params.notificationId,
      recipient: req.user.id
    });

    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' });
    }

    await notification.markAsRead();
    res.json(notification);
  } catch (error) {
    res.status(500).json({ message: 'Error marking notification as read', error: error.message });
  }
};

// Mark all notifications as read
exports.markAllAsRead = async (req, res) => {
  try {
    await Notification.updateMany(
      {
        recipient: req.user.id,
        status: 'unread'
      },
      {
        $set: {
          status: 'read',
          readAt: new Date()
        }
      }
    );

    res.json({ message: 'All notifications marked as read' });
  } catch (error) {
    res.status(500).json({ message: 'Error marking notifications as read', error: error.message });
  }
};

// Archive notification
exports.archiveNotification = async (req, res) => {
  try {
    const notification = await Notification.findOne({
      _id: req.params.notificationId,
      recipient: req.user.id
    });

    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' });
    }

    await notification.archive();
    res.json(notification);
  } catch (error) {
    res.status(500).json({ message: 'Error archiving notification', error: error.message });
  }
};

// Delete notifications
exports.deleteNotifications = async (req, res) => {
  try {
    const { notificationIds } = req.body;

    if (!Array.isArray(notificationIds) || !notificationIds.length) {
      return res.status(400).json({ message: 'No notification IDs provided' });
    }

    await Notification.updateMany(
      {
        _id: { $in: notificationIds },
        recipient: req.user.id
      },
      {
        $set: {
          status: 'archived',
          archivedAt: new Date()
        }
      }
    );

    res.json({ message: 'Notifications archived successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error archiving notifications', error: error.message });
  }
};

// Get notification preferences
exports.getPreferences = async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .select('notificationPreferences');
    
    res.json(user.notificationPreferences);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching notification preferences', error: error.message });
  }
};

// Update notification preferences
exports.updatePreferences = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const user = await User.findById(req.user.id);
    user.notificationPreferences = {
      ...user.notificationPreferences,
      ...req.body.preferences
    };
    await user.save();

    res.json(user.notificationPreferences);
  } catch (error) {
    res.status(500).json({ message: 'Error updating notification preferences', error: error.message });
  }
};
