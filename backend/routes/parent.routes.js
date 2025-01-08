const express = require('express');
const { body } = require('express-validator');
const router = express.Router();
const parentController = require('../controllers/parentController');
const { authenticate } = require('../middleware/auth');
const { checkRole } = require('../middleware/roles');

// Validation middleware
const profileValidation = [
  body('occupation').optional().trim(),
  body('workPhone').optional().matches(/^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/)
    .withMessage('Invalid phone number format'),
  body('emergencyContact.name').optional().trim(),
  body('emergencyContact.phone').optional()
    .matches(/^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/)
    .withMessage('Invalid emergency contact phone number'),
  body('emergencyContact.relationship').optional().trim(),
  body('address.street').optional().trim(),
  body('address.city').optional().trim(),
  body('address.state').optional().trim(),
  body('address.zipCode').optional().trim(),
  body('address.country').optional().trim(),
  body('preferredLanguage').optional().isIn(['English', 'Spanish', 'French', 'Arabic'])
    .withMessage('Unsupported language')
];

// Routes
router.get(
  '/profile',
  authenticate,
  checkRole(['parent']),
  parentController.getParentProfile
);

router.put(
  '/profile',
  authenticate,
  checkRole(['parent']),
  profileValidation,
  parentController.updateParentProfile
);

router.get(
  '/children/progress',
  authenticate,
  checkRole(['parent']),
  parentController.getChildrenProgress
);

router.put(
  '/notifications',
  authenticate,
  checkRole(['parent']),
  body('notifications').isObject().withMessage('Invalid notifications format'),
  parentController.updateNotificationPreferences
);

router.get(
  '/child/:childId/report',
  authenticate,
  checkRole(['parent']),
  parentController.getChildDetailedReport
);

router.post(
  '/link-child',
  authenticate,
  checkRole(['parent']),
  body('studentId').notEmpty().withMessage('Student ID is required'),
  parentController.linkChild
);

module.exports = router;
