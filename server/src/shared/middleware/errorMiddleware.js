/**
 * Global Error Handler Middleware
 * 
 * Centralizes error handling for the entire application.
 * Formats errors consistently and hides sensitive information
 * in production environment.
 */
import environment from '../../config/environment.js';

const errorMiddleware = (err, req, res, next) => {
  // Default error properties
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Something went wrong';
  
  // Log error for debugging (in production, use proper logging service)
  if (environment.nodeEnv !== 'test') {
    console.error('🔥 Error:', {
      message: err.message,
      stack: err.stack,
      path: req.path,
      method: req.method
    });
  }

  // Handle specific MongoDB errors
  if (err.name === 'CastError') {
    statusCode = 400;
    message = 'Invalid ID format provided';
  }

  if (err.code === 11000) {
    statusCode = 409;
    const field = Object.keys(err.keyValue)[0];
    message = `${field} already exists`;
  }

  if (err.name === 'ValidationError') {
    statusCode = 400;
    const errors = Object.values(err.errors).map(e => e.message);
    message = errors.join(', ');
  }

  if (err.name === 'JsonWebTokenError') {
    statusCode = 401;
    message = 'Invalid authentication token';
  }

  if (err.name === 'TokenExpiredError') {
    statusCode = 401;
    message = 'Authentication token has expired';
  }

  // Send response
  res.status(statusCode).json({
    success: false,
    message,
    // Only include stack trace in development
    ...(environment.nodeEnv === 'development' && { stack: err.stack }),
    timestamp: new Date().toISOString()
  });
};

export default errorMiddleware;
