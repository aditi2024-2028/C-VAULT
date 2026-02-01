/**
 * Authentication & Authorization Middleware
 * 
 * Handles JWT token verification and role-based access control.
 * Extracts user information from tokens and attaches to request object.
 */
import jwt from 'jsonwebtoken';
import environment from '../../config/environment.js';
import { StaffMember } from '../../modules/staff/staff.model.js';
import AppError from '../utils/AppError.js';
import asyncHandler from '../utils/asyncHandler.js';

/**
 * Verifies JWT token from cookies and attaches user to request
 * Required for protected routes
 */
export const authenticate = asyncHandler(async (req, res, next) => {
  const token = req.cookies?.accessToken;

  if (!token) {
    throw AppError.unauthorized('Please login to access this resource');
  }

  // Verify token and extract payload
  const decoded = jwt.verify(token, environment.jwt.secret);

  // Fetch user and verify they still exist
  const staffMember = await StaffMember.findById(decoded.id).select('-passwordHash');
  
  if (!staffMember) {
    throw AppError.unauthorized('User account no longer exists');
  }

  // Attach user to request for downstream handlers
  req.currentUser = staffMember;
  next();
});

/**
 * Role-based authorization middleware factory
 * Returns middleware that checks if user has required role
 */
export const authorize = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.currentUser) {
      throw AppError.unauthorized('Authentication required');
    }

    if (!allowedRoles.includes(req.currentUser.designation)) {
      throw AppError.forbidden(
        `Access restricted to: ${allowedRoles.join(', ')}`
      );
    }

    next();
  };
};

/**
 * Shorthand for admin-only routes
 */
export const adminOnly = authorize('ADMIN');
