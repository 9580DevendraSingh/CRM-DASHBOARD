const express = require('express');
const customerController = require('../controllers/customerController');
const auth = require('../middleware/auth');
const { customerValidation } = require('../middleware/validation');

const router = express.Router();

// All routes require authentication
router.use(auth);

// GET /api/customers
router.get('/', customerController.getCustomers);

// GET /api/customers/:id
router.get('/:id', customerController.getCustomer);

// POST /api/customers
router.post('/', customerValidation, customerController.createCustomer);

// PUT /api/customers/:id
router.put('/:id', customerValidation, customerController.updateCustomer);

// DELETE /api/customers/:id
router.delete('/:id', customerController.deleteCustomer);

module.exports = router;