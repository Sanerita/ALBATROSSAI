// src/services/pubsub-listener.ts
import { PubSub, type Message } from '@google-cloud/pubsub';
import { logger } from '@/lib/logger';
import { useLeadStore } from '@/lib/store';

interface PubSubEvent {
  leadId: string;
  payload: Record<string, unknown>;
  metadata: {
    eventId: string;
    timestamp: string;
    originalMessageId: string;
    agentSource?: string;
  };
}

interface LegacyPubSubEvent {
  event: string;
  data: any;
}

export class ADKListener {
  private subscription;
  private activeListeners = new Set<() => void>();
  private isRunning = false;
  private retryCount = 0;
  private readonly maxRetries = 5;
  private readonly retryDelay = 5000;

  constructor(
    private readonly projectId: string,
    private readonly subscriptionName: string,
    private readonly options: {
      maxMessages?: number;
      deadLetterTopic?: string;
    } = {}
  ) {
    const pubsub = new PubSub({ projectId });
    this.subscription = pubsub.subscription(subscriptionName, {
      flowControl: {
        maxMessages: options.maxMessages ?? 100,
        allowExcessMessages: false,
      },
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
      subscription: this.subscriptionName,
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
          messageId: message.id,
        });

        this.validateEvent(data);
        useLeadStore.getState().updateLead(data.leadId, data.payload);

        const duration = Date.now() - startTime;
        logger.info('Successfully processed lead update', {
          eventId,
          leadId: data.leadId,
          durationMs: duration,
        });

        await message.ack();
      } catch (error) {
        await this.handleProcessingError(error, message, eventId);
      }
    };
  }

  private parseMessage(message: Message): PubSubEvent {
    const rawData = message.data.toString();
    const baseMetadata = {
      eventId: crypto.randomUUID(),
      timestamp: new Date().toISOString(),
      originalMessageId: message.id,
    };

    try {
      const data = JSON.parse(rawData);

      // Handle new format
      if (data.leadId && data.payload) {
        return {
          leadId: data.leadId,
          payload: data.payload,
          metadata: {
            ...baseMetadata,
            ...(data.metadata || {}),
          },
        };
      }

      // Handle legacy format {"event": "...", "data": "..."}
      if (data.event && data.data) {
        logger.warn('Processing legacy message format', { messageId: message.id });
        return {
          leadId: `legacy-${crypto.randomUUID()}`,
          payload: {
            event: data.event,
            data: data.data,
          },
          metadata: baseMetadata,
        };
      }

      throw new Error(`Unsupported message format: ${rawData.substring(0, 100)}`);
    } catch (error) {
      logger.error('Message parsing failed', {
        error: error instanceof Error ? error.message : 'Unknown error',
        rawData: rawData.substring(0, 200),
      });
      throw error;
    }
  }

  private validateEvent(event: PubSubEvent) {
    if (!event.leadId || typeof event.leadId !== 'string') {
      throw new Error('Invalid leadId in event');
    }

    if (!event.payload || typeof event.payload !== 'object') {
      throw new Error('Invalid payload in event');
    }
  }

  private async handleProcessingError(error: unknown, message: Message, eventId: string) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    const rawData = message.data.toString().substring(0, 200);

    logger.error('Failed to process message', {
      eventId,
      messageId: message.id,
      error: errorMessage,
      rawData,
      action: 'nacking',
    });

    try {
      await message.nack();
    } catch (nackError) {
      logger.error('Failed to nack message', {
        eventId,
        messageId: message.id,
        error: nackError instanceof Error ? nackError.message : 'Unknown error',
      });
    }
  }

  private createErrorHandler() {
    return (error: Error) => {
      logger.error('Pub/Sub connection error', {
        error: error.message,
        stack: error.stack,
        retryCount: this.retryCount,
      });

      if (this.retryCount < this.maxRetries) {
        setTimeout(() => {
          this.retryCount++;
          this.restart().catch(() => {});
        }, this.retryDelay * this.retryCount);
      } else {
        this.shutdown();
        process.exit(1);
      }
    };
  }

  private handleStartupError(error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    logger.error('Failed to initialize listener', {
      error: errorMessage,
      retryCount: this.retryCount,
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

    this.activeListeners.forEach(cleanup => cleanup());
    this.activeListeners.clear();

    try {
      await this.subscription.close();
    } catch (error) {
      logger.error('Error during shutdown', {
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }
}

// Helper function for publishers
export function createPubSubMessage(
  leadId: string,
  payload: Record<string, unknown>,
  metadata?: Omit<PubSubEvent['metadata'], 'eventId' | 'timestamp' | 'originalMessageId'>
): Buffer {
  const message = {
    leadId,
    payload,
    metadata: {
      eventId: crypto.randomUUID(),
      timestamp: new Date().toISOString(),
      ...metadata,
    },
  };
  return Buffer.from(JSON.stringify(message));
}

// Usage example
const listener = new ADKListener(
  process.env.GCP_PROJECT_ID!,
  'crm-updates',
  {
    maxMessages: 100,
    deadLetterTopic: process.env.DEAD_LETTER_TOPIC,
  }
);

process.on('SIGTERM', () => listener.shutdown());
process.on('SIGINT', () => listener.shutdown());