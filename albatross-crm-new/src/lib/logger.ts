// src/lib/logger.ts
import { type LogEntry, type Transport } from './logger.types';
import { format } from 'util';

/**
 * Log severity levels
 */
export enum LogLevel {
  ERROR = 'error',
  WARN = 'warn',
  INFO = 'info',
  DEBUG = 'debug',
  TRACE = 'trace'
}

/**
 * Standard log entry structure
 */
export interface LogEntry {
  timestamp: string;
  level: LogLevel;
  message: string;
  context?: Record<string, unknown>;
  error?: {
    name: string;
    message: string;
    stack?: string;
    code?: string | number;
  };
}

/**
 * Transport interface for log outputs
 */
export interface Transport {
  log(entry: LogEntry): void;
}

/**
 * Console transport with color formatting
 */
class ConsoleTransport implements Transport {
  private readonly colors = {
    [LogLevel.ERROR]: '\x1b[31m', // Red
    [LogLevel.WARN]: '\x1b[33m',  // Yellow
    [LogLevel.INFO]: '\x1b[32m',  // Green
    [LogLevel.DEBUG]: '\x1b[36m', // Cyan
    [LogLevel.TRACE]: '\x1b[37m'  // White
  };

  private readonly resetColor = '\x1b[0m';

  log(entry: LogEntry): void {
    const color = this.colors[entry.level] || '';
    const level = entry.level.toUpperCase().padEnd(5);
    const timestamp = new Date(entry.timestamp).toISOString();
    
    let message = `${color}[${timestamp}] ${level}: ${entry.message}${this.resetColor}`;
    
    if (entry.context) {
      message += `\n${color}CONTEXT: ${JSON.stringify(entry.context, null, 2)}${this.resetColor}`;
    }
    
    if (entry.error) {
      message += `\n${color}ERROR: ${entry.error.name}: ${entry.error.message}`;
      if (entry.error.stack) {
        message += `\nSTACK: ${entry.error.stack.split('\n').slice(0, 4).join('\n')}...`;
      }
      message += this.resetColor;
    }

    console[entry.level](message);
  }
}

/**
 * File transport (rotating logs)
 */
class FileTransport implements Transport {
  private readonly fs = require('fs');
  private readonly path = require('path');
  private readonly os = require('os');
  private readonly stream: NodeJS.WritableStream;
  private readonly maxSize = 10 * 1024 * 1024; // 10MB
  private readonly maxFiles = 5;
  private currentSize = 0;

  constructor(private readonly logDir = 'logs') {
    this.ensureLogDir();
    this.stream = this.createStream();
  }

  private ensureLogDir(): void {
    if (!this.fs.existsSync(this.logDir)) {
      this.fs.mkdirSync(this.logDir, { recursive: true });
    }
  }

  private createStream(): NodeJS.WritableStream {
    const logPath = this.path.join(this.logDir, `albatross-${new Date().toISOString().split('T')[0]}.log`);
    return this.fs.createWriteStream(logPath, { flags: 'a' });
  }

  private rotateLog(): void {
    this.stream.end();
    const files = this.fs.readdirSync(this.logDir)
      .filter((file: string) => file.startsWith('albatross-'))
      .sort();
    
    if (files.length >= this.maxFiles) {
      this.fs.unlinkSync(this.path.join(this.logDir, files[0]));
    }
    
    this.currentSize = 0;
    this.stream = this.createStream();
  }

  log(entry: LogEntry): void {
    const logString = JSON.stringify(entry) + this.os.EOL;
    this.currentSize += Buffer.byteLength(logString, 'utf8');
    
    if (this.currentSize > this.maxSize) {
      this.rotateLog();
    }
    
    this.stream.write(logString);
  }
}

/**
 * Cloud Logging transport for GCP
 */
class CloudLoggingTransport implements Transport {
  private readonly logging = require('@google-cloud/logging');
  private readonly logger: any;

  constructor() {
    const logging = new this.logging.Logging();
    this.logger = logging.log('albatross-crm');
  }

  private getSeverity(level: LogLevel): string {
    const mapping: Record<LogLevel, string> = {
      [LogLevel.ERROR]: 'ERROR',
      [LogLevel.WARN]: 'WARNING',
      [LogLevel.INFO]: 'INFO',
      [LogLevel.DEBUG]: 'DEBUG',
      [LogLevel.TRACE]: 'DEBUG'
    };
    return mapping[level];
  }

  log(entry: LogEntry): void {
    const metadata = {
      resource: { type: 'global' },
      severity: this.getSeverity(entry.level),
      timestamp: entry.timestamp,
      labels: {
        service: 'crm',
        version: process.env.npm_package_version
      }
    };

    const logEntry = this.logger.entry(
      metadata,
      {
        message: entry.message,
        ...(entry.context && { context: entry.context }),
        ...(entry.error && { error: entry.error })
      }
    );

    this.logger.write(logEntry);
  }
}

/**
 * Main Logger class
 */
export class Logger {
  private readonly transports: Transport[];
  private readonly minLevel: LogLevel;

  constructor(options: { 
    minLevel?: LogLevel; 
    transports?: Transport[];
  } = {}) {
    this.minLevel = options.minLevel || 
      (process.env.NODE_ENV === 'production' ? LogLevel.INFO : LogLevel.DEBUG);
    
    this.transports = options.transports || [
      new ConsoleTransport(),
      ...(process.env.NODE_ENV === 'production' ? [
        new FileTransport(),
        new CloudLoggingTransport()
      ] : [])
    ];
  }

  private shouldLog(level: LogLevel): boolean {
    const levels = Object.values(LogLevel);
    return levels.indexOf(level) <= levels.indexOf(this.minLevel);
  }

  private prepareEntry(
    level: LogLevel,
    message: string,
    context?: Record<string, unknown>,
    error?: Error
  ): LogEntry {
    return {
      timestamp: new Date().toISOString(),
      level,
      message,
      ...(context && { context }),
      ...(error && {
        error: {
          name: error.name,
          message: error.message,
          stack: error.stack,
          ...('code' in error && { code: (error as any).code })
        }
      })
    };
  }

  private log(level: LogLevel, message: string, context?: Record<string, unknown>, error?: Error): void {
    if (!this.shouldLog(level)) return;

    const entry = this.prepareEntry(level, message, context, error);
    
    for (const transport of this.transports) {
      try {
        transport.log(entry);
      } catch (transportError) {
        console.error(`Logging transport failed: ${transportError}`);
      }
    }
  }

  public error(message: string, context?: Record<string, unknown>, error?: Error): void {
    this.log(LogLevel.ERROR, message, context, error);
  }

  public warn(message: string, context?: Record<string, unknown>): void {
    this.log(LogLevel.WARN, message, context);
  }

  public info(message: string, context?: Record<string, unknown>): void {
    this.log(LogLevel.INFO, message, context);
  }

  public debug(message: string, context?: Record<string, unknown>): void {
    this.log(LogLevel.DEBUG, message, context);
  }

  public trace(message: string, context?: Record<string, unknown>): void {
    this.log(LogLevel.TRACE, message, context);
  }
}

// Global logger instance
export const logger = new Logger();

// Type definitions for the logger (src/lib/logger.types.ts)
export interface Logger {
  error(message: string, context?: Record<string, unknown>, error?: Error): void;
  warn(message: string, context?: Record<string, unknown>): void;
  info(message: string, context?: Record<string, unknown>): void;
  debug(message: string, context?: Record<string, unknown>): void;
  trace(message: string, context?: Record<string, unknown>): void;
}