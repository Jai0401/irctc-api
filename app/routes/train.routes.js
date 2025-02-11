// app/routes/train.routes.js
const express = require('express');
const router = express.Router();
const db = require('../models');
const { authenticateToken } = require('../middleware/auth.middleware');
const { adminRequired } = require('../middleware/admin.middleware');
const { getAvailableTrains } = require('../services/train.service');
const { validateAddTrain } = require('../utils/validation');
const { validationResult } = require('express-validator');


// Add Train (Admin Only)
router.post('/', authenticateToken, adminRequired, validateAddTrain, async (req, res) => {
  const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
  const { name, source, destination, totalSeats } = req.body;

  try {
    const newTrain = await db.Train.create({ name, source, destination, totalSeats });
    return res.status(201).json({ message: 'Train added successfully', trainId: newTrain.id });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error' });
  }
});

// Get Seat Availability
router.get('/availability', authenticateToken, async (req, res) => {
  const { source, destination } = req.query;

  if (!source || !destination) {
    return res.status(400).json({ message: 'Source and destination are required' });
  }

  try {
      const trains = await getAvailableTrains(source, destination);
      const result = trains.map(train => ({
          train_id: train.id,
          train_name: train.name,
          available_seats: train.availableSeats,
      }));
      res.json(result);
  } catch (error) {
      console.error("Error fetching availability:", error);
      res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;