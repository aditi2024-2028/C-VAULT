/**
 * Evidence Item Schema
 * 
 * Represents seized property/evidence linked to an incident.
 * Renamed from "Property" for clarity and domain accuracy.
 */
import mongoose from 'mongoose';

const evidenceItemSchema = new mongoose.Schema({
  // Reference to parent incident
  incidentRef: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Incident',
    required: [true, 'Incident reference is required'],
    index: true
  },

  // Classification of evidence type
  itemCategory: {
    type: String,
    required: [true, 'Item category is required'],
    trim: true
  },

  // Ownership attribution
  associatedParty: {
    type: String,
    enum: {
      values: ['SUSPECT', 'VICTIM', 'UNIDENTIFIED'],
      message: '{VALUE} is not a valid party type'
    },
    required: [true, 'Associated party is required']
  },

  // Detailed description of the item
  itemDescription: {
    type: String,
    required: [true, 'Item description is required'],
    trim: true
  },

  // Quantity tracking
  itemQuantity: {
    amount: {
      type: Number,
      required: [true, 'Quantity amount is required'],
      min: [0, 'Quantity cannot be negative']
    },
    measurementUnit: {
      type: String,
      default: 'piece',
      trim: true
    }
  },

  // Physical storage location in malkhana
  storageDetails: {
    rackNumber: String,
    roomNumber: String,
    compartmentId: String
  },

  // Additional notes
  remarks: {
    type: String,
    trim: true
  },

  // Digital assets
  photographUrl: String,
  trackingQrCode: String

}, {
  timestamps: true
});

// Index for efficient querying by incident
evidenceItemSchema.index({ incidentRef: 1, createdAt: -1 });

export const EvidenceItem = mongoose.model('EvidenceItem', evidenceItemSchema);
