import { bonzoApiService } from './bonzoApiService';
import { accountManagementService } from './accountManagementService';
import { MetricsCalculationService } from './metricsCalculationService';

class DataPollingService {
  private pollingInterval: NodeJS.Timeout | null = null;
  private readonly POLLING_INTERVAL_MS = 5 * 60 * 1000; // 5 minutes
  private metricsService: MetricsCalculationService;

  constructor() {
    this.metricsService = new MetricsCalculationService();
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
    } catch (error) {
      console.error('Error fetching latest metrics:', error);
    }
  }

  startPolling(): void {
    if (this.pollingInterval) {
      console.warn('Polling is already active');
      return;
    }

    console.log('Starting data polling mechanism...');
    this.pollingInterval = setInterval(() => {
      this.fetchLatestMetrics();
    }, this.POLLING_INTERVAL_MS);

    // Fetch immediately on start
    this.fetchLatestMetrics();
  }

  stopPolling(): void {
    if (this.pollingInterval) {
      clearInterval(this.pollingInterval);
      this.pollingInterval = null;
      console.log('Data polling mechanism stopped');
    } else {
      console.warn('No active polling to stop');
    }
  }
}

export const dataPollingService = new DataPollingService();
