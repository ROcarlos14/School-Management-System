const express = require('express');
const { body } = require('express-validator');
const router = express.Router();
const notificationController = require('../controllers/notificationController');
const { authenticate } = require('../middleware/auth');

// Routes
router.get(
  '/',
  authenticate,
  notificationController.getNotifications
);

router.put(
  '/:notificationId/read',
  authenticate,
  notificationController.markAsRead
);

router.put(
  '/mark-all-read',
  authenticate,
  notificationController.markAllAsRead
);

router.put(
  '/:notificationId/archive',
  authenticate,
  notificationController.archiveNotification
);

router.post(
  '/delete',
  authenticate,
  body('notificationIds').isArray().notEmpty(),
  notificationController.deleteNotifications
);

router.get(
  '/preferences',
  authenticate,
  notificationController.getPreferences
);

router.put(
  '/preferences',
  authenticate,
  body('preferences').isObject().notEmpty(),
  notificationController.updatePreferences
);

module.exports = router;
