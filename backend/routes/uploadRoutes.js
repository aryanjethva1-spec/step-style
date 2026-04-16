import express from 'express';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import streamifier from 'streamifier';
import upload from '../middleware/uploadMiddleware.js';
import cloudinary from '../config/cloudinary.js';

const router = express.Router();

const hasCloudinaryConfig = () => {
  return Boolean(
    process.env.CLOUDINARY_CLOUD_NAME &&
      process.env.CLOUDINARY_API_KEY &&
      process.env.CLOUDINARY_API_SECRET
  );
};

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

const saveLocally = async (file) => {
  const uploadsDir = path.join(process.cwd(), 'uploads');

  await fs.promises.mkdir(uploadsDir, { recursive: true });

  const ext = path.extname(file.originalname) || '.jpg';
  const safeName = `${Date.now()}-${crypto.randomBytes(6).toString('hex')}${ext}`;
  const filePath = path.join(uploadsDir, safeName);

  await fs.promises.writeFile(filePath, file.buffer);

  return {
    image: `/uploads/${safeName}`,
    storage: 'local',
  };
};

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

      if (hasCloudinaryConfig()) {
        try {
          const result = await uploadToCloudinary(req.file.buffer);

          return res.json({
            image: result.secure_url,
            public_id: result.public_id,
            storage: 'cloudinary',
          });
        } catch (cloudinaryError) {
          console.error('[CLOUDINARY UPLOAD ERROR]', cloudinaryError);
        }
      } else {
        console.warn('[UPLOAD] Cloudinary config missing. Falling back to local storage.');
      }

      const localFile = await saveLocally(req.file);
      return res.json(localFile);
    } catch (error) {
      console.error('[UPLOAD ERROR]', error);
      return res.status(500).json({
        message: error.message || 'Image upload failed',
      });
    }
  });
});

export default router;