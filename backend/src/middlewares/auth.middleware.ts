import { Request, Response, NextFunction } from 'express';
import { verifyToken, TokenPayload } from '../utils/jwt';
import { Admin } from '../models/Admin';

export interface AuthenticatedRequest extends Request {
  user?: TokenPayload;
  admin?: Admin;
}

export const authenticateAdmin = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({
        success: false,
        message: 'Authentication required. No token provided.',
      });
      return;
    }

    const token = authHeader.split(' ')[1];
    let payload: TokenPayload;

    try {
      payload = verifyToken(token);
    } catch (err) {
      res.status(401).json({
        success: false,
        message: 'Invalid or expired authentication token.',
      });
      return;
    }

    // Verify admin is active in DB
    const admin = await Admin.findByPk(payload.id);
    if (!admin || !admin.isActive) {
      res.status(401).json({
        success: false,
        message: 'User account not found or is deactivated.',
      });
      return;
    }

    req.user = payload;
    req.admin = admin;
    next();
  } catch (error) {
    next(error);
  }
};
