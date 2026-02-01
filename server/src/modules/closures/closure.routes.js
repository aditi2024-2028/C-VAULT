/**
 * Closure Routes
 * 
 * API endpoints for case closure management.
 */
import { Router } from 'express';
import * as closureHandler from './closure.handler.js';
import { authenticate, adminOnly } from '../../shared/middleware/authMiddleware.js';

const router = Router();

router.use(authenticate);

router.post('/', adminOnly, closureHandler.recordClosure);
router.get('/incident/:incidentId', closureHandler.getClosureByIncident);

export default router;
