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
