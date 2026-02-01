/**
 * Transfer Handler (Controller)
 * 
 * HTTP handlers for custody transfer endpoints.
 */
import transferService from './transfer.service.js';
import ApiResponse from '../../shared/utils/apiResponse.js';
import asyncHandler from '../../shared/utils/asyncHandler.js';

/**
 * POST /api/v1/transfers
 * Records new custody transfer
 */
export const recordTransfer = asyncHandler(async (req, res) => {
  const {
    evidenceRef,
    sourceLocation,
    destinationLocation,
    transferPurpose,
    notes
  } = req.body;

  const transferData = {
    evidenceRef,
    sourceLocation,
    destinationLocation,
    transferPurpose,
    notes,
    releasingOfficer: {
      name: req.currentUser.fullName,
      badgeNumber: req.currentUser.badgeNumber
    }
  };

  const transfer = await transferService.recordTransfer(transferData);

  return ApiResponse.created(res, {
    message: 'Transfer recorded successfully',
    data: { transfer }
  });
});

/**
 * GET /api/v1/transfers/evidence/:evidenceId
 * Gets custody chain for evidence
 */
export const getTransferHistory = asyncHandler(async (req, res) => {
  const transfers = await transferService.getTransferHistory(req.params.evidenceId);

  return ApiResponse.success(res, {
    data: { transfers },
    meta: { count: transfers.length }
  });
});
