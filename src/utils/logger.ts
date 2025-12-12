// Simple console-only logger for serverless environments
const createServerlessLogger = () => {
  return {
    info: (...args: any[]) => {
      console.info(new Date().toISOString(), 'INFO:', ...args);
    },
    error: (...args: any[]) => {
      console.error(new Date().toISOString(), 'ERROR:', ...args);
    },
    warn: (...args: any[]) => {
      console.warn(new Date().toISOString(), 'WARN:', ...args);
    },
    debug: (...args: any[]) => {
      console.debug(new Date().toISOString(), 'DEBUG:', ...args);
    },
    http: (...args: any[]) => {
      console.log(new Date().toISOString(), 'HTTP:', ...args);
    },
  };
};

// Check if we're running in a serverless environment
const isServerless = !!(
  process.env.VERCEL_ENV || 
  process.env.NOW_REGION || 
  process.env.SERVERLESS ||
  process.env.NOW || 
  process.env.VERCEL
);

let logger: any;

if (isServerless) {
  // Use simple console logger in serverless environments
  logger = createServerlessLogger();
} else {
  // Use full Winston logger in non-serverless environments
  const winston = require('winston');

  // Define log levels
  const levels = {
    error: 0,
    warn: 1,
    info: 2,
    http: 3,
    debug: 4,
  };

  // Define colors for each level
  const colors = {
    error: 'red',
    warn: 'yellow',
    info: 'green',
    http: 'magenta',
    debug: 'white',
  };

  // Tell winston that you want to link the colors
  winston.addColors(colors);

  // Define which level to log based on environment
  const level = () => {
    const env = process.env.NODE_ENV || 'development';
    const isDevelopment = env === 'development';
    return isDevelopment ? 'debug' : 'warn';
  };

  // Define format for logs
  const coloredFormat = winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss:ms' }),
    winston.format.colorize({ all: true }),
    winston.format.printf(
      (info: any) => `${info.timestamp} ${info.level}: ${info.message}`,
    ),
  );

  logger = winston.createLogger({
    level: level(),
    levels,
    format: coloredFormat,
    transports: [
      new winston.transports.Console(),
      new winston.transports.File({
        filename: 'logs/error.log',
        level: 'error',
      }),
      new winston.transports.File({ filename: 'logs/all.log' }),
    ],
  });
}

export { logger };