const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  recipient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: true
  },
  message: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['message', 'grade', 'attendance', 'event', 'behavior', 'system'],
    required: true
  },
  priority: {
    type: String,
    enum: ['low', 'normal', 'high', 'urgent'],
    default: 'normal'
  },
  status: {
    type: String,
    enum: ['unread', 'read', 'archived'],
    default: 'unread'
  },
  link: String,
  metadata: {
    type: Map,
    of: mongoose.Schema.Types.Mixed
  },
  readAt: Date,
  archivedAt: Date,
  expiresAt: Date
}, {
  timestamps: true
});

// Indexes for better query performance
notificationSchema.index({ recipient: 1, status: 1, createdAt: -1 });
notificationSchema.index({ recipient: 1, type: 1, createdAt: -1 });

// Method to mark notification as read
notificationSchema.methods.markAsRead = async function() {
  if (this.status === 'unread') {
    this.status = 'read';
    this.readAt = new Date();
    await this.save();
  }
};

// Method to archive notification
notificationSchema.methods.archive = async function() {
  if (this.status !== 'archived') {
    this.status = 'archived';
    this.archivedAt = new Date();
    await this.save();
  }
};

// Static method to create a new notification
notificationSchema.statics.createNotification = async function(data) {
  const notification = new this({
    recipient: data.recipient,
    title: data.title,
    message: data.message,
    type: data.type,
    priority: data.priority,
    link: data.link,
    metadata: data.metadata,
    expiresAt: data.expiresAt
  });

  await notification.save();
  return notification;
};

// Static method to get unread count for a user
notificationSchema.statics.getUnreadCount = async function(userId) {
  return this.countDocuments({
    recipient: userId,
    status: 'unread'
  });
};

const Notification = mongoose.model('Notification', notificationSchema);

module.exports = Notification;
