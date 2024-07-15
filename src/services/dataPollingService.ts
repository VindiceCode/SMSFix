import { bonzoApiService } from './bonzoApiService';
import { accountManagementService } from './accountManagementService';
import { metricsCalculationService } from './metricsCalculationService';

class DataPollingService {
  private pollingInterval: NodeJS.Timeout | null = null;
  private readonly DEFAULT_POLLING_INTERVAL_MS = 5 * 60 * 1000; // 5 minutes
  private readonly MAX_RETRY_INTERVAL_MS = 30 * 60 * 1000; // 30 minutes
  private currentPollingInterval: number;
  private retryCount: number = 0;
  private metricsService: MetricsCalculationService;

  constructor(pollingInterval: number = 5 * 60 * 1000) {
    this.metricsService = new MetricsCalculationService();
    this.currentPollingInterval = pollingInterval;
  }

  async fetchLatestMetrics(): Promise<void> {
    try {
      console.log('Fetching latest metrics from Bonzo API...');
      const accounts = await bonzoApiService.getAccountInfo('all');
      
      for (const account of accounts) {
        const updatedMetrics = this.metricsService.calculateAccountMetrics(account);
        await accountManagementService.updateAccount(account.id, updatedMetrics);
      }

      console.log('Successfully updated metrics for all accounts');
      this.retryCount = 0;
      this.currentPollingInterval = this.DEFAULT_POLLING_INTERVAL_MS;
    } catch (error) {
      console.error('Error fetching latest metrics:', error);
      this.handleError();
    }
  }

  private handleError(): void {
    this.retryCount++;
    const backoffFactor = Math.min(Math.pow(2, this.retryCount), this.MAX_RETRY_INTERVAL_MS / this.DEFAULT_POLLING_INTERVAL_MS);
    this.currentPollingInterval = Math.min(this.DEFAULT_POLLING_INTERVAL_MS * backoffFactor, this.MAX_RETRY_INTERVAL_MS);
    console.log(`Retrying in ${this.currentPollingInterval / 1000} seconds...`);
  }

  startPolling(): void {
    if (this.pollingInterval) {
      console.warn('Polling is already active');
      return;
    }

    console.log('Starting data polling mechanism...');
    this.scheduleNextPoll();

    // Fetch immediately on start
    this.fetchLatestMetrics();
  }

  private scheduleNextPoll(): void {
    this.pollingInterval = setTimeout(() => {
      this.fetchLatestMetrics();
      this.scheduleNextPoll();
    }, this.currentPollingInterval);
  }

  stopPolling(): void {
    if (this.pollingInterval) {
      clearTimeout(this.pollingInterval);
      this.pollingInterval = null;
      console.log('Data polling mechanism stopped');
    } else {
      console.warn('No active polling to stop');
    }
  }
}

export const dataPollingService = new DataPollingService();
