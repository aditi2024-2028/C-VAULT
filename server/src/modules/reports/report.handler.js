/**
 * Reports Handler
 * 
 * HTTP handlers for analytics endpoints.
 */
import reportService from './report.service.js';
import ApiResponse from '../../shared/utils/apiResponse.js';
import asyncHandler from '../../shared/utils/asyncHandler.js';

/**
 * GET /api/v1/reports/overview
 * Comprehensive analytics overview
 */
export const getOverviewReport = asyncHandler(async (req, res) => {
  const report = await reportService.generateOverviewReport();

  return ApiResponse.success(res, {
    data: { report }
  });
});
