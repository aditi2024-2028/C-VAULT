/**
 * Closure Handler (Controller)
 * 
 * HTTP handlers for case closure endpoints.
 */
import closureService from './closure.service.js';
import ApiResponse from '../../shared/utils/apiResponse.js';
import asyncHandler from '../../shared/utils/asyncHandler.js';

/**
 * POST /api/v1/closures
 * Records case closure (Admin only)
 */
export const recordClosure = asyncHandler(async (req, res) => {
  const {
    incidentRef,
    dispositionMethod,
    courtOrderNumber,
    closureDate,
    closureRemarks
  } = req.body;

  const closure = await closureService.closeCase({
    incidentRef,
    dispositionMethod,
    courtOrderNumber,
    closureDate,
    closureRemarks
  });

  return ApiResponse.created(res, {
    message: 'Case closed successfully',
    data: { closure }
  });
});

/**
 * GET /api/v1/closures/incident/:incidentId
 * Gets closure record for incident
 */
export const getClosureByIncident = asyncHandler(async (req, res) => {
  const closure = await closureService.getClosureByIncident(req.params.incidentId);

  if (!closure) {
    return ApiResponse.notFound(res, {
      message: 'No closure record found for this incident'
    });
  }

  return ApiResponse.success(res, {
    data: { closure }
  });
});
