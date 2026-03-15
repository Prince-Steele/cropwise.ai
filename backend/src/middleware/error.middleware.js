const { error } = require('../utils/apiResponse');

/**
 * Global error handling middleware
 */
const errorHandler = (err, req, res, next) => {
  console.error(`[Error] ${err.message}`);
  
  // Custom auth errors
  if (err.name === 'UnauthorizedError') {
    return error(res, 'Unauthorized Access', 401, err.message);
  }
  
  // Fallback for everything else
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';
  
  return error(res, message, statusCode, err.stack);
};

module.exports = errorHandler;
