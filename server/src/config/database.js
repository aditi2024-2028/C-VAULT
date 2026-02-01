/**
 * Database Connection Manager
 * 
 * Handles MongoDB connection lifecycle with proper error handling
 * and graceful shutdown support. Follows singleton pattern to
 * ensure single connection pool across the application.
 */
import mongoose from 'mongoose';
import environment from './environment.js';

class DatabaseManager {
  constructor() {
    this.isConnected = false;
  }

  /**
   * Establishes connection to MongoDB
   * Uses connection pooling by default in Mongoose 6+
   */
  async connect() {
    if (this.isConnected) {
      console.log('📦 Using existing database connection');
      return;
    }

    try {
      const connectionString = `${environment.database.uri}/${environment.database.name}`;
      
      await mongoose.connect(connectionString);
      
      this.isConnected = true;
      console.log('✅ Database connection established successfully');
      
      // Handle connection events for resilience
      mongoose.connection.on('error', (err) => {
        console.error('❌ Database connection error:', err.message);
      });

      mongoose.connection.on('disconnected', () => {
        console.warn('⚠️  Database disconnected');
        this.isConnected = false;
      });

    } catch (error) {
      console.error('❌ Failed to connect to database:', error.message);
      process.exit(1);
    }
  }

  /**
   * Gracefully closes database connection
   * Should be called during application shutdown
   */
  async disconnect() {
    if (!this.isConnected) return;
    
    await mongoose.connection.close();
    this.isConnected = false;
    console.log('📦 Database connection closed');
  }
}

// Export singleton instance
export default new DatabaseManager();
