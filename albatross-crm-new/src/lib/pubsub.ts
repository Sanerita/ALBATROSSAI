import { PubSub } from '@google-cloud/pubsub';
import { zustandStore } from '@/lib/store';

const pubsub = new PubSub({
  projectId: process.env.GCP_PROJECT_ID,
  credentials: JSON.parse(process.env.GOOGLE_APPLICATION_CREDENTIALS!)
});

export function setupADKListeners() {
  const subscription = pubsub.subscription('crm-agent-updates');
  
  const messageHandler = (message: any) => {
    try {
      const data = JSON.parse(message.data.toString());
      
      switch (data.type) {
        case 'LEAD_SCORED':
          zustandStore.getState().updateLeadScore(data.leadId, data.score);
          break;
          
        case 'PIPELINE_ADVICE':
          zustandStore.getState().addRecommendation(
            data.leadId, 
            data.action
          );
          break;
      }
      
      message.ack();
    } catch (error) {
      console.error('[PUBSUB_ERROR]', error);
    }
  };

  subscription.on('message', messageHandler);
  
  return () => subscription.removeListener('message', messageHandler);
}