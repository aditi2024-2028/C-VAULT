/**
 * Transfer Routes
 * 
 * API endpoints for custody transfer management.
 */
import { Router } from 'express';
import * as transferHandler from './transfer.handler.js';
import { authenticate } from '../../shared/middleware/authMiddleware.js';

const router = Router();

router.use(authenticate);

router.post('/', transferHandler.recordTransfer);
router.get('/evidence/:evidenceId', transferHandler.getTransferHistory);

export default router;
