import express from 'express';
import upload from '../middleware/uploadMiddleware.js';

const router = express.Router();

router.post('/', (req, res, next) => {
  upload.single('image')(req, res, (err) => {
    if (err) {
      console.error('[Upload] Multer error:', err.message);
      return res.status(400).send({ message: err.message });
    }
    if (!req.file) {
      return res.status(400).send({ message: 'No file uploaded' });
    }
    console.log('[Upload] File received:', req.file.path);
    res.send({
      message: 'Image uploaded',
      image: `/${req.file.path.replace(/\\/g, '/')}`,
    });
  });
});

export default router;
