import { Router } from 'express';
import { authController } from './auth.controller';
import { authenticateAdmin } from '../../middlewares/auth.middleware';
import { loginLimiter } from '../../middlewares/rateLimiter.middleware';

const router = Router();

router.post('/login', loginLimiter, (req, res, next) => authController.login(req, res, next));
router.post('/logout', (req, res) => authController.logout(req, res));
router.get('/me', authenticateAdmin, (req, res, next) => authController.getMe(req, res, next));

export default router;
