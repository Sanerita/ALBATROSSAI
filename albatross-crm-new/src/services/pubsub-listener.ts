// src/services/pubsub-listener.ts
import { PubSub, type Message } from '@google-cloud/pubsub';
import { logger } from '@/lib/logger';
import { useLeadStore } from '@/lib/store';

interface PubSubEvent {
  leadId: string;
  payload: Record<string, unknown>;
  metadata?: {
    eventId: string;
    timestamp: string;
    agentSource?: string;
  };
}

export class ADKListener {
  private subscription;
  private activeListeners = new Set<() => void>();
  private isRunning = false;
  private retryCount = 0;
  private maxRetries = 5;
  private retryDelay = 5000;

  constructor(private projectId: string, private subscriptionName: string) {
    const pubsub = new PubSub({
      projectId,
      retryOptions: {
        maxRetries: 3,
        maxRetryDelay: 60_000,
        totalTimeout: 600_000
      }
    });

    this.subscription = pubsub.subscription(subscriptionName, {
      flowControl: {
        maxMessages: 100,
        allowExcessMessages: false
      }
    });
  }

  async start() {
    if (this.isRunning) {
      logger.warn('Listener already running');
      return;
    }

    this.isRunning = true;
    logger.info('Starting ADK Pub/Sub listener', {
      projectId: this.projectId,
      subscription: this.subscriptionName
    });

    try {
      const messageHandler = this.createMessageHandler();
      const errorHandler = this.createErrorHandler();

      this.subscription.on('message', messageHandler);
      this.subscription.on('error', errorHandler);

      this.activeListeners.add(() => {
        this.subscription.removeListener('message', messageHandler);
        this.subscription.removeListener('error', errorHandler);
      });

      // Test connection
      await this.subscription.getMetadata();
      this.retryCount = 0;
    } catch (error) {
      this.handleStartupError(error);
    }
  }

  private createMessageHandler() {
    return async (message: Message) => {
      const startTime = Date.now();
      const eventId = crypto.randomUUID();

      try {
        const data = this.parseMessage(message);
        logger.debug('Processing Pub/Sub message', {
          eventId,
          leadId: data.leadId,
          messageId: message.id
        });

        // Validate payload schema
        this.validateEvent(data);

        // Process update
        useLeadStore.getState().updateLead(data.leadId, data.payload);

        // Metrics
        const duration = Date.now() - startTime;
        logger.info('Successfully processed lead update', {
          eventId,
          leadId: data.leadId,
          durationMs: duration,
          metadata: data.metadata
        });

        await message.ack();
      } catch (error) {
        await this.handleProcessingError(error, message, eventId);
      }
    };
  }

  private createErrorHandler() {
    return (error: Error) => {
      logger.error('Pub/Sub connection error', {
        error: error.message,
        stack: error.stack,
        retryCount: this.retryCount
      });

      if (this.retryCount < this.maxRetries) {
        setTimeout(() => {
          this.retryCount++;
          this.restart().catch(() => {});
        }, this.retryDelay * this.retryCount);
      } else {
        this.shutdown();
        process.exit(1); // Let process manager restart
      }
    };
  }

  private parseMessage(message: Message): PubSubEvent {
    try {
      const data = JSON.parse(message.data.toString());
      if (!data.leadId || !data.payload) {
        throw new Error('Invalid message format');
      }
      return data;
    } catch (error) {
      throw new Error(`Message parsing failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  private validateEvent(event: PubSubEvent) {
    if (typeof event.leadId !== 'string' || !event.leadId) {
      throw new Error('Invalid leadId in event');
    }

    if (typeof event.payload !== 'object' || !event.payload) {
      throw new Error('Invalid payload in event');
    }
  }

  private async handleProcessingError(error: unknown, message: Message, eventId: string) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';

    logger.error('Failed to process message', {
      eventId,
      messageId: message.id,
      error: errorMessage,
      action: 'nacking'
    });

    try {
      await message.nack();
    } catch (nackError) {
      logger.error('Failed to nack message', {
        eventId,
        messageId: message.id,
        error: nackError instanceof Error ? nackError.message : 'Unknown error'
      });
    }
  }

  private handleStartupError(error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    logger.error('Failed to initialize listener', {
      error: errorMessage,
      retryCount: this.retryCount
    });

    if (this.retryCount < this.maxRetries) {
      setTimeout(() => {
        this.retryCount++;
        this.start().catch(() => {});
      }, this.retryDelay * this.retryCount);
    } else {
      this.shutdown();
      throw new Error(`Failed to start after ${this.maxRetries} attempts`);
    }
  }

  async restart() {
    await this.shutdown();
    await this.start();
  }

  async shutdown() {
    if (!this.isRunning) return;

    logger.info('Shutting down Pub/Sub listener');
    this.isRunning = false;

    // Remove all listeners
    this.activeListeners.forEach(cleanup => cleanup());
    this.activeListeners.clear();

    try {
      await this.subscription.close();
    } catch (error) {
      logger.error('Error during shutdown', {
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }
}

// Usage example
const listener = new ADKListener(
  process.env.GCP_PROJECT_ID!,
  'crm-updates'
);

// Graceful shutdown
process.on('SIGTERM', () => listener.shutdown());
process.on('SIGINT', () => listener.shutdown());