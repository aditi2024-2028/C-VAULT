/**
 * Evidence Handler (Controller)
 * 
 * HTTP handlers for evidence management endpoints.
 */
import evidenceService from './evidence.service.js';
import ApiResponse from '../../shared/utils/apiResponse.js';
import asyncHandler from '../../shared/utils/asyncHandler.js';

/**
 * POST /api/v1/evidence
 * Registers new evidence item
 */
export const registerEvidence = asyncHandler(async (req, res) => {
  const {
    incidentRef,
    itemCategory,
    associatedParty,
    itemDescription,
    quantity,
    measurementUnit,
    rackNumber,
    roomNumber,
    compartmentId,
    remarks
  } = req.body;

  const itemData = {
    incidentRef,
    itemCategory,
    associatedParty,
    itemDescription,
    itemQuantity: {
      amount: parseInt(quantity, 10),
      measurementUnit: measurementUnit || 'piece'
    },
    storageDetails: {
      rackNumber,
      roomNumber,
      compartmentId
    },
    remarks
  };

  // Get photo buffer if uploaded
  const photoBuffer = req.file?.buffer || null;

  const evidenceItem = await evidenceService.registerEvidenceItem(itemData, photoBuffer);

  return ApiResponse.created(res, {
    message: 'Evidence item registered successfully',
    data: { evidenceItem }
  });
});

/**
 * GET /api/v1/evidence/search
 * Searches evidence items
 */
export const searchEvidence = asyncHandler(async (req, res) => {
  const { incidentId, category, party, q: keyword } = req.query;

  const items = await evidenceService.searchEvidence({
    incidentId,
    category,
    associatedParty: party,
    keyword
  });

  return ApiResponse.success(res, {
    data: { evidenceItems: items },
    meta: { count: items.length }
  });
});

/**
 * GET /api/v1/evidence/incident/:incidentId
 * Gets all evidence for an incident
 */
export const getEvidenceByIncident = asyncHandler(async (req, res) => {
  const items = await evidenceService.getEvidenceByIncident(req.params.incidentId);

  return ApiResponse.success(res, {
    data: { evidenceItems: items },
    meta: { count: items.length }
  });
});

/**
 * GET /api/v1/evidence/:id
 * Gets single evidence item
 */
export const getEvidenceById = asyncHandler(async (req, res) => {
  const item = await evidenceService.getEvidenceById(req.params.id);

  return ApiResponse.success(res, {
    data: { evidenceItem: item }
  });
});
