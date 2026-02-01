/**
 * Custom Application Error Class
 * 
 * Extends native Error to include HTTP status codes and
 * operational error flags. Allows distinguishing between
 * expected errors (validation) and unexpected bugs.
 */

class AppError extends Error {
  constructor(message, statusCode = 500, isOperational = true) {
    super(message);
    
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    
    // Captures stack trace, excluding constructor call
    Error.captureStackTrace(this, this.constructor);
  }

  // Factory methods for common error types
  static badRequest(message = 'Invalid request') {
    return new AppError(message, 400);
  }

  static unauthorized(message = 'Authentication required') {
    return new AppError(message, 401);
  }

  static forbidden(message = 'Access denied') {
    return new AppError(message, 403);
  }

  static notFound(message = 'Resource not found') {
    return new AppError(message, 404);
  }

  static conflict(message = 'Resource already exists') {
    return new AppError(message, 409);
  }

  static internal(message = 'Internal server error') {
    return new AppError(message, 500, false);
  }
}

export default AppError;
