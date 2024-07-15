import { MetricsCalculationService } from '../services/metricsCalculationService';
import { accountManagementService } from '../services/accountManagementService';
import { bonzoApiService } from '../services/bonzoApiService';

// Interfaces for webhook payload structures
interface NewMessageWebhook {
  accountId: string;
  messageId: string;
  status: 'sent' | 'delivered' | 'failed';
  timestamp: string;
}

interface ProspectUpdateWebhook {
  accountId: string;
  prospectId: string;
  status: 'responded' | 'unsubscribed';
  timestamp: string;
}

class WebhookHandlers {
  private metricsService: MetricsCalculationService;

  constructor() {
    this.metricsService = new MetricsCalculationService();
  }

  async handleNewMessage(payload: NewMessageWebhook): Promise<void> {
    try {
      console.log(`Processing new message webhook for account ${payload.accountId}`);

      // Update account metrics
      const account = await accountManagementService.getAccountById(payload.accountId);
      if (!account) {
        throw new Error(`Account not found: ${payload.accountId}`);
      }

      account.totalMessages += 1;
      if (payload.status === 'delivered') {
        account.deliveredMessages += 1;
      }

      // Recalculate metrics
      const updatedMetrics = this.metricsService.calculateAccountMetrics(account);

      // Update account in the database
      await bonzoApiService.updateAccount(account.id, {
        totalMessages: account.totalMessages,
        deliveredMessages: account.deliveredMessages,
        ...updatedMetrics
      });

      console.log(`Successfully processed new message webhook for account ${payload.accountId}`);
    } catch (error) {
      console.error(`Error processing new message webhook: ${error}`);
      throw error;
    }
  }

  async handleProspectUpdate(payload: ProspectUpdateWebhook): Promise<void> {
    try {
      console.log(`Processing prospect update webhook for account ${payload.accountId}`);

      // Update account metrics
      const account = await accountManagementService.getAccountById(payload.accountId);
      if (!account) {
        throw new Error(`Account not found: ${payload.accountId}`);
      }

      if (payload.status === 'responded') {
        account.totalResponses += 1;
      }

      // Recalculate metrics
      const updatedMetrics = this.metricsService.calculateAccountMetrics(account);

      // Update account in the database
      await bonzoApiService.updateAccount(account.id, {
        totalResponses: account.totalResponses,
        ...updatedMetrics
      });

      console.log(`Successfully processed prospect update webhook for account ${payload.accountId}`);
    } catch (error) {
      console.error(`Error processing prospect update webhook: ${error}`);
      throw error;
    }
  }
}

export const webhookHandlers = new WebhookHandlers();
import { createHmac } from 'crypto';
import bonzoApiConfig from '../config/bonzoApiConfig';
import { bonzoApiService } from '../services/bonzoApiService';

interface WebhookPayload {
  event: string;
  data: any;
}

export const verifyWebhookSignature = (signature: string, body: string): boolean => {
  const hmac = createHmac('sha256', bonzoApiConfig.webhookSecret);
  const expectedSignature = hmac.update(body).digest('hex');
  return signature === expectedSignature;
};

export const handleNewMessageWebhook = async (payload: WebhookPayload): Promise<void> => {
  // Implement logic to handle new message webhook
  console.log('New message received:', payload);
  // Update relevant metrics or trigger necessary actions
};

export const handleProspectUpdateWebhook = async (payload: WebhookPayload): Promise<void> => {
  // Implement logic to handle prospect update webhook
  console.log('Prospect updated:', payload);
  // Update relevant metrics or trigger necessary actions
};

export const processWebhook = async (signature: string, body: string): Promise<void> => {
  if (!verifyWebhookSignature(signature, body)) {
    throw new Error('Invalid webhook signature');
  }

  const payload: WebhookPayload = JSON.parse(body);

  switch (payload.event) {
    case 'new_message':
      await handleNewMessageWebhook(payload);
      break;
    case 'prospect_update':
      await handleProspectUpdateWebhook(payload);
      break;
    default:
      console.warn('Unhandled webhook event:', payload.event);
  }
};
