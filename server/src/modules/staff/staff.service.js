/**
 * Staff Service
 * 
 * Business logic layer for staff-related operations.
 * Separates data access from HTTP concerns for cleaner architecture.
 */
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { StaffMember } from './staff.model.js';
import AppError from '../../shared/utils/AppError.js';
import environment from '../../config/environment.js';

class StaffService {
  /**
   * Creates a new staff member account
   * Validates uniqueness and hashes password before storage
   */
  async registerStaffMember(staffData) {
    const { fullName, badgeNumber, stationAssignment, password, designation } = staffData;

    // Check for existing badge number
    const existingStaff = await StaffMember.findOne({ badgeNumber: badgeNumber.toUpperCase() });
    if (existingStaff) {
      throw AppError.conflict('A staff member with this badge number already exists');
    }

    // Hash password with appropriate cost factor
    const saltRounds = 12;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    // Create and return new staff member
    const newStaff = await StaffMember.create({
      fullName,
      badgeNumber: badgeNumber.toUpperCase(),
      stationAssignment,
      designation: designation || 'OFFICER',
      passwordHash
    });

    return newStaff;
  }

  /**
   * Authenticates staff member and generates JWT
   * Returns token and user data on success
   */
  async authenticateStaff(badgeNumber, password) {
    // Find staff member with password field included
    const staffMember = await StaffMember.findOne({ 
      badgeNumber: badgeNumber.toUpperCase() 
    }).select('+passwordHash');

    if (!staffMember) {
      throw AppError.unauthorized('Invalid credentials provided');
    }

    // Verify password match
    const isPasswordValid = await bcrypt.compare(password, staffMember.passwordHash);
    if (!isPasswordValid) {
      throw AppError.unauthorized('Invalid credentials provided');
    }

    // Generate JWT with user payload
    const tokenPayload = {
      id: staffMember._id,
      designation: staffMember.designation
    };

    const accessToken = jwt.sign(tokenPayload, environment.jwt.secret, {
      expiresIn: environment.jwt.expiresIn
    });

    // Return sanitized user object (password excluded by schema)
    const sanitizedUser = staffMember.toJSON();
    
    return { accessToken, staffMember: sanitizedUser };
  }

  /**
   * Retrieves staff member by ID
   */
  async getStaffById(staffId) {
    const staffMember = await StaffMember.findById(staffId);
    if (!staffMember) {
      throw AppError.notFound('Staff member not found');
    }
    return staffMember;
  }
}

export default new StaffService();
