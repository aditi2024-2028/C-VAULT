/**
 * Express Application Configuration
 * 
 * Sets up Express with all middleware, routes, and error handling.
 * Separating this from server.js allows for better testing and
 * cleaner separation of concerns.
 */
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import environment from './config/environment.js';
import errorMiddleware from './shared/middleware/errorMiddleware.js';

// Import route modules
import staffRoutes from './modules/staff/staff.routes.js';
import incidentRoutes from './modules/incidents/incident.routes.js';
import evidenceRoutes from './modules/evidence/evidence.routes.js';
import transferRoutes from './modules/transfers/transfer.routes.js';
import closureRoutes from './modules/closures/closure.routes.js';
import reportRoutes from './modules/reports/report.routes.js';

const createApplication = () => {
  const app = express();

  // ─────────────────────────────────────────────────────────────
  // SECURITY & PARSING MIDDLEWARE
  // ─────────────────────────────────────────────────────────────
  
  // Enable CORS with credentials support for cookie-based auth
  app.use(cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (mobile apps, curl, etc)
      if (!origin) return callback(null, true);
      
      if (environment.cors.allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('CORS policy violation'));
      }
    },
    credentials: true
  }));

  // Parse JSON and URL-encoded bodies with size limits
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));
  
  // Parse cookies for JWT token extraction
  app.use(cookieParser());

  // ─────────────────────────────────────────────────────────────
  // API ROUTES
  // ─────────────────────────────────────────────────────────────
  
  // Health check endpoint for monitoring
  app.get('/health', (req, res) => {
    res.status(200).json({ 
      status: 'healthy',
      uptime: process.uptime(),
      timestamp: new Date().toISOString()
    });
  });

  // Mount feature modules under /api/v1 prefix
  app.use('/api/v1/staff', staffRoutes);
  app.use('/api/v1/incidents', incidentRoutes);
  app.use('/api/v1/evidence', evidenceRoutes);
  app.use('/api/v1/transfers', transferRoutes);
  app.use('/api/v1/closures', closureRoutes);
  app.use('/api/v1/reports', reportRoutes);

  // ─────────────────────────────────────────────────────────────
  // ERROR HANDLING
  // ─────────────────────────────────────────────────────────────
  
  // Handle 404 for unmatched routes (Express 5 requires named wildcard)
  app.use('*path', (req, res) => {
    res.status(404).json({
      success: false,
      message: `Route ${req.originalUrl} not found`
    });
  });

  // Global error handler (must be last)
  app.use(errorMiddleware);

  return app;
};

export default createApplication;
