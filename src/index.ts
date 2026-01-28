import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import { logger } from './utils/logger';
// Import routes
import { errorHandler } from './middlewares/errorHandler';
import { notFoundHandler } from './middlewares/notFoundHandler';
import { routes } from './routes';
import { config } from './config/environment';
// Import cron jobs
import { initializeCronJobs } from './cronjobs';
dotenv.config();

const app = express();
const PORT = config.port;

// Trust proxy - important for Digital Ocean App Platform and other reverse proxies
app.set('trust proxy', 1);

// Security middleware - configure Helmet to work with CORS
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" },
  crossOriginEmbedderPolicy: false,
})); 

// CORS configuration - use config values for proper external access
const corsOptions = {
  origin: config.cors.origin === '*' ? '*' : config.cors.origin.split(',').map(origin => origin.trim()),
  credentials: config.cors.credentials,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
};
app.use(cors(corsOptions));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
});
app.use(limiter);

// Logging
app.use(
  morgan('combined', {
    stream: { write: message => logger.info(message.trim()) },
  })
);

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', timestamp: new Date().toISOString() });
});

// API routes
app.use(routes);

// Error handling
app.use(notFoundHandler);
app.use(errorHandler);

// Initialize cron jobs
initializeCronJobs();

// Start server for traditional deployments (Digital Ocean, Heroku, etc.)
// Digital Ocean App Platform always sets PORT, so we start the server when PORT is available
// For serverless (Vercel), api/index.ts imports server.ts which doesn't have this code
const isServerless = process.env.VERCEL === '1' || process.env.AWS_LAMBDA_FUNCTION_NAME;

logger.info(`PORT: ${PORT}, isServerless: ${isServerless}, require.main === module: ${require.main === module}`);

if (!isServerless && PORT) {
  app.listen(PORT, '0.0.0.0', () => {
    logger.info(`Server running on port ${PORT}`);
    logger.info(`Environment: ${process.env.NODE_ENV || 'development'}`);
  });
} else if (require.main === module) {
  // Fallback: if run directly and not serverless, start server
  app.listen(PORT, '0.0.0.0', () => {
    logger.info(`Server running on port ${PORT}`);
    logger.info(`Environment: ${process.env.NODE_ENV || 'development'}`);
  });
} else {
  logger.warn('Server not started - check PORT environment variable and deployment configuration');
}

export default app;
