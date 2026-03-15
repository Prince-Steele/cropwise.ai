/**
 * Standardized API response formatter
 */

const success = (res, data, message = 'Success', statusCode = 200) => {
  return res.status(statusCode).json({
    status: 'success',
    message,
    data,
  });
};

const error = (res, message = 'Error', statusCode = 500, details = null) => {
  const response = {
    status: 'error',
    message,
  };
  
  if (details && process.env.NODE_ENV !== 'production') {
    response.details = details;
  }
  
  return res.status(statusCode).json(response);
};

module.exports = {
  success,
  error,
};
