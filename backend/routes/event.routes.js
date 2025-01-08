const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const auth = require('../middleware/auth');
const authorize = require('../middleware/authorize');
const Event = require('../models/Event');

// Create a new event (Admin and Teachers only)
router.post('/',
    auth,
    authorize('admin', 'teacher'),
    [
        body('title').notEmpty().trim().withMessage('Title is required'),
        body('description').notEmpty().withMessage('Description is required'),
        body('date').isDate().withMessage('Valid date is required'),
        body('time').notEmpty().withMessage('Time is required'),
        body('venue').notEmpty().withMessage('Venue is required'),
        body('type').isIn(['academic', 'sports', 'cultural', 'other']).withMessage('Valid event type is required')
    ],
    async (req, res) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }

            const event = new Event({
                ...req.body,
                organizer: req.user.id
            });

            await event.save();
            res.status(201).json({ success: true, data: event });
        } catch (error) {
            console.error(error);
            res.status(500).json({ success: false, message: 'Server error' });
        }
    }
);

// Get all events
router.get('/', auth, async (req, res) => {
    try {
        const events = await Event.find()
            .populate('organizer', 'name email')
            .populate('participants', 'name email')
            .sort({ date: 1 });
        res.json({ success: true, data: events });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// Get event by ID
router.get('/:id', auth, async (req, res) => {
    try {
        const event = await Event.findById(req.params.id)
            .populate('organizer', 'name email')
            .populate('participants', 'name email');

        if (!event) {
            return res.status(404).json({ success: false, message: 'Event not found' });
        }

        res.json({ success: true, data: event });
    } catch (error) {
        console.error(error);
        if (error.kind === 'ObjectId') {
            return res.status(404).json({ success: false, message: 'Event not found' });
        }
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// Update event (Admin and event organizer only)
router.put('/:id',
    auth,
    async (req, res) => {
        try {
            let event = await Event.findById(req.params.id);
            if (!event) {
                return res.status(404).json({ success: false, message: 'Event not found' });
            }

            // Check if user is admin or event organizer
            if (req.user.role !== 'admin' && event.organizer.toString() !== req.user.id) {
                return res.status(403).json({ success: false, message: 'Not authorized to update this event' });
            }

            event = await Event.findByIdAndUpdate(
                req.params.id,
                { $set: req.body },
                { new: true }
            )
            .populate('organizer', 'name email')
            .populate('participants', 'name email');

            res.json({ success: true, data: event });
        } catch (error) {
            console.error(error);
            if (error.kind === 'ObjectId') {
                return res.status(404).json({ success: false, message: 'Event not found' });
            }
            res.status(500).json({ success: false, message: 'Server error' });
        }
    }
);

// Delete event (Admin and event organizer only)
router.delete('/:id',
    auth,
    async (req, res) => {
        try {
            const event = await Event.findById(req.params.id);
            if (!event) {
                return res.status(404).json({ success: false, message: 'Event not found' });
            }

            // Check if user is admin or event organizer
            if (req.user.role !== 'admin' && event.organizer.toString() !== req.user.id) {
                return res.status(403).json({ success: false, message: 'Not authorized to delete this event' });
            }

            await event.deleteOne();
            res.json({ success: true, message: 'Event removed' });
        } catch (error) {
            console.error(error);
            if (error.kind === 'ObjectId') {
                return res.status(404).json({ success: false, message: 'Event not found' });
            }
            res.status(500).json({ success: false, message: 'Server error' });
        }
    }
);

// Register for an event
router.post('/:id/register',
    auth,
    async (req, res) => {
        try {
            const event = await Event.findById(req.params.id);
            if (!event) {
                return res.status(404).json({ success: false, message: 'Event not found' });
            }

            // Check if user is already registered
            if (event.participants.includes(req.user.id)) {
                return res.status(400).json({ success: false, message: 'Already registered for this event' });
            }

            event.participants.push(req.user.id);
            await event.save();

            const updatedEvent = await Event.findById(req.params.id)
                .populate('organizer', 'name email')
                .populate('participants', 'name email');

            res.json({ success: true, data: updatedEvent });
        } catch (error) {
            console.error(error);
            if (error.kind === 'ObjectId') {
                return res.status(404).json({ success: false, message: 'Event not found' });
            }
            res.status(500).json({ success: false, message: 'Server error' });
        }
    }
);

// Unregister from an event
router.post('/:id/unregister',
    auth,
    async (req, res) => {
        try {
            const event = await Event.findById(req.params.id);
            if (!event) {
                return res.status(404).json({ success: false, message: 'Event not found' });
            }

            // Check if user is registered
            if (!event.participants.includes(req.user.id)) {
                return res.status(400).json({ success: false, message: 'Not registered for this event' });
            }

            event.participants = event.participants.filter(
                participant => participant.toString() !== req.user.id
            );
            await event.save();

            const updatedEvent = await Event.findById(req.params.id)
                .populate('organizer', 'name email')
                .populate('participants', 'name email');

            res.json({ success: true, data: updatedEvent });
        } catch (error) {
            console.error(error);
            if (error.kind === 'ObjectId') {
                return res.status(404).json({ success: false, message: 'Event not found' });
            }
            res.status(500).json({ success: false, message: 'Server error' });
        }
    }
);

module.exports = router;
