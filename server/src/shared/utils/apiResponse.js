/**
 * API Response Utility
 * 
 * Standardizes all API responses across the application.
 * This ensures consistent response structure for frontend consumption
 * and makes debugging easier in production.
 */

class ApiResponse {
  /**
   * Successful response wrapper
   * @param {Object} res - Express response object
   * @param {Object} options - Response configuration
   */
  static success(res, { data = null, message = 'Success', statusCode = 200, meta = {} }) {
    return res.status(statusCode).json({
      success: true,
      message,
      data,
      ...(Object.keys(meta).length > 0 && { meta }),
      timestamp: new Date().toISOString()
    });
  }

  /**
   * Created resource response (201)
   */
  static created(res, { data, message = 'Resource created successfully' }) {
    return this.success(res, { data, message, statusCode: 201 });
  }

  /**
   * Error response wrapper
   * @param {Object} res - Express response object
   * @param {Object} options - Error configuration
   */
  static error(res, { message = 'An error occurred', statusCode = 500, errors = null }) {
    return res.status(statusCode).json({
      success: false,
      message,
      ...(errors && { errors }),
      timestamp: new Date().toISOString()
    });
  }

  /**
   * Not found response (404)
   */
  static notFound(res, { message = 'Resource not found' }) {
    return this.error(res, { message, statusCode: 404 });
  }

  /**
   * Validation error response (400)
   */
  static badRequest(res, { message = 'Invalid request', errors = null }) {
    return this.error(res, { message, statusCode: 400, errors });
  }

  /**
   * Unauthorized response (401)
   */
  static unauthorized(res, { message = 'Authentication required' }) {
    return this.error(res, { message, statusCode: 401 });
  }

  /**
   * Forbidden response (403)
   */
  static forbidden(res, { message = 'Access denied' }) {
    return this.error(res, { message, statusCode: 403 });
  }

  /**
   * Paginated response helper
   */
  static paginated(res, { data, page, limit, total, message = 'Success' }) {
    return this.success(res, {
      data,
      message,
      meta: {
        pagination: {
          currentPage: page,
          perPage: limit,
          totalItems: total,
          totalPages: Math.ceil(total / limit)
        }
      }
    });
  }
}

export default ApiResponse;
