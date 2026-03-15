const express = require('express');
const { predictRecommendation, saveRecommendation, getMyRecommendations } = require('../controllers/recommendation.controller');
const { requireAuth } = require('../middleware/auth.middleware');

const router = express.Router();

/**
 * POST /api/recommendation
 * Public initially, connects to mock and later ML service
 */
router.post('/', predictRecommendation);

/**
 * POST /api/recommendation/save
 * Requires Auth. Save recommendation to user's history
 */
router.post('/save', requireAuth, saveRecommendation);

/**
 * GET /api/recommendation/my-history
 * Requires Auth. Fetch user's saved recommendations
 */
router.get('/my-history', requireAuth, getMyRecommendations);

module.exports = router;
