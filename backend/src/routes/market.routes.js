const express = require('express');
const { getLatestPrices, getHistoricalPrices } = require('../controllers/market.controller');

const router = express.Router();

/**
 * GET /api/market/latest?symbols=WHEAT,CORN
 */
router.get('/latest', getLatestPrices);

/**
 * GET /api/market/historical?date=2025-03-01&symbols=WHEAT,CORN
 */
router.get('/historical', getHistoricalPrices);

module.exports = router;
