const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  recipients: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    readAt: Date,
    deletedAt: Date
  }],
  subject: {
    type: String,
    required: true,
    trim: true
  },
  content: {
    type: String,
    required: true
  },
  attachments: [{
    filename: String,
    path: String,
    mimetype: String,
    size: Number
  }],
  type: {
    type: String,
    enum: ['direct', 'announcement', 'notification'],
    default: 'direct'
  },
  priority: {
    type: String,
    enum: ['low', 'normal', 'high', 'urgent'],
    default: 'normal'
  },
  category: {
    type: String,
    enum: ['general', 'academic', 'administrative', 'event', 'behavior'],
    default: 'general'
  },
  parentMessage: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Message'
  },
  metadata: {
    replyCount: {
      type: Number,
      default: 0
    },
    forwardCount: {
      type: Number,
      default: 0
    }
  },
  status: {
    type: String,
    enum: ['draft', 'sent', 'archived'],
    default: 'sent'
  },
  scheduledFor: Date,
  expiresAt: Date
}, {
  timestamps: true
});

// Indexes for better query performance
messageSchema.index({ sender: 1, createdAt: -1 });
messageSchema.index({ 'recipients.user': 1, createdAt: -1 });
messageSchema.index({ type: 1, status: 1, createdAt: -1 });

// Virtual for checking if message is read by a specific user
messageSchema.methods.isReadBy = function(userId) {
  const recipient = this.recipients.find(r => r.user.toString() === userId.toString());
  return recipient ? !!recipient.readAt : false;
};

// Virtual for checking if message is deleted by a specific user
messageSchema.methods.isDeletedBy = function(userId) {
  const recipient = this.recipients.find(r => r.user.toString() === userId.toString());
  return recipient ? !!recipient.deletedAt : false;
};

// Method to mark message as read
messageSchema.methods.markAsRead = async function(userId) {
  const recipient = this.recipients.find(r => r.user.toString() === userId.toString());
  if (recipient && !recipient.readAt) {
    recipient.readAt = new Date();
    await this.save();
  }
};

// Method to mark message as deleted
messageSchema.methods.markAsDeleted = async function(userId) {
  const recipient = this.recipients.find(r => r.user.toString() === userId.toString());
  if (recipient && !recipient.deletedAt) {
    recipient.deletedAt = new Date();
    await this.save();
  }
};

const Message = mongoose.model('Message', messageSchema);

module.exports = Message;
