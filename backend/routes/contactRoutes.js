import express from 'express';
const router = express.Router();
import { submitContactForm } from '../controllers/contactController.js';

router.post('/', submitContactForm);

export default router;
