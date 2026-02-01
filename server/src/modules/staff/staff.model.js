/**
 * Staff Member Schema
 * 
 * Represents police officers and administrative staff who use the system.
 * Renamed from "User" to be more domain-specific and professional.
 */
import mongoose from 'mongoose';

const staffMemberSchema = new mongoose.Schema({
  // Personal identification
  fullName: {
    type: String,
    required: [true, 'Staff name is required'],
    trim: true,
    maxlength: [100, 'Name cannot exceed 100 characters']
  },

  // Unique employee identifier within the department
  badgeNumber: {
    type: String,
    required: [true, 'Badge number is required'],
    unique: true,
    uppercase: true,
    trim: true
  },

  // Role within the system - determines access levels
  designation: {
    type: String,
    enum: {
      values: ['ADMIN', 'OFFICER'],
      message: '{VALUE} is not a valid designation'
    },
    default: 'OFFICER'
  },

  // Assigned station for jurisdictional tracking
  stationAssignment: {
    type: String,
    required: [true, 'Station assignment is required'],
    trim: true
  },

  // Securely hashed password
  passwordHash: {
    type: String,
    required: [true, 'Password is required'],
    select: false // Never include in queries by default
  }

}, {
  timestamps: true,
  toJSON: {
    transform: (doc, ret) => {
      delete ret.passwordHash;
      delete ret.__v;
      return ret;
    }
  }
});

// Index for faster lookups on common query patterns
staffMemberSchema.index({ stationAssignment: 1 });

export const StaffMember = mongoose.model('StaffMember', staffMemberSchema);
