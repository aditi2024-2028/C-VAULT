/**
 * Cloud Storage Service
 * 
 * Abstracts cloud storage operations (Cloudinary).
 * Provides consistent interface for file uploads across the app.
 */
import { v2 as cloudinary } from 'cloudinary';
import { Readable } from 'stream';
import environment from '../../config/environment.js';

// Initialize Cloudinary with credentials
cloudinary.config({
  cloud_name: environment.cloudStorage.cloudName,
  api_key: environment.cloudStorage.apiKey,
  api_secret: environment.cloudStorage.apiSecret
});

class CloudStorageService {
  /**
   * Uploads a buffer to cloud storage
   * @param {Buffer} buffer - File buffer to upload
   * @param {Object} options - Upload options
   * @returns {Promise<Object>} - Upload result with URL
   */
  async uploadBuffer(buffer, options = {}) {
    return new Promise((resolve, reject) => {
      const uploadOptions = {
        resource_type: 'auto',
        folder: options.folder || environment.cloudStorage.uploadFolder,
        public_id: options.publicId,
        ...options
      };

      const uploadStream = cloudinary.uploader.upload_stream(
        uploadOptions,
        (error, result) => {
          if (error) {
            reject(new Error(`Upload failed: ${error.message}`));
          } else {
            resolve({
              url: result.secure_url,
              publicId: result.public_id,
              format: result.format,
              size: result.bytes
            });
          }
        }
      );

      // Pipe buffer to upload stream
      Readable.from(buffer).pipe(uploadStream);
    });
  }

  /**
   * Deletes a file from cloud storage
   * @param {string} publicId - File's public ID
   */
  async deleteFile(publicId) {
    try {
      await cloudinary.uploader.destroy(publicId);
    } catch (error) {
      console.error('Failed to delete file from cloud:', error.message);
    }
  }

  /**
   * Generates a thumbnail URL for an existing image
   */
  getThumbnailUrl(originalUrl, width = 200, height = 200) {
    if (!originalUrl) return null;
    return originalUrl.replace('/upload/', `/upload/w_${width},h_${height},c_fill/`);
  }
}

export default new CloudStorageService();
