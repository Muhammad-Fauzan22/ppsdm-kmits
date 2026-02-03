import winston from 'winston';
import path from 'path';

// Define log levels
const logLevels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  debug: 4,
};

const logColors = {
  error: 'red',
  warn: 'yellow',
  info: 'green',
  http: 'magenta',
  debug: 'blue',
};

// Create custom format
const customFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.errors({ stack: true }),
  winston.format.json(),
  winston.format.colorize({ all: true }),
  winston.format.printf(({ timestamp, level, message, ...meta }) => {
    let metaStr = Object.keys(meta).length ? `\n${JSON.stringify(meta, null, 2)}` : '';
    return `${timestamp} [${level}]: ${message}${metaStr}`;
  })
);

// Create winston logger
const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  levels: logLevels,
  format: customFormat,
  transports: [
    // Error log file
    new winston.transports.File({
      filename: path.join(process.cwd(), 'logs', 'error.log'),
      level: 'error',
      maxsize: 5242880, // 5MB
      maxFiles: 5,
    }),
    // Combined log file
    new winston.transports.File({
      filename: path.join(process.cwd(), 'logs', 'combined.log'),
      maxsize: 5242880, // 5MB
      maxFiles: 5,
    }),
    // Security events log
    new winston.transports.File({
      filename: path.join(process.cwd(), 'logs', 'security.log'),
      level: 'warn',
      maxsize: 5242880, // 5MB
      maxFiles: 10,
    }),
  ],
});

// Add console transport for development
if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.combine(
      winston.format.colorize(),
      winston.format.simple()
    )
  }));
}

// Security event logger
export const securityLogger = {
  // Authentication events
  authAttempt: (data: { email: string; ip: string; userAgent: string; success: boolean }) => {
    logger.warn('AUTH_ATTEMPT', {
      event: 'authentication_attempt',
      email: data.email,
      ip: data.ip,
      userAgent: data.userAgent,
      success: data.success,
      timestamp: new Date().toISOString(),
    });
  },

  // Rate limiting events
  rateLimitExceeded: (data: { ip: string; endpoint: string; limit: number }) => {
    logger.warn('RATE_LIMIT_EXCEEDED', {
      event: 'rate_limit_exceeded',
      ip: data.ip,
      endpoint: data.endpoint,
      limit: data.limit,
      timestamp: new Date().toISOString(),
    });
  },

  // Suspicious activity
  suspiciousActivity: (data: { type: string; ip: string; details: any }) => {
    logger.warn('SUSPICIOUS_ACTIVITY', {
      event: 'suspicious_activity',
      type: data.type,
      ip: data.ip,
      details: data.details,
      timestamp: new Date().toISOString(),
    });
  },

  // Data access events
  dataAccess: (data: { userId: string; action: string; resource: string; ip: string }) => {
    logger.info('DATA_ACCESS', {
      event: 'data_access',
      userId: data.userId,
      action: data.action,
      resource: data.resource,
      ip: data.ip,
      timestamp: new Date().toISOString(),
    });
  },

  // Admin actions
  adminAction: (data: { adminId: string; action: string; target: string; details: any }) => {
    logger.warn('ADMIN_ACTION', {
      event: 'admin_action',
      adminId: data.adminId,
      action: data.action,
      target: data.target,
      details: data.details,
      timestamp: new Date().toISOString(),
    });
  },
};

// API request logger
export const apiLogger = {
  request: (data: {
    method: string;
    url: string;
    ip: string;
    userAgent: string;
    userId?: string;
    duration?: number;
    statusCode?: number;
  }) => {
    logger.http('API_REQUEST', {
      event: 'api_request',
      method: data.method,
      url: data.url,
      ip: data.ip,
      userAgent: data.userAgent,
      userId: data.userId,
      duration: data.duration,
      statusCode: data.statusCode,
      timestamp: new Date().toISOString(),
    });
  },

  error: (data: {
    method: string;
    url: string;
    ip: string;
    error: string;
    stack?: string;
    userId?: string;
  }) => {
    logger.error('API_ERROR', {
      event: 'api_error',
      method: data.method,
      url: data.url,
      ip: data.ip,
      error: data.error,
      stack: data.stack,
      userId: data.userId,
      timestamp: new Date().toISOString(),
    });
  },
};

// Assessment logger
export const assessmentLogger = {
  submission: (data: {
    userId: string;
    assessmentType: string;
    dimension: string;
    score: number;
    ip: string;
  }) => {
    logger.info('ASSESSMENT_SUBMISSION', {
      event: 'assessment_submission',
      userId: data.userId,
      assessmentType: data.assessmentType,
      dimension: data.dimension,
      score: data.score,
      ip: data.ip,
      timestamp: new Date().toISOString(),
    });
  },

  validation: (data: {
    userId: string;
    assessmentType: string;
    errors: string[];
    ip: string;
  }) => {
    logger.warn('ASSESSMENT_VALIDATION_ERROR', {
      event: 'assessment_validation_error',
      userId: data.userId,
      assessmentType: data.assessmentType,
      errors: data.errors,
      ip: data.ip,
      timestamp: new Date().toISOString(),
    });
  },
};

// Performance logger
export const performanceLogger = {
  slowQuery: (data: {
    query: string;
    duration: number;
    table: string;
    userId?: string;
  }) => {
    logger.warn('SLOW_QUERY', {
      event: 'slow_query',
      query: data.query.substring(0, 500), // Truncate long queries
      duration: data.duration,
      table: data.table,
      userId: data.userId,
      timestamp: new Date().toISOString(),
    });
  },

  memoryUsage: (data: { usage: number; threshold: number }) => {
    logger.info('MEMORY_USAGE', {
      event: 'memory_usage',
      usage: data.usage,
      threshold: data.threshold,
      timestamp: new Date().toISOString(),
    });
  },
};

// Export main logger
export { logger };

// Helper function to create request context
export const createRequestContext = (req: any) => ({
  ip: req.ip || req.connection?.remoteAddress || 'unknown',
  userAgent: req.headers?.['user-agent'] || 'unknown',
  method: req.method,
  url: req.url,
  userId: req.user?.id,
});

// Structured logging middleware
export const loggingMiddleware = (req: any, res: any, next: any) => {
  const start = Date.now();
  const context = createRequestContext(req);

  // Log request
  apiLogger.request({
    method: context.method,
    url: context.url,
    ip: context.ip,
    userAgent: context.userAgent,
    userId: context.userId,
  });

  // Log response
  res.on('finish', () => {
    const duration = Date.now() - start;
    apiLogger.request({
      ...context,
      duration,
      statusCode: res.statusCode,
    });

    // Log slow requests
    if (duration > 1000) { // 1 second
      logger.warn('SLOW_REQUEST', {
        event: 'slow_request',
        method: context.method,
        url: context.url,
        duration,
        statusCode: res.statusCode,
        ip: context.ip,
      });
    }
  });

  // Log errors
  res.on('error', (error: Error) => {
    apiLogger.error({
      method: context.method,
      url: context.url,
      ip: context.ip,
      error: error.message,
      stack: error.stack,
      userId: context.userId,
    });
  });

  next();
};
