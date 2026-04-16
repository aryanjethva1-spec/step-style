import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import cloudinary from '../config/cloudinary.js';

const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => ({
    folder: 'stepstyle',
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
    transformation: [{ width: 1000, height: 1000, crop: 'limit' }],
  }),
});

const fileFilter = (req, file, cb) => {
  const allowedMimeTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

  if (!allowedMimeTypes.includes(file.mimetype)) {
    return cb(new Error('Only JPG, JPEG, PNG, and WEBP files are allowed'));
  }

  cb(null, true);
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
});

export default upload;