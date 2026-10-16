import { Router } from 'express';
import { gamController } from './gam.controller';
import { authenticateAdmin } from '../../middlewares/auth.middleware';

const router = Router();

// Public routes for visitors and forms
router.get('/talukas', (req, res, next) => gamController.getTalukas(req, res, next));
router.get('/gams', (req, res, next) => gamController.getGams(req, res, next));

// Admin management
router.post('/admin/gams', authenticateAdmin, (req, res, next) => gamController.createGam(req, res, next));

export default router;
