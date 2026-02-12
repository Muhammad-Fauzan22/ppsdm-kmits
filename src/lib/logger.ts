/**
 * Structured Logging Service
 * Production-ready logging with different levels and transports
 */

type LogLevel = 'debug' | 'info' | 'warn' | 'error' | 'fatal';

interface LogContext {
  userId?: string;
  requestId?: string;
  path?: string;
  method?: string;
  [key: string]: any;
}

interface LogEntry {
  timestamp: string;
  level: LogLevel;
  message: string;
  context?: LogContext;
  error?: {
    name: string;
    message: string;
    stack?: string;
  };
}

class Logger {
  private static instance: Logger;
  private minLevel: LogLevel;
  private isDevelopment: boolean;

  private constructor() {
    this.minLevel = (process.env.LOG_LEVEL as LogLevel) || 'info';
    this.isDevelopment = process.env.NODE_ENV === 'development';
  }

  static getInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger();
    }
    return Logger.instance;
  }

  private shouldLog(level: LogLevel): boolean {
    const levels: LogLevel[] = ['debug', 'info', 'warn', 'error', 'fatal'];
    return levels.indexOf(level) >= levels.indexOf(this.minLevel);
  }

  private formatLogEntry(entry: LogEntry): string {
    if (this.isDevelopment) {
      // Pretty format for development
      const colorCodes: Record<LogLevel, string> = {
        debug: '\x1b[36m', // Cyan
        info: '\x1b[32m',  // Green
        warn: '\x1b[33m',  // Yellow
        error: '\x1b[31m', // Red
        fatal: '\x1b[35m'  // Magenta
      };
      
      const reset = '\x1b[0m';
      const color = colorCodes[entry.level];
      
      let output = `${color}[${entry.level.toUpperCase()}]${reset} ${entry.timestamp} - ${entry.message}`;
      
      if (entry.context && Object.keys(entry.context).length > 0) {
        output += `\n  Context: ${JSON.stringify(entry.context, null, 2)}`;
      }
      
      if (entry.error) {
        output += `\n  Error: ${entry.error.name}: ${entry.error.message}`;
        if (entry.error.stack && this.isDevelopment) {
          output += `\n  Stack: ${entry.error.stack}`;
        }
      }
      
      return output;
    }
    
    // JSON format for production
    return JSON.stringify(entry);
  }

  private log(level: LogLevel, message: string, context?: LogContext, error?: Error): void {
    if (!this.shouldLog(level)) return;

    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level,
      message,
      context,
      error: error ? {
        name: error.name,
        message: error.message,
        stack: this.isDevelopment ? error.stack : undefined
      } : undefined
    };

    const formatted = this.formatLogEntry(entry);

    // Output to appropriate stream
    if (level === 'error' || level === 'fatal') {
      console.error(formatted);
    } else if (level === 'warn') {
      console.warn(formatted);
    } else {
      console.log(formatted);
    }

    // In production, you could also:
    // - Send to logging service (Sentry, LogRocket, etc.)
    // - Write to file
    // - Send to external log aggregator
  }

  debug(message: string, context?: LogContext): void {
    this.log('debug', message, context);
  }

  info(message: string, context?: LogContext): void {
    this.log('info', message, context);
  }

  warn(message: string, context?: LogContext, error?: Error): void {
    this.log('warn', message, context, error);
  }

  error(message: string, context?: LogContext, error?: Error): void {
    this.log('error', message, context, error);
  }

  fatal(message: string, context?: LogContext, error?: Error): void {
    this.log('fatal', message, context, error);
  }

  // Security audit logging
  audit(action: string, context: LogContext & { adminId?: string; details?: any }): void {
    this.info(`[AUDIT] ${action}`, {
      ...context,
      audit: true,
      timestamp: new Date().toISOString()
    });
  }

  // Performance logging
  performance(operation: string, durationMs: number, context?: LogContext): void {
    this.debug(`[PERFORMANCE] ${operation} took ${durationMs}ms`, {
      ...context,
      duration: durationMs,
      operation
    });
  }
}

// Export singleton instance
export const logger = Logger.getInstance();

// Performance logging helper
export function logPerformance(operation: string, durationMs: number, context?: LogContext): void {
  logger.performance(operation, durationMs, context);
}

// Helper functions for common logging patterns
export function logAPIRequest(
  method: string,
  path: string,
  context: {
    userId?: string;
    requestId: string;
    ip?: string;
    userAgent?: string;
  }
): void {
  logger.info(`API Request: ${method} ${path}`, {
    ...context,
    type: 'api_request'
  });
}

export function logAPIResponse(
  method: string,
  path: string,
  statusCode: number,
  durationMs: number,
  context: {
    userId?: string;
    requestId: string;
  }
): void {
  const level = statusCode >= 400 ? 'warn' : 'info';
  logger[level](`API Response: ${method} ${path} - ${statusCode}`, {
    ...context,
    type: 'api_response',
    statusCode,
    duration: durationMs
  });
}

export function logSecurityEvent(
  event: string,
  context: {
    userId?: string;
    ip?: string;
    userAgent?: string;
    details?: any;
    severity?: 'low' | 'medium' | 'high' | 'critical';
  }
): void {
  const severity = context.severity || 'medium';
  const level: LogLevel = severity === 'critical' || severity === 'high' ? 'error' : 'warn';
  
  logger[level](`[SECURITY] ${event}`, {
    ...context,
    type: 'security',
    severity
  });
}

export function logAuthEvent(
  event: 'login' | 'logout' | 'register' | 'password_change' | 'failed_login',
  context: {
    userId?: string;
    email?: string;
    ip?: string;
    userAgent?: string;
    success: boolean;
    reason?: string;
  }
): void {
  const level = event === 'failed_login' || !context.success ? 'warn' : 'info';
  
  logger[level](`[AUTH] ${event} - ${context.success ? 'SUCCESS' : 'FAILED'}`, {
    ...context,
    type: 'auth',
    event
  });
}
