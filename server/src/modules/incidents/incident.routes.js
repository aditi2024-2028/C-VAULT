/**
 * Incident Routes
 * 
 * API endpoints for incident management.
 */
import { Router } from 'express';
import * as incidentHandler from './incident.handler.js';
import { authenticate } from '../../shared/middleware/authMiddleware.js';

const router = Router();

// All routes require authentication
router.use(authenticate);

// Dashboard and alerts
router.get('/metrics', incidentHandler.getMetrics);
router.get('/alerts/pending', incidentHandler.getPendingAlerts);
router.get('/search', incidentHandler.searchIncidents);

// CRUD operations
router.post('/', incidentHandler.createIncident);
router.get('/', incidentHandler.getAllIncidents);
router.get('/:id', incidentHandler.getIncidentById);

export default router;
