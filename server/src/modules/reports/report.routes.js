/**
 * Reports Routes
 * 
 * API endpoints for analytics and reporting.
 */
import { Router } from 'express';
import * as reportHandler from './report.handler.js';
import { authenticate, adminOnly } from '../../shared/middleware/authMiddleware.js';

const router = Router();

router.use(authenticate, adminOnly);

router.get('/overview', reportHandler.getOverviewReport);

export default router;
