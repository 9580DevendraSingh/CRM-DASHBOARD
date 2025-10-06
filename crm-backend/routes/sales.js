const express = require('express');
const salesController = require('../controllers/salesController');
const auth = require('../middleware/auth');
const { dealValidation } = require('../middleware/validation');

const router = express.Router();

// All routes require authentication
router.use(auth);

// GET /api/sales
router.get('/', salesController.getDeals);

// GET /api/sales/stats
router.get('/stats', salesController.getSalesStats);

// GET /api/sales/:id
router.get('/:id', salesController.getDeal);

// POST /api/sales
router.post('/', dealValidation, salesController.createDeal);

// PUT /api/sales/:id
router.put('/:id', dealValidation, salesController.updateDeal);

// DELETE /api/sales/:id
router.delete('/:id', salesController.deleteDeal);

module.exports = router;