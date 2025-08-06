interface LogLevel {
  error: (message: string | object) => void;
  warn: (message: string | object) => void;
  info: (message: string | object) => void;
  debug: (message: string | object) => void;
}

const formatMessage = (level: string, message: string | object): string => {
  const timestamp = new Date().toISOString();
  const formattedMessage = typeof message === 'object' 
    ? JSON.stringify(message, null, 2) 
    : message;
  
  return `[${timestamp}] ${level.toUpperCase()}: ${formattedMessage}`;
};

export const logger: LogLevel = {
  error: (message: string | object) => {
    console.error(formatMessage('error', message));
  },
  warn: (message: string | object) => {
    console.warn(formatMessage('warn', message));
  },
  info: (message: string | object) => {
    console.info(formatMessage('info', message));
  },
  debug: (message: string | object) => {
    if (process.env.NODE_ENV === 'development') {
      console.debug(formatMessage('debug', message));
    }
  }
}; 