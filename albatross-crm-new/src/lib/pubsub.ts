// src/lib/pubsub.ts
import { PubSub } from '@google-cloud/pubsub';
import type { Message } from '@google-cloud/pubsub';
import { logger } from '@/lib/logger';
import { useLeadStore } from '@/lib/store';

interface PubSubMessageBase {
  type: string;
  leadId: string;
  timestamp?: string;
}

interface LeadScoredMessage extends PubSubMessageBase {
  type: 'LEAD_SCORED';
  score: number;
  scoreComponents?: Record<string, number>;
}

interface PipelineAdviceMessage extends PubSubMessageBase {
  type: 'PIPELINE_ADVICE';
  action: string;
  confidence?: number;
  reason?: string;
}

type PubSubMessage = LeadScoredMessage | PipelineAdviceMessage;

export class PubSubService {
  private subscription;
  private activeListeners = new Set<() => void>();

  constructor(
    private readonly projectId: string,
    private readonly subscriptionName: string
  ) {
    const pubsub = new PubSub({
      projectId: this.projectId,
      credentials: JSON.parse(process.env.GOOGLE_APPLICATION_CREDENTIALS!)
    });

    this.subscription = pubsub.subscription(this.subscriptionName, {
      flowControl: {
        maxMessages: 10,
        allowExcessMessages: false
      }
    });
  }

  public setupListeners() {
    const messageHandler = async (message: Message) => {
      const startTime = Date.now();
      const messageId = message.id;
      const eventId = crypto.randomUUID();

      try {
        const data = this.parseMessage(message);
        logger.debug('Processing Pub/Sub message', {
          eventId,
          messageId,
          messageType: data.type,
          leadId: data.leadId
        });

        switch (data.type) {
          case 'LEAD_SCORED':
            useLeadStore.getState().updateLeadScore(
              data.leadId,
              data.score
            );
            break;

          case 'PIPELINE_ADVICE':
            useLeadStore.getState().addRecommendation(
              data.leadId,
              data.action
            );
            break;
        }

        const duration = Date.now() - startTime;
        logger.info('Successfully processed message', {
          eventId,
          messageId,
          messageType: data.type,
          leadId: data.leadId,
          durationMs: duration
        });

        await message.ack();
      } catch (error) {
        await this.handleProcessingError(error, message, eventId);
      }
    };

    const errorHandler = (error: Error) => {
      logger.error('Pub/Sub subscription error', {
        error: error.message,
        stack: error.stack
      });
    };

    this.subscription.on('message', messageHandler);
    this.subscription.on('error', errorHandler);

    this.activeListeners.add(() => {
      this.subscription.removeListener('message', messageHandler);
      this.subscription.removeListener('error', errorHandler);
    });

    return () => this.cleanup();
  }

  private parseMessage(message: Message): PubSubMessage {
    try {
      const data = JSON.parse(message.data.toString());

      if (!data.type || !data.leadId) {
        throw new Error('Missing required fields: type and leadId are required');
      }

      switch (data.type) {
        case 'LEAD_SCORED':
          if (typeof data.score !== 'number') {
            throw new Error('Invalid score: must be a number');
          }
          break;

        case 'PIPELINE_ADVICE':
          if (typeof data.action !== 'string') {
            throw new Error('Invalid action: must be a string');
          }
          break;

        default:
          throw new Error(`Unknown message type: ${data.type}`);
      }

      return data as PubSubMessage;
    } catch (error) {
      logger.error('Message parsing failed', {
        messageId: message.id,
        rawData: message.data.toString().substring(0, 200),
        error: error instanceof Error ? error.message : 'Unknown error'
      });
      throw error;
    }
  }

  private async handleProcessingError(
    error: unknown,
    message: Message,
    eventId: string
  ) {
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

  public cleanup() {
    this.activeListeners.forEach(cleanup => cleanup());
    this.activeListeners.clear();
    logger.info('Pub/Sub listeners cleaned up');
  }
}

// Usage example:
// const pubSubService = new PubSubService(
//   process.env.GCP_PROJECT_ID!,
//   'crm-updates'
// );
// const cleanup = pubSubService.setupListeners();
// // Later...
// cleanup();