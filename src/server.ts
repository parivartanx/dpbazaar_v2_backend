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

dotenv.config();

const app = express();

// Check if we're running in a serverless environment
const isServerless = !!(
  process.env.VERCEL_ENV || 
  process.env.NOW_REGION || 
  process.env.SERVERLESS ||
  process.env.NOW || 
  process.env.VERCEL
);

// Trust proxy in serverless environments
if (isServerless) {
  app.set('trust proxy', 1); // Trust first proxy
}

// Security middleware
app.use(helmet()); 
app.use(cors());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
  // Skip X-Forwarded-For validation in serverless environments since we trust the proxy
  skipFailedRequests: isServerless,
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

export default app;