const express = require('express');
const { body } = require('express-validator');
const router = express.Router();
const calendarController = require('../controllers/calendarController');
const { authenticate } = require('../middleware/auth');
const { checkRole } = require('../middleware/roles');

// Validation middleware
const calendarValidation = [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('type').isIn(['academic', 'exam', 'event', 'holiday', 'custom'])
    .withMessage('Invalid calendar type'),
  body('academicYear').trim().notEmpty().withMessage('Academic year is required'),
  body('term').isIn(['First Term', 'Second Term', 'Final'])
    .withMessage('Invalid term'),
  body('startDate').isISO8601().withMessage('Invalid start date'),
  body('endDate').isISO8601().withMessage('Invalid end date')
    .custom((value, { req }) => {
      if (new Date(value) <= new Date(req.body.startDate)) {
        throw new Error('End date must be after start date');
      }
      return true;
    }),
  body('visibility').optional().isIn(['public', 'private', 'restricted'])
    .withMessage('Invalid visibility option'),
  body('allowedRoles').optional().isArray(),
  body('allowedGrades').optional().isArray(),
  body('allowedSections').optional().isArray()
];

const eventValidation = [
  body('title').trim().notEmpty().withMessage('Title is required'),
  body('startDate').isISO8601().withMessage('Invalid start date'),
  body('endDate').isISO8601().withMessage('Invalid end date')
    .custom((value, { req }) => {
      if (new Date(value) <= new Date(req.body.startDate)) {
        throw new Error('End date must be after start date');
      }
      return true;
    }),
  body('category').optional().isIn(['class', 'exam', 'assignment', 'meeting', 'activity', 'holiday', 'other'])
    .withMessage('Invalid event category'),
  body('priority').optional().isIn(['low', 'normal', 'high', 'urgent'])
    .withMessage('Invalid priority level'),
  body('status').optional().isIn(['scheduled', 'cancelled', 'postponed', 'completed'])
    .withMessage('Invalid status'),
  body('recurrence.type').optional().isIn(['none', 'daily', 'weekly', 'monthly', 'yearly'])
    .withMessage('Invalid recurrence type'),
  body('recurrence.interval').optional().isInt({ min: 1 })
    .withMessage('Invalid recurrence interval'),
  body('recurrence.daysOfWeek').optional().isArray(),
  body('recurrence.endDate').optional().isISO8601()
    .withMessage('Invalid recurrence end date'),
  body('reminders').optional().isArray(),
  body('reminders.*.type').optional().isIn(['email', 'notification', 'both'])
    .withMessage('Invalid reminder type'),
  body('reminders.*.time.value').optional().isInt({ min: 1 })
    .withMessage('Invalid reminder time value'),
  body('reminders.*.time.unit').optional().isIn(['minutes', 'hours', 'days'])
    .withMessage('Invalid reminder time unit'),
  body('attendees').optional().isArray(),
  body('attachments').optional().isArray()
];

// Calendar routes
router.post(
  '/',
  authenticate,
  checkRole(['admin', 'teacher']),
  calendarValidation,
  calendarController.createCalendar
);

router.get(
  '/',
  authenticate,
  calendarController.getCalendars
);

router.get(
  '/:calendarId',
  authenticate,
  calendarController.getCalendar
);

router.put(
  '/:calendarId',
  authenticate,
  checkRole(['admin', 'teacher']),
  calendarValidation,
  calendarController.updateCalendar
);

router.delete(
  '/:calendarId',
  authenticate,
  checkRole(['admin', 'teacher']),
  calendarController.deleteCalendar
);

// Event routes
router.post(
  '/:calendarId/events',
  authenticate,
  checkRole(['admin', 'teacher']),
  eventValidation,
  calendarController.addEvent
);

router.put(
  '/:calendarId/events/:eventId',
  authenticate,
  checkRole(['admin', 'teacher']),
  eventValidation,
  calendarController.updateEvent
);

router.delete(
  '/:calendarId/events/:eventId',
  authenticate,
  checkRole(['admin', 'teacher']),
  calendarController.deleteEvent
);

router.post(
  '/:calendarId/events/:eventId/respond',
  authenticate,
  body('status').isIn(['accepted', 'declined', 'tentative'])
    .withMessage('Invalid response status'),
  calendarController.respondToEvent
);

module.exports = router;
