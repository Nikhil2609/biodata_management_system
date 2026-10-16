import { Request, Response, NextFunction } from 'express';
import { authService } from './auth.service';
import { loginSchema } from './auth.validation';
import { AuthenticatedRequest } from '../../middlewares/auth.middleware';

export class AuthController {
  async login(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const validated = await loginSchema.validate(req.body, { abortEarly: false });
      const result = await authService.login(validated.identifier, validated.password);

      res.status(200).json({
        success: true,
        message: 'Login successful',
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  async logout(_req: Request, res: Response): Promise<void> {
    // JWT is stateless; client removes token. Endpoint provided for API completeness
    res.status(200).json({
      success: true,
      message: 'Logged out successfully',
    });
  }

  async getMe(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ success: false, message: 'Unauthorized' });
        return;
      }
      const admin = await authService.getProfile(req.user.id);
      res.status(200).json({
        success: true,
        data: admin,
      });
    } catch (error) {
      next(error);
    }
  }
}

export const authController = new AuthController();
