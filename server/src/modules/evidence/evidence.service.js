/**
 * Evidence Service
 * 
 * Business logic for evidence item management.
 * Handles item registration, QR generation, and search.
 */
import QRCode from 'qrcode';
import { EvidenceItem } from './evidence.model.js';
import cloudStorageService from '../../shared/services/cloudStorage.service.js';
import AppError from '../../shared/utils/AppError.js';

class EvidenceService {
  /**
   * Generates QR code buffer for an evidence item
   */
  async generateTrackingQR(evidenceId) {
    const qrContent = `EVIDENCE:${evidenceId}`;
    const qrBuffer = await QRCode.toBuffer(qrContent, {
      width: 300,
      margin: 2,
      color: { dark: '#000000', light: '#ffffff' }
    });
    return qrBuffer;
  }

  /**
   * Registers new evidence item with optional photo
   */
  async registerEvidenceItem(itemData, photoBuffer = null) {
    let photographUrl = null;

    // Upload photo if provided
    if (photoBuffer) {
      const uploadResult = await cloudStorageService.uploadBuffer(photoBuffer, {
        folder: 'evidence_photos'
      });
      photographUrl = uploadResult.url;
    }

    // Create evidence record
    const evidenceItem = await EvidenceItem.create({
      ...itemData,
      photographUrl
    });

    // Generate and upload QR code
    const qrBuffer = await this.generateTrackingQR(evidenceItem._id);
    const qrUploadResult = await cloudStorageService.uploadBuffer(qrBuffer, {
      folder: 'evidence_qrcodes'
    });

    // Update with QR code URL
    evidenceItem.trackingQrCode = qrUploadResult.url;
    await evidenceItem.save();

    return evidenceItem;
  }

  /**
   * Retrieves all evidence items for an incident
   */
  async getEvidenceByIncident(incidentId) {
    const items = await EvidenceItem.find({ incidentRef: incidentId })
      .sort({ createdAt: -1 });
    return items;
  }

  /**
   * Retrieves single evidence item
   */
  async getEvidenceById(evidenceId) {
    const item = await EvidenceItem.findById(evidenceId);
    
    if (!item) {
      throw AppError.notFound('Evidence item not found');
    }
    
    return item;
  }

  /**
   * Searches evidence items with filters
   */
  async searchEvidence(searchParams) {
    const { incidentId, category, associatedParty, keyword } = searchParams;
    const query = {};

    if (incidentId) {
      query.incidentRef = incidentId;
    }

    if (category) {
      query.itemCategory = { $regex: category, $options: 'i' };
    }

    if (associatedParty) {
      query.associatedParty = associatedParty;
    }

    if (keyword) {
      query.$or = [
        { itemCategory: { $regex: keyword, $options: 'i' } },
        { itemDescription: { $regex: keyword, $options: 'i' } }
      ];
    }

    const items = await EvidenceItem.find(query).sort({ createdAt: -1 });
    return items;
  }
}

export default new EvidenceService();
