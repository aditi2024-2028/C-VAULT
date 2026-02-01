/**
 * File Upload Middleware
 * 
 * Configures multer for handling multipart/form-data.
 * Uses memory storage for cloud upload compatibility.
 */
import multer from 'multer';
import AppError from '../utils/AppError.js';

// Configure storage - using memory for cloud uploads
const storage = multer.memoryStorage();

// File filter to accept only images
const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
  
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new AppError('Only image files (JPEG, PNG, GIF, WEBP) are allowed', 400), false);
  }
};

// Export configured uploader
export const uploadHandler = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB max file size
    files: 5 // Maximum 5 files per request
  }
});

// Single file upload helper
export const singleUpload = (fieldName) => uploadHandler.single(fieldName);

// Multiple files upload helper
export const multipleUpload = (fieldName, maxCount = 5) => {
  return uploadHandler.array(fieldName, maxCount);
};
