const { success, error } = require('../utils/apiResponse');

/**
 * Controller for Auth related backend actions
 * (Most auth is handled by Supabase directly on the frontend,
 * but backend can use this for sync operations or profile updates)
 */
const getProfile = async (req, res, next) => {
  try {
    // req.user is populated by the requireAuth middleware
    if (!req.user) {
      return error(res, 'User context not found', 404);
    }

    return success(res, { user: req.user }, 'Profile retrieved successfully');
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getProfile
};
