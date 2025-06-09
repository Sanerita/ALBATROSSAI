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
  
  export interface Transport {
    log(entry: LogEntry): void;
  }
  
  export enum LogLevel {
    ERROR = 'error',
    WARN = 'warn',
    INFO = 'info',
    DEBUG = 'debug',
    TRACE = 'trace'
  }