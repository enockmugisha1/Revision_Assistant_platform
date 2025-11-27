import express from 'express';
import { searchEducationalResources, testResourceSearch } from '../controllers/educationalResourcesController.js';
// import { authenticate } from '../middleware/authMiddleware.js'; // Optional: uncomment if you want authentication

const router = express.Router();

// Public endpoint (no authentication required for educational resources)
router.get('/search', searchEducationalResources);

// Test configuration endpoint
router.get('/test-config', testResourceSearch);

// Protected endpoint (optional - if you want to require login)
// router.get('/search', authenticate, searchEducationalResources);

export default router;
