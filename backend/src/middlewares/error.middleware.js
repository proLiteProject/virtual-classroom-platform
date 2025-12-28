// middlewares/error.middleware.js
import { ApiError } from '../utils/ApiError.js';

/**
 * Global error handler
 */
export const errorHandler = (err, req, res, next) => {
  let { statusCode, message } = err;

  // Default to 500 if not specified
  statusCode = statusCode || 500;
  message = message || 'Internal Server Error';

  // Log error in development
  if (process.env.NODE_ENV === 'development') {
    console.error('❌ ERROR:', {
      statusCode,
      message,
      stack: err.stack,
      url: req.originalUrl,
      method: req.method
    });
  }

  // Send response
  res.status(statusCode).json({
    success: false,
    message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
};

/**
 * Handle 404 errors
 */
export const notFound = (req, res, next) => {
  const error = new ApiError(404, `Route ${req.originalUrl} not found`);
  next(error);
};