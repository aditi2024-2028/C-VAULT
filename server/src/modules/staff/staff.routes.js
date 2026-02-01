/**
 * Staff Routes
 * 
 * Defines API endpoints for staff management and authentication.
 */
import { Router } from 'express';
import * as staffHandler from './staff.handler.js';
import { authenticate, adminOnly } from '../../shared/middleware/authMiddleware.js';

const router = Router();

// Public routes
router.post('/login', staffHandler.loginStaff);

// Protected routes
router.post('/logout', authenticate, staffHandler.logoutStaff);
router.get('/profile', authenticate, staffHandler.getCurrentProfile);

// Admin-only routes
router.post('/register', authenticate, adminOnly, staffHandler.registerStaff);

export default router;
