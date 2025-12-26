// routes/user.routes.js
import express from 'express';
import { authenticate } from '../middlewares/auth.middleware.js';
import { getProfile } from '../controllers/auth.controller.js';

const router = express.Router();

// Get profile (protected)
router.get('/profile', authenticate, getProfile);

export default router;