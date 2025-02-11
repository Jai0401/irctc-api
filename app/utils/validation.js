const { body } = require('express-validator');

const validateRegisterUser = [
    body('username').trim().notEmpty().withMessage('Username is required').isLength({ min: 3 }).withMessage('Username must be at least 3 characters long'),
    body('password').trim().notEmpty().withMessage('Password is required').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
];

const validateLoginUser = [
  body('username').trim().notEmpty().withMessage('Username is required'),
  body('password').trim().notEmpty().withMessage('Password is required')
];

const validateAddTrain = [
  body('name').trim().notEmpty().withMessage('Train name is required'),
  body('source').trim().notEmpty().withMessage('Source station is required'),
  body('destination').trim().notEmpty().withMessage('Destination station is required'),
  body('totalSeats').isInt({ min: 1 }).withMessage('Total seats must be a positive integer'),
];

const validateBookSeat = [
  body('trainId').isInt({ min: 1 }).withMessage('Train ID must be provided')
]
module.exports = {
  validateRegisterUser,
  validateLoginUser,
  validateAddTrain,
  validateBookSeat,
};