/**
 * Incident Handler (Controller)
 * 
 * HTTP handlers for incident-related endpoints.
 */
import incidentService from './incident.service.js';
import ApiResponse from '../../shared/utils/apiResponse.js';
import asyncHandler from '../../shared/utils/asyncHandler.js';

/**
 * POST /api/v1/incidents
 * Creates a new incident record
 */
export const createIncident = asyncHandler(async (req, res) => {
  const {
    registrationStation,
    firNumber,
    registrationYear,
    firFilingDate,
    evidenceSeizureDate,
    applicableSections
  } = req.body;

  // Include current user as investigating officer
  const incidentData = {
    registrationStation,
    firNumber,
    registrationYear,
    firFilingDate,
    evidenceSeizureDate,
    applicableSections,
    assignedInvestigator: {
      name: req.currentUser.fullName,
      badgeNumber: req.currentUser.badgeNumber
    }
  };

  const incident = await incidentService.createIncident(incidentData);

  return ApiResponse.created(res, {
    message: 'Incident registered successfully',
    data: { incident }
  });
});

/**
 * GET /api/v1/incidents
 * Retrieves all incidents
 */
export const getAllIncidents = asyncHandler(async (req, res) => {
  const incidents = await incidentService.getAllIncidents();

  return ApiResponse.success(res, {
    data: { incidents },
    meta: { count: incidents.length }
  });
});

/**
 * GET /api/v1/incidents/search
 * Searches incidents with filters
 */
export const searchIncidents = asyncHandler(async (req, res) => {
  const { status, station, firNumber, year, q: keyword } = req.query;
  
  const incidents = await incidentService.searchIncidents({
    status,
    station,
    firNumber,
    year,
    keyword
  });

  return ApiResponse.success(res, {
    data: { incidents },
    meta: { count: incidents.length }
  });
});

/**
 * GET /api/v1/incidents/alerts/pending
 * Retrieves long-pending incidents
 */
export const getPendingAlerts = asyncHandler(async (req, res) => {
  const days = parseInt(req.query.days, 10) || 90;
  const incidents = await incidentService.getLongPendingIncidents(days);

  return ApiResponse.success(res, {
    message: `Incidents pending more than ${days} days`,
    data: { incidents },
    meta: { count: incidents.length, thresholdDays: days }
  });
});

/**
 * GET /api/v1/incidents/metrics
 * Dashboard metrics
 */
export const getMetrics = asyncHandler(async (req, res) => {
  const metrics = await incidentService.getDashboardMetrics();

  return ApiResponse.success(res, {
    data: { metrics }
  });
});

/**
 * GET /api/v1/incidents/:id
 * Retrieves single incident
 */
export const getIncidentById = asyncHandler(async (req, res) => {
  const incident = await incidentService.getIncidentById(req.params.id);

  return ApiResponse.success(res, {
    data: { incident }
  });
});
