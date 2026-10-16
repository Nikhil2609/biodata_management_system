import { Router } from 'express';
import { dashboardController } from './dashboard.controller';
import { authenticateAdmin } from '../../middlewares/auth.middleware';

const router = Router();

router.get('/admin/dashboard/stats', authenticateAdmin, (req, res, next) =>
  dashboardController.getStats(req, res, next)
);

export default router;
