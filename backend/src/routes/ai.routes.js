const express = require('express');
const { getCropRecommendation, getGeneralAdvice } = require('../controllers/ai.controller');

const router = express.Router();

/**
 * POST /api/ai/recommend-crop
 * Uses Gemini to recommend a crop based on params
 */
router.post('/recommend-crop', getCropRecommendation);

/**
 * POST /api/ai/advice
 * Uses Gemini to provide general farming advice
 */
router.post('/advice', getGeneralAdvice);


module.exports = router;
