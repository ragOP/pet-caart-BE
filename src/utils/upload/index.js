const fs = require('fs/promises');
const path = require('path');
const { PutObjectCommand } = require('@aws-sdk/client-s3');
const { s3, BUCKET_NAME } = require('../../config/s3/index.js');
const mime = require('mime-types');

// Helper: Upload to S3
async function uploadToS3(filePath, folder = '', contentType = 'application/octet-stream') {
   const fileContent = await fs.readFile(filePath);
   const fileName = path.basename(filePath);
   const key = folder ? `${folder}/${fileName}` : fileName;

   const uploadParams = {
      Bucket: BUCKET_NAME,
      Key: key,
      Body: fileContent,
      ContentType: contentType,
   };

   await s3.send(new PutObjectCommand(uploadParams));
   await fs.unlink(filePath);

   return `https://${BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;
}

// Upload single file
exports.uploadSingleFile = async (filePath, folder = '') => {
   try {
      const contentType = mime.lookup(filePath) || 'application/octet-stream';
      return await uploadToS3(filePath, folder, contentType);
   } catch (error) {
      throw new Error(`Single File Upload Error: ${error.message}`);
   }
};

// Upload multiple files
exports.uploadMultipleFiles = async (files, folder = '') => {
   try {
      const uploadedUrls = [];
      for (const file of files) {
         const contentType = mime.lookup(file.path) || 'application/octet-stream';
         const url = await uploadToS3(file.path, folder, contentType);
         uploadedUrls.push(url);
      }
      return uploadedUrls;
   } catch (error) {
      throw new Error(`Multiple File Upload Error: ${error.message}`);
   }
};

// Upload voice note (audio/video)
exports.uploadVoiceNote = async (filePath, folder = '') => {
   try {
      const contentType = mime.lookup(filePath) || 'audio/mpeg';
      return await uploadToS3(filePath, folder, contentType);
   } catch (error) {
      throw new Error(`Voice Note Upload Error: ${error.message}`);
   }
};

// Upload PDF
exports.uploadPDF = async (filePath, folder = '') => {
   try {
      return await uploadToS3(filePath, folder, 'application/pdf');
   } catch (error) {
      throw new Error(`PDF Upload Error: ${error.message}`);
   }
};
