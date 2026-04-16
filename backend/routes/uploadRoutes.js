import express from 'express';
import streamifier from 'streamifier';
import upload from '../middleware/uploadMiddleware.js';
import cloudinary from '../config/cloudinary.js';

const router = express.Router();

const uploadToCloudinary = (buffer) =>
  new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: 'stepstyle',
        resource_type: 'image',
      },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    );

    streamifier.createReadStream(buffer).pipe(stream);
  });

router.post('/', (req, res) => {
  upload.single('image')(req, res, async (err) => {
    try {
      if (err) {
        return res.status(400).json({
          message: err.message || 'Image upload failed',
        });
      }

      if (!req.file) {
        return res.status(400).json({
          message: 'No image file uploaded',
        });
      }

      const result = await uploadToCloudinary(req.file.buffer);

      return res.json({
        image: result.secure_url,
        public_id: result.public_id,
      });
    } catch (error) {
      console.error('[UPLOAD ERROR]', error);
      return res.status(500).json({
        message: error.message || 'Cloudinary upload failed',
      });
    }
  });
});

export default router;