import express from 'express';
import { getAnalyticsSummary } from '../controllers/analyticsController.js';
import { authenticate } from '../middleware/authMiddleware.js';

const router = express.Router();

// Get analytics summary
router.get('/summary', authenticate, getAnalyticsSummary);

export default router;