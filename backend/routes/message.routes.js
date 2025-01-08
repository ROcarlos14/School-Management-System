const express = require('express');
const { body } = require('express-validator');
const router = express.Router();
const messageController = require('../controllers/messageController');
const { authenticate } = require('../middleware/auth');
const { checkRole } = require('../middleware/roles');

// Validation middleware
const messageValidation = [
  body('recipients').isArray().notEmpty().withMessage('Recipients are required'),
  body('subject').trim().notEmpty().withMessage('Subject is required'),
  body('content').trim().notEmpty().withMessage('Content is required'),
  body('priority').optional().isIn(['low', 'normal', 'high', 'urgent']),
  body('category').optional().isIn(['general', 'academic', 'administrative', 'event', 'behavior']),
  body('scheduledFor').optional().isISO8601(),
  body('expiresAt').optional().isISO8601()
];

const announcementValidation = [
  body('subject').trim().notEmpty().withMessage('Subject is required'),
  body('content').trim().notEmpty().withMessage('Content is required'),
  body('roles').optional().isArray(),
  body('grades').optional().isArray(),
  body('sections').optional().isArray(),
  body('priority').optional().isIn(['low', 'normal', 'high', 'urgent']),
  body('category').optional().isIn(['general', 'academic', 'administrative', 'event', 'behavior']),
  body('scheduledFor').optional().isISO8601(),
  body('expiresAt').optional().isISO8601()
];

// Routes
router.post(
  '/send',
  authenticate,
  messageValidation,
  messageController.sendMessage
);

router.get(
  '/inbox',
  authenticate,
  messageController.getInbox
);

router.get(
  '/sent',
  authenticate,
  messageController.getSentMessages
);

router.get(
  '/:messageId',
  authenticate,
  messageController.getMessage
);

router.delete(
  '/:messageId',
  authenticate,
  messageController.deleteMessage
);

router.post(
  '/announcement',
  authenticate,
  checkRole(['admin', 'teacher']),
  announcementValidation,
  messageController.createAnnouncement
);

module.exports = router;
