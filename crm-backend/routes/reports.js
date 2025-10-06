const express = require('express');
const reportController = require('../controllers/reportController');
const auth = require('../middleware/auth');
const { reportValidation } = require('../middleware/validation');

const router = express.Router();

// All routes require authentication
router.use(auth);

// GET /api/reports
router.get('/', reportController.getReports);

// GET /api/reports/:id
router.get('/:id', reportController.getReport);

// POST /api/reports
router.post('/', reportValidation, reportController.createReport);

// PUT /api/reports/:id
router.put('/:id', reportValidation, reportController.updateReport);

// DELETE /api/reports/:id
router.delete('/:id', reportController.deleteReport);

// PATCH /api/reports/:id/download
router.patch('/:id/download', reportController.incrementDownloadCount);

module.exports = router;