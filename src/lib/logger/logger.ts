/**
 * Comprehensive Logging Strategy
 * 
 * Sistem logging yang lengkap untuk aplikasi PPSDM KMITS
 * Mendukung berbagai level log, structured logging, dan integrasi dengan error tracking
 * 
 * @see https://www.elastic.co/guide/en/ecs/current/ecs-reference.html
 */

/**
 * Log Level
 */
export enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3,
  FATAL = 4,
}

/**
 * Log Entry Structure
 */
export interface LogEntry {
  timestamp: string;
  level: LogLevel;
  levelName: string;
  message: string;
  context?: Record<string, any>;
  error?: {
    name: string;
    message: string;
    stack?: string;
  };
  userId?: string;
  requestId?: string;
  userAgent?: string;
  ip?: string;
  url?: string;
  method?: string;
  statusCode?: number;
  duration?: number;
}

/**
 * Logger Configuration
 */
interface LoggerConfig {
  minLevel: LogLevel;
  enableConsole: boolean;
  enableFile: boolean;
  enableRemote: boolean;
  remoteEndpoint?: string;
  remoteApiKey?: string;
}

/**
 * Default configuration
 */
const defaultConfig: LoggerConfig = {
  minLevel: process.env.NODE_ENV === 'production' ? LogLevel.INFO : LogLevel.DEBUG,
  enableConsole: true,
  enableFile: false, // File logging disabled for zero-cost solution
  enableRemote: false, // Remote logging disabled for zero-cost solution
};

/**
 * Logger Class
 */
export class Logger {
  private config: LoggerConfig;
  private requestId?: string;
  private userId?: string;

  constructor(config: Partial<LoggerConfig> = {}) {
    this.config = { ...defaultConfig, ...config };
  }

  /**
   * Set request ID untuk konteks request saat ini
   */
  setRequestId(requestId: string): void {
    this.requestId = requestId;
  }

  /**
   * Set user ID untuk konteks user saat ini
   */
  setUserId(userId: string): void {
    this.userId = userId;
  }

  /**
   * Clear context
   */
  clearContext(): void {
    this.requestId = undefined;
    this.userId = undefined;
  }

  /**
   * Log entry
   */
  private log(entry: LogEntry): void {
    // Check minimum level
    if (entry.level < this.config.minLevel) {
      return;
    }

    // Add context
    if (this.requestId) {
      entry.requestId = this.requestId;
    }
    if (this.userId) {
      entry.userId = this.userId;
    }

    // Console logging
    if (this.config.enableConsole) {
      this.logToConsole(entry);
    }

    // File logging (disabled for zero-cost)
    if (this.config.enableFile) {
      this.logToFile(entry);
    }

    // Remote logging (disabled for zero-cost)
    if (this.config.enableRemote) {
      this.logToRemote(entry);
    }
  }

  /**
   * Log to console
   */
  private logToConsole(entry: LogEntry): void {
    const logMethod = this.getConsoleMethod(entry.level);
    const prefix = `[${entry.levelName}] ${entry.timestamp}`;

    if (entry.error) {
      logMethod(
        prefix,
        entry.message,
        entry.context || '',
        '\nError:',
        entry.error
      );
    } else {
      logMethod(prefix, entry.message, entry.context || '');
    }
  }

  /**
   * Log to file (placeholder for future implementation)
   */
  private logToFile(entry: LogEntry): void {
    // File logging disabled for zero-cost solution
    // Can be implemented with fs module if needed
  }

  /**
   * Log to remote service (placeholder for future implementation)
   */
  private async logToRemote(entry: LogEntry): Promise<void> {
    // Remote logging disabled for zero-cost solution
    // Can be implemented with external logging service if needed
  }

  /**
   * Get console method based on level
   */
  private getConsoleMethod(level: LogLevel): (...args: any[]) => void {
    switch (level) {
      case LogLevel.DEBUG:
        return console.debug;
      case LogLevel.INFO:
        return console.info;
      case LogLevel.WARN:
        return console.warn;
      case LogLevel.ERROR:
      case LogLevel.FATAL:
        return console.error;
      default:
        return console.log;
    }
  }

  /**
   * Debug level log
   */
  debug(message: string, context?: Record<string, any>): void {
    this.log({
      timestamp: new Date().toISOString(),
      level: LogLevel.DEBUG,
      levelName: 'DEBUG',
      message,
      context,
    });
  }

  /**
   * Info level log
   */
  info(message: string, context?: Record<string, any>): void {
    this.log({
      timestamp: new Date().toISOString(),
      level: LogLevel.INFO,
      levelName: 'INFO',
      message,
      context,
    });
  }

  /**
   * Warn level log
   */
  warn(message: string, context?: Record<string, any>): void {
    this.log({
      timestamp: new Date().toISOString(),
      level: LogLevel.WARN,
      levelName: 'WARN',
      message,
      context,
    });
  }

  /**
   * Error level log
   */
  error(message: string, error?: Error, context?: Record<string, any>): void {
    this.log({
      timestamp: new Date().toISOString(),
      level: LogLevel.ERROR,
      levelName: 'ERROR',
      message,
      error: error ? {
        name: error.name,
        message: error.message,
        stack: error.stack,
      } : undefined,
      context,
    });
  }

  /**
   * Fatal level log
   */
  fatal(message: string, error?: Error, context?: Record<string, any>): void {
    this.log({
      timestamp: new Date().toISOString(),
      level: LogLevel.FATAL,
      levelName: 'FATAL',
      message,
      error: error ? {
        name: error.name,
        message: error.message,
        stack: error.stack,
      } : undefined,
      context,
    });
  }

  /**
   * Log HTTP request
   */
  logRequest(
    method: string,
    url: string,
    statusCode: number,
    duration: number,
    context?: Record<string, any>
  ): void {
    const level = statusCode >= 500 ? LogLevel.ERROR : statusCode >= 400 ? LogLevel.WARN : LogLevel.INFO;
    this.log({
      timestamp: new Date().toISOString(),
      level,
      levelName: LogLevel[level],
      message: `${method} ${url} - ${statusCode}`,
      context: {
        ...context,
        method,
        url,
        statusCode,
        duration,
      },
    });
  }

  /**
   * Log database query
   */
  logQuery(
    query: string,
    duration: number,
    context?: Record<string, any>
  ): void {
    this.log({
      timestamp: new Date().toISOString(),
      level: LogLevel.DEBUG,
      levelName: 'DEBUG',
      message: `Database query executed`,
      context: {
        ...context,
        query: query.substring(0, 200), // Truncate long queries
        duration,
      },
    });
  }

  /**
   * Log user action
   */
  logUserAction(
    action: string,
    context?: Record<string, any>
  ): void {
    this.log({
      timestamp: new Date().toISOString(),
      level: LogLevel.INFO,
      levelName: 'INFO',
      message: `User action: ${action}`,
      context: {
        ...context,
        action,
      },
    });
  }

  /**
   * Log security event
   */
  logSecurityEvent(
    event: string,
    context?: Record<string, any>
  ): void {
    this.log({
      timestamp: new Date().toISOString(),
      level: LogLevel.WARN,
      levelName: 'WARN',
      message: `Security event: ${event}`,
      context: {
        ...context,
        event,
      },
    });
  }
}

/**
 * Global logger instance
 */
export const logger = new Logger();

/**
 * Create child logger with context
 */
export function createLogger(context: Record<string, any>): Logger {
  const childLogger = new Logger();
  childLogger['context'] = context;
  return childLogger;
}

/**
 * Generate request ID
 */
export function generateRequestId(): string {
  return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Log middleware untuk Next.js API routes
 */
export function withLogging(handler: any) {
  return async (req: Request) => {
    const requestId = generateRequestId();
    const startTime = Date.now();
    const url = req.url;
    const method = req.method;

    logger.setRequestId(requestId);
    logger.info(`Incoming request: ${method} ${url}`);

    try {
      const response = await handler(req);
      const duration = Date.now() - startTime;
      const statusCode = response.status;

      logger.logRequest(method, url, statusCode, duration);

      return response;
    } catch (error) {
      const duration = Date.now() - startTime;
      logger.error(`Request failed: ${method} ${url}`, error as Error, { duration });
      throw error;
    } finally {
      logger.clearContext();
    }
  };
}
