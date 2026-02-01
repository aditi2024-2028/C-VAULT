/**
 * Environment Configuration Module
 * 
 * Centralizes all environment variables and provides type-safe access
 * to configuration values throughout the application. This approach
 * prevents scattered process.env calls and makes testing easier.
 */
import dotenv from 'dotenv';

dotenv.config();

const environment = {
  // Server Configuration
  nodeEnv: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT, 10) || 5000,
  
  // Database Configuration
  database: {
    uri: process.env.MONGODB_URI,
    name: process.env.DB_NAME || 'malkhana_evidence_db'
  },
  
  // Security Configuration
  jwt: {
    secret: process.env.JWT_SECRET,
    expiresIn: process.env.JWT_EXPIRES_IN || '24h'
  },
  
  // CORS Configuration
  cors: {
    allowedOrigins: process.env.CORS_ORIGIN?.split(',') || ['http://localhost:5173']
  },
  
  // Cloud Storage Configuration
  cloudStorage: {
    cloudName: process.env.CLOUDINARY_CLOUD_NAME,
    apiKey: process.env.CLOUDINARY_API_KEY,
    apiSecret: process.env.CLOUDINARY_API_SECRET,
    uploadFolder: 'evidence_assets'
  },
  
  // Feature Flags
  features: {
    enableAnalytics: process.env.ENABLE_ANALYTICS !== 'false'
  }
};

// Validation to ensure critical configs are present
const validateEnvironment = () => {
  const required = ['database.uri', 'jwt.secret'];
  const missing = [];
  
  required.forEach(key => {
    const keys = key.split('.');
    let value = environment;
    keys.forEach(k => { value = value?.[k]; });
    if (!value) missing.push(key);
  });
  
  if (missing.length > 0 && environment.nodeEnv !== 'test') {
    console.warn(`⚠️  Missing environment variables: ${missing.join(', ')}`);
  }
};

validateEnvironment();

export default environment;
