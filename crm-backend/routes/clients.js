const express = require('express');
const clientController = require('../controllers/clientController');
const auth = require('../middleware/auth');
const { clientValidation } = require('../middleware/validation');

const router = express.Router();

// All routes require authentication
router.use(auth);

// GET /api/clients
router.get('/', clientController.getClients);

// GET /api/clients/:id
router.get('/:id', clientController.getClient);

// POST /api/clients
router.post('/', clientValidation, clientController.createClient);

// PUT /api/clients/:id
router.put('/:id', clientValidation, clientController.updateClient);

// DELETE /api/clients/:id
router.delete('/:id', clientController.deleteClient);

module.exports = router;