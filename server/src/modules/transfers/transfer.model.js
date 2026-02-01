/**
 * Chain of Custody Transfer Schema
 * 
 * Tracks movement and handling of evidence items.
 * Maintains complete audit trail for legal compliance.
 * Renamed from "CustodyLog" for better semantics.
 */
import mongoose from 'mongoose';

const custodyTransferSchema = new mongoose.Schema({
  // Reference to evidence being transferred
  evidenceRef: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'EvidenceItem',
    required: [true, 'Evidence reference is required'],
    index: true
  },

  // Origin of transfer
  sourceLocation: {
    type: String,
    trim: true
  },

  releasingOfficer: {
    name: String,
    badgeNumber: String
  },

  // Destination of transfer
  destinationLocation: {
    type: String,
    required: [true, 'Destination is required'],
    trim: true
  },

  receivingOfficer: {
    name: String,
    badgeNumber: String
  },

  // Reason for movement
  transferPurpose: {
    type: String,
    enum: {
      values: ['STORAGE', 'COURT_PRODUCTION', 'FORENSIC_LAB', 'EXAMINATION', 'RELOCATION'],
      message: '{VALUE} is not a valid transfer purpose'
    },
    required: [true, 'Transfer purpose is required']
  },

  // When the transfer occurred
  transferTimestamp: {
    type: Date,
    default: Date.now
  },

  // Additional notes
  notes: {
    type: String,
    trim: true
  }

}, {
  timestamps: true
});

// Index for timeline queries
custodyTransferSchema.index({ evidenceRef: 1, transferTimestamp: 1 });

export const CustodyTransfer = mongoose.model('CustodyTransfer', custodyTransferSchema);
