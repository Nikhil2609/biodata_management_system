import dotenv from 'dotenv';
dotenv.config();

import { createApp } from './app';
import { connectDB, sequelize } from './config/database';

const PORT = Number(process.env.PORT) || 5000;

const startServer = async () => {
  try {
    await connectDB();
    await sequelize.sync();

    const app = createApp();

    const server = app.listen(PORT, () => {
      console.log(`\n======================================================`);
      console.log(`🚀 Marriage Biodata Management Backend Server Started`);
      console.log(`📡 URL: http://localhost:${PORT}`);
      console.log(`🔗 API Base: http://localhost:${PORT}/api/v1`);
      console.log(`🛡️  Mode: ${process.env.NODE_ENV || 'development'}`);
      console.log(`======================================================\n`);
    });

    // Graceful shutdown
    const shutdown = async () => {
      console.log('Stopping server gracefully...');
      server.close(async () => {
        await sequelize.close();
        console.log('Database connection closed. Exiting process.');
        process.exit(0);
      });
    };

    process.on('SIGTERM', shutdown);
    process.on('SIGINT', shutdown);
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
