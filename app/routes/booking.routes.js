// app/routes/booking.routes.js
const express = require('express');
const router = express.Router();
const db = require('../models');
const { authenticateToken } = require('../middleware/auth.middleware');
const { bookSeat } = require('../services/booking.service');
const { validateBookSeat } = require('../utils/validation');
const { validationResult } = require('express-validator');

// Book a Seat
router.post('/', authenticateToken, validateBookSeat, async (req, res) => {
  const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
  const { trainId } = req.body;
  const userId = req.user.id;

  try {
      const [success, message] = await bookSeat(userId, parseInt(trainId));
      if (success) {
          res.status(201).json({ message });
      } else {
          res.status(400).json({ message });
      }
  } catch (error) {
      console.error("Error booking seat:", error);
      res.status(500).json({ message: 'Server error' });
  }
});

// Get Booking Details
router.get('/:bookingId', authenticateToken, async (req, res) => {
  const { bookingId } = req.params;
  const userId = req.user.id;

  try {
    const booking = await db.Booking.findOne({
      where: { id: bookingId, userId },
      include: [{ model: db.Train, attributes: ['name'] }],
    });

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found or not authorized' });
    }

    return res.json({
      bookingId: booking.id,
      trainName: booking.Train.name,
      bookingDate: booking.bookingDate,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;