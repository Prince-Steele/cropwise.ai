const express = require('express');
const { getProfile } = require('../controllers/auth.controller');
const { requireAuth } = require('../middleware/auth.middleware');

const router = express.Router();

/**
 * GET /api/auth/profile
 * Requires valid Supabase JWT token in Authorization header
 */
router.get('/profile', requireAuth, getProfile);

module.exports = router;
