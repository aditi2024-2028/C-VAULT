/**
 * Case Closure Schema
 * 
 * Records final disposition of an incident and its evidence.
 * Renamed from "Disposal" to be more semantically accurate.
 */
import mongoose from 'mongoose';

const caseClosureSchema = new mongoose.Schema({
  // Reference to incident being closed
  incidentRef: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Incident',
    required: [true, 'Incident reference is required'],
    index: true
  },

  // How the evidence was disposed
  dispositionMethod: {
    type: String,
    enum: {
      values: ['RETURNED_TO_OWNER', 'DESTROYED', 'SOLD_AT_AUCTION', 'COURT_RETENTION'],
      message: '{VALUE} is not a valid disposition method'
    },
    required: [true, 'Disposition method is required']
  },

  // Court authorization reference
  courtOrderNumber: {
    type: String,
    trim: true
  },

  // When closure was executed
  closureDate: {
    type: Date,
    required: [true, 'Closure date is required']
  },

  // Additional documentation
  closureRemarks: {
    type: String,
    trim: true
  }

}, {
  timestamps: true
});

export const CaseClosure = mongoose.model('CaseClosure', caseClosureSchema);
