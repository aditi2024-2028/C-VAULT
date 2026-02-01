/**
 * Evidence Routes
 * 
 * API endpoints for evidence management.
 */
import { Router } from 'express';
import * as evidenceHandler from './evidence.handler.js';
import { authenticate } from '../../shared/middleware/authMiddleware.js';
import { singleUpload } from '../../shared/middleware/uploadMiddleware.js';

const router = Router();

// All routes require authentication
router.use(authenticate);

// Search and filter
router.get('/search', evidenceHandler.searchEvidence);

// CRUD operations
router.post('/', singleUpload('photograph'), evidenceHandler.registerEvidence);
router.get('/incident/:incidentId', evidenceHandler.getEvidenceByIncident);
router.get('/:id', evidenceHandler.getEvidenceById);

export default router;
