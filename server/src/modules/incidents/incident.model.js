/**
 * Incident Schema
 * 
 * Represents a registered case/FIR that evidence is associated with.
 * Renamed from "Case" to avoid JavaScript reserved word conflicts
 * and to be more semantically accurate.
 */
import mongoose from 'mongoose';

const incidentSchema = new mongoose.Schema({
  // Station where incident was registered
  registrationStation: {
    type: String,
    required: [true, 'Registration station is required'],
    trim: true
  },

  // FIR/Case registration number
  firNumber: {
    type: String,
    required: [true, 'FIR number is required'],
    trim: true
  },

  // Year of registration for historical tracking
  registrationYear: {
    type: Number,
    required: [true, 'Registration year is required'],
    min: [1900, 'Invalid year'],
    max: [new Date().getFullYear() + 1, 'Year cannot be in the future']
  },

  // Officer handling the investigation
  assignedInvestigator: {
    name: {
      type: String,
      trim: true
    },
    badgeNumber: {
      type: String,
      trim: true
    }
  },

  // Important dates
  firFilingDate: {
    type: Date,
    required: [true, 'FIR filing date is required']
  },

  evidenceSeizureDate: {
    type: Date,
    required: [true, 'Evidence seizure date is required']
  },

  // Legal classification
  applicableSections: {
    type: String,
    required: [true, 'Applicable sections are required'],
    trim: true
  },

  // Current status in the lifecycle
  currentStatus: {
    type: String,
    enum: {
      values: ['ACTIVE', 'CLOSED'],
      message: '{VALUE} is not a valid status'
    },
    default: 'ACTIVE'
  }

}, {
  timestamps: true
});

// Compound index for efficient search by station and year
incidentSchema.index({ registrationStation: 1, registrationYear: -1 });
incidentSchema.index({ currentStatus: 1 });

export const Incident = mongoose.model('Incident', incidentSchema);
