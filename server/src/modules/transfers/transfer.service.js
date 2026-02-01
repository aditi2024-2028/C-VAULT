/**
 * Transfer Service
 * 
 * Business logic for custody chain tracking.
 */
import { CustodyTransfer } from './transfer.model.js';
import AppError from '../../shared/utils/AppError.js';

class TransferService {
  /**
   * Records a new custody transfer
   */
  async recordTransfer(transferData) {
    const transfer = await CustodyTransfer.create(transferData);
    return transfer;
  }

  /**
   * Gets complete custody chain for an evidence item
   */
  async getTransferHistory(evidenceId) {
    const transfers = await CustodyTransfer.find({ evidenceRef: evidenceId })
      .sort({ transferTimestamp: 1 }); // Chronological order
    return transfers;
  }
}

export default new TransferService();
