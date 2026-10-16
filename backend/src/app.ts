import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import path from 'path';
import apiRoutes from './routes';
import { apiLimiter } from './middlewares/rateLimiter.middleware';
import { errorHandler } from './middlewares/error.middleware';

export const createApp = (): Application => {
  const app = express();

  // Security Middlewares
  app.use(
    helmet({
      crossOriginResourcePolicy: { policy: 'cross-origin' }, // Allow images to be viewed cross-origin
    })
  );

  // CORS Configuration
  const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
  app.use(
    cors({
      origin: [frontendUrl, 'http://localhost:5173', 'http://127.0.0.1:5173'],
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization'],
    })
  );

  // Logging
  if (process.env.NODE_ENV !== 'test') {
    app.use(morgan('dev'));
  }

  // Body Parsing
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));

  // Static uploads directory
  const uploadsPath = path.resolve(process.cwd(), process.env.UPLOAD_DIR || 'uploads');
  app.use('/uploads', express.static(uploadsPath));

  // Global API Rate Limiting
  app.use('/api', apiLimiter);

  // Version 1 API Routes
  app.use('/api/v1', apiRoutes);

  // 404 Route handler
  app.use((_req, res) => {
    res.status(404).json({
      success: false,
      message: 'API endpoint not found',
    });
  });

  // Centralized Error Handler
  app.use(errorHandler);

  return app;
};
