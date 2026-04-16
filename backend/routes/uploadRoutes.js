import express from 'express';
import upload from '../middleware/uploadMiddleware.js';

const router = express.Router();

router.post('/', (req, res, next) => {
  upload.single('image')(req, res, function (err) {
    if (err) {
      console.error('[UPLOAD ERROR]', err);
      return res.status(400).json({
        message: err.message || 'Image upload failed',
      });
    }

    if (!req.file) {
      return res.status(400).json({
        message: 'No image file uploaded',
      });
    }

    return res.json({
      image: req.file.path || req.file.secure_url,
      public_id: req.file.filename || req.file.public_id || null,
    });
  });
});

export default router;