const { error } = require('../utils/apiResponse');
const supabaseClient = require('../config/supabaseClient');

/**
 * Middleware to verify Supabase JWT token
 * Validates the Authorization header and attaches the user object to the request.
 */
const requireAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return error(res, 'Missing or invalid Authorization header', 401);
    }

    const token = authHeader.split(' ')[1];

    // Verify token using the Supabase Auth REST API.
    const response = await supabaseClient.auth.get('/user', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const user = response.data;

    if (!user) {
      return error(res, 'Invalid or expired token', 401);
    }

    req.user = user;
    next();
  } catch (err) {
    console.error('Auth middleware error:', err);
    if (err.response?.status === 401) {
      return error(res, 'Invalid or expired token', 401);
    }
    return error(res, 'Authentication processing failed', 500);
  }
};

module.exports = {
  requireAuth
};
