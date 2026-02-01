/**
 * Server Entry Point
 * 
 * Bootstraps the application by connecting to the database
 * and starting the HTTP server. Handles graceful shutdown
 * for containerized environments.
 */
import createApplication from './app.js';
import databaseManager from './config/database.js';
import environment from './config/environment.js';

const startServer = async () => {
  try {
    // Establish database connection first
    await databaseManager.connect();

    // Create and configure Express app
    const app = createApplication();

    // Start listening for requests
    const server = app.listen(environment.port, () => {
      console.log(`
╔════════════════════════════════════════════════════╗
║                                                    ║
║   🚔 Evidence Management System API                ║
║   ──────────────────────────────────────────────   ║
║   Status:  Running                                 ║
║   Port:    ${environment.port}                                 ║
║   Mode:    ${environment.nodeEnv.padEnd(11)}                        ║
║                                                    ║
╚════════════════════════════════════════════════════╝
      `);
    });

    // ─────────────────────────────────────────────────────────────
    // GRACEFUL SHUTDOWN HANDLERS
    // ─────────────────────────────────────────────────────────────
    
    const shutdown = async (signal) => {
      console.log(`\n🛑 ${signal} received. Shutting down gracefully...`);
      
      server.close(async () => {
        await databaseManager.disconnect();
        console.log('👋 Server shutdown complete');
        process.exit(0);
      });

      // Force exit if graceful shutdown takes too long
      setTimeout(() => {
        console.error('⚠️  Forced shutdown after timeout');
        process.exit(1);
      }, 10000);
    };

    process.on('SIGTERM', () => shutdown('SIGTERM'));
    process.on('SIGINT', () => shutdown('SIGINT'));

  } catch (error) {
    console.error('❌ Failed to start server:', error.message);
    process.exit(1);
  }
};

// Launch the server
startServer();
