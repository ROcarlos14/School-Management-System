const Message = require('../models/Message');
const Notification = require('../models/Notification');
const User = require('../models/User');
const { validationResult } = require('express-validator');

// Send a new message
exports.sendMessage = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const recipients = await User.find({ _id: { $in: req.body.recipients } });
    
    if (!recipients.length) {
      return res.status(400).json({ message: 'No valid recipients found' });
    }

    const message = new Message({
      sender: req.user.id,
      recipients: recipients.map(r => ({ user: r._id })),
      subject: req.body.subject,
      content: req.body.content,
      type: req.body.type || 'direct',
      priority: req.body.priority || 'normal',
      category: req.body.category || 'general',
      scheduledFor: req.body.scheduledFor,
      expiresAt: req.body.expiresAt
    });

    await message.save();

    // Create notifications for recipients
    const notifications = recipients.map(recipient => ({
      recipient: recipient._id,
      title: `New Message from ${req.user.firstName} ${req.user.lastName}`,
      message: `Subject: ${req.body.subject}`,
      type: 'message',
      priority: req.body.priority || 'normal',
      link: `/messages/${message._id}`,
      metadata: {
        messageId: message._id,
        senderId: req.user.id
      }
    }));

    await Notification.insertMany(notifications);

    res.status(201).json(message);
  } catch (error) {
    res.status(500).json({ message: 'Error sending message', error: error.message });
  }
};

// Get inbox messages
exports.getInbox = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const messages = await Message.find({
      'recipients.user': req.user.id,
      'recipients.deletedAt': { $exists: false }
    })
    .populate('sender', 'firstName lastName role')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

    const total = await Message.countDocuments({
      'recipients.user': req.user.id,
      'recipients.deletedAt': { $exists: false }
    });

    res.json({
      messages,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching inbox', error: error.message });
  }
};

// Get sent messages
exports.getSentMessages = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const messages = await Message.find({
      sender: req.user.id,
      status: { $ne: 'draft' }
    })
    .populate('recipients.user', 'firstName lastName role')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

    const total = await Message.countDocuments({
      sender: req.user.id,
      status: { $ne: 'draft' }
    });

    res.json({
      messages,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching sent messages', error: error.message });
  }
};

// Get message details
exports.getMessage = async (req, res) => {
  try {
    const message = await Message.findById(req.params.messageId)
      .populate('sender', 'firstName lastName role')
      .populate('recipients.user', 'firstName lastName role');

    if (!message) {
      return res.status(404).json({ message: 'Message not found' });
    }

    // Check if user has access to this message
    const isRecipient = message.recipients.some(r => r.user._id.toString() === req.user.id);
    const isSender = message.sender._id.toString() === req.user.id;

    if (!isRecipient && !isSender) {
      return res.status(403).json({ message: 'Access denied' });
    }

    // Mark as read if recipient
    if (isRecipient) {
      await message.markAsRead(req.user.id);
    }

    res.json(message);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching message', error: error.message });
  }
};

// Delete message
exports.deleteMessage = async (req, res) => {
  try {
    const message = await Message.findById(req.params.messageId);

    if (!message) {
      return res.status(404).json({ message: 'Message not found' });
    }

    // Check if user has access to delete this message
    const recipient = message.recipients.find(r => r.user.toString() === req.user.id);
    const isSender = message.sender.toString() === req.user.id;

    if (!recipient && !isSender) {
      return res.status(403).json({ message: 'Access denied' });
    }

    if (recipient) {
      await message.markAsDeleted(req.user.id);
    } else if (isSender) {
      message.status = 'archived';
      await message.save();
    }

    res.json({ message: 'Message deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting message', error: error.message });
  }
};

// Create announcement
exports.createAnnouncement = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    // Get recipients based on filters
    const recipientQuery = {};
    if (req.body.roles) recipientQuery.role = { $in: req.body.roles };
    if (req.body.grades) recipientQuery.grade = { $in: req.body.grades };
    if (req.body.sections) recipientQuery.section = { $in: req.body.sections };

    const recipients = await User.find(recipientQuery);

    if (!recipients.length) {
      return res.status(400).json({ message: 'No recipients found for the specified filters' });
    }

    const announcement = new Message({
      sender: req.user.id,
      recipients: recipients.map(r => ({ user: r._id })),
      subject: req.body.subject,
      content: req.body.content,
      type: 'announcement',
      priority: req.body.priority || 'normal',
      category: req.body.category,
      scheduledFor: req.body.scheduledFor,
      expiresAt: req.body.expiresAt
    });

    await announcement.save();

    // Create notifications for recipients
    const notifications = recipients.map(recipient => ({
      recipient: recipient._id,
      title: 'New Announcement',
      message: req.body.subject,
      type: 'message',
      priority: req.body.priority || 'normal',
      link: `/announcements/${announcement._id}`,
      metadata: {
        messageId: announcement._id,
        senderId: req.user.id,
        type: 'announcement'
      }
    }));

    await Notification.insertMany(notifications);

    res.status(201).json(announcement);
  } catch (error) {
    res.status(500).json({ message: 'Error creating announcement', error: error.message });
  }
};
