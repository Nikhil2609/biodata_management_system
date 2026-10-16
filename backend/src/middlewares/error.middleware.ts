import { Request, Response, NextFunction } from 'express';
import { ValidationError as YupValidationError } from 'yup';
import { ValidationError as SequelizeValidationError, UniqueConstraintError } from 'sequelize';

export const errorHandler = (
  err: any,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  console.error('🔥 Server Error:', err);

  // Yup validation error
  if (err instanceof YupValidationError) {
    res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: err.errors,
    });
    return;
  }

  // Sequelize unique constraint error
  if (err instanceof UniqueConstraintError) {
    res.status(409).json({
      success: false,
      message: 'Duplicate record already exists.',
      errors: err.errors.map((e) => e.message),
    });
    return;
  }

  // Sequelize validation error
  if (err instanceof SequelizeValidationError) {
    res.status(400).json({
      success: false,
      message: 'Database validation failed',
      errors: err.errors.map((e) => e.message),
    });
    return;
  }

  // Multer error
  if (err.name === 'MulterError') {
    res.status(400).json({
      success: false,
      message: `File upload error: ${err.message}`,
    });
    return;
  }

  // Default custom or internal server error
  const statusCode = err.statusCode || 500;
  const message = err.isOperational ? err.message : 'An internal server error occurred.';

  res.status(statusCode).json({
    success: false,
    message: process.env.NODE_ENV === 'production' && !err.isOperational ? 'Internal server error' : err.message || message,
  });
};
