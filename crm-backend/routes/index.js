const express = require('express');
const authRoutes = require('./auth');
const clientRoutes = require('./clients');
const customerRoutes = require('./customers');
const salesRoutes = require('./sales');
const reportRoutes = require('./reports');

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/clients', clientRoutes);
router.use('/customers', customerRoutes);
router.use('/sales', salesRoutes);
router.use('/reports', reportRoutes);

module.exports = router;