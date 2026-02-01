/**
 * Staff Handler (Controller)
 * 
 * HTTP request handlers for staff-related endpoints.
 * Delegates business logic to the service layer.
 */
import staffService from './staff.service.js';
import ApiResponse from '../../shared/utils/apiResponse.js';
import asyncHandler from '../../shared/utils/asyncHandler.js';
import environment from '../../config/environment.js';

/**
 * POST /api/v1/staff/register
 * Creates a new staff member (Admin only)
 */
export const registerStaff = asyncHandler(async (req, res) => {
  const staffMember = await staffService.registerStaffMember(req.body);
  
  return ApiResponse.created(res, {
    message: 'Staff member registered successfully',
    data: { staffMember }
  });
});

/**
 * POST /api/v1/staff/login
 * Authenticates staff and sets JWT cookie
 */
export const loginStaff = asyncHandler(async (req, res) => {
  const { badgeNumber, password } = req.body;
  
  const { accessToken, staffMember } = await staffService.authenticateStaff(
    badgeNumber, 
    password
  );

  // Set secure HTTP-only cookie
  const cookieOptions = {
    httpOnly: true,
    secure: environment.nodeEnv === 'production',
    sameSite: environment.nodeEnv === 'production' ? 'none' : 'lax',
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  };

  res.cookie('accessToken', accessToken, cookieOptions);

  return ApiResponse.success(res, {
    message: 'Authentication successful',
    data: { staffMember }
  });
});

/**
 * POST /api/v1/staff/logout
 * Clears authentication cookie
 */
export const logoutStaff = asyncHandler(async (req, res) => {
  res.clearCookie('accessToken', {
    httpOnly: true,
    secure: environment.nodeEnv === 'production',
    sameSite: environment.nodeEnv === 'production' ? 'none' : 'lax'
  });

  return ApiResponse.success(res, {
    message: 'Logged out successfully'
  });
});

/**
 * GET /api/v1/staff/profile
 * Returns current authenticated staff member's profile
 */
export const getCurrentProfile = asyncHandler(async (req, res) => {
  return ApiResponse.success(res, {
    data: { staffMember: req.currentUser }
  });
});
