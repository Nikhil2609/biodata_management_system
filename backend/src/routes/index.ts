import { Router } from 'express';
import authRoutes from '../modules/auth/auth.routes';
import gamRoutes from '../modules/gams/gam.routes';
import biodataRoutes from '../modules/biodata/biodata.routes';
import dashboardRoutes from '../modules/dashboard/dashboard.routes';

const router = Router();

// Version 1 API Routes
router.use('/auth', authRoutes);
router.use('/', gamRoutes);
router.use('/', biodataRoutes);
router.use('/', dashboardRoutes);

// Health check endpoint
router.get('/health', (_req, res) => {
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    service: 'Marriage Biodata Management System API',
    version: '1.0.0',
  });
});

export default router;
