/**
 * Async Handler Wrapper
 * 
 * Eliminates repetitive try-catch blocks in async route handlers.
 * Automatically catches errors and forwards them to the global
 * error handler middleware.
 */

const asyncHandler = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

export default asyncHandler;
