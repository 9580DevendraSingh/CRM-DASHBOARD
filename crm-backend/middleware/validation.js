const { body } = require('express-validator');

// Client validation rules
exports.clientValidation = [
  body('name')
    .trim()
    .isLength({ min: 2 })
    .withMessage('Name must be at least 2 characters long'),
  body('email')
    .isEmail()
    .withMessage('Please enter a valid email'),
  body('company')
    .trim()
    .notEmpty()
    .withMessage('Company is required')
];

// Customer validation rules
exports.customerValidation = [
  body('name')
    .trim()
    .isLength({ min: 2 })
    .withMessage('Name must be at least 2 characters long'),
  body('email')
    .isEmail()
    .withMessage('Please enter a valid email'),
  body('company')
    .trim()
    .notEmpty()
    .withMessage('Company is required')
];

// Deal validation rules
exports.dealValidation = [
  body('title')
    .trim()
    .isLength({ min: 2 })
    .withMessage('Title must be at least 2 characters long'),
  body('company')
    .trim()
    .notEmpty()
    .withMessage('Company is required'),
  body('amount')
    .isNumeric()
    .withMessage('Amount must be a number')
];

// Report validation rules
exports.reportValidation = [
  body('title')
    .trim()
    .isLength({ min: 2 })
    .withMessage('Title must be at least 2 characters long'),
  body('type')
    .isIn(['sales', 'customers', 'revenue', 'products'])
    .withMessage('Invalid report type')
];