import { accountManagementService } from '../../src/services/accountManagementService';
import { optimizationEngine } from '../../src/services/optimizationEngine';
import { MetricsCalculationService } from '../../src/services/metricsCalculationService';

describe('Basic Flow Integration', () => {
  test('Fetch accounts, calculate metrics, and generate optimization suggestions', async () => {
    // Mock the API call to get accounts
    jest.spyOn(accountManagementService, 'getAccounts').mockResolvedValue([
      { id: '1', name: 'Account 1', totalMessages: 100, totalResponses: 40, deliveredMessages: 80 },
      { id: '2', name: 'Account 2', totalMessages: 100, totalResponses: 60, deliveredMessages: 90 },
      { id: '3', name: 'Account 3', totalMessages: 100, totalResponses: 30, deliveredMessages: 40 },
    ]);

    // Fetch accounts
    const accounts = await accountManagementService.getAccounts();
    expect(accounts.length).toBe(3);

    // Calculate metrics
    const metricsService = new MetricsCalculationService();
    const accountsWithMetrics = accounts.map(account => ({
      ...account,
      ...metricsService.calculateAccountMetrics(account),
    }));

    // Verify metrics calculation
    expect(accountsWithMetrics[0].responseRate).toBe(40);
    expect(accountsWithMetrics[0].deliverability).toBe(80);

    // Generate optimization suggestions
    const underperformingAccounts = optimizationEngine.identifyUnderperformingAccounts(accountsWithMetrics);
    expect(underperformingAccounts.length).toBe(2);

    const suggestions = optimizationEngine.suggestContactTransfers(underperformingAccounts, accountsWithMetrics);
    expect(suggestions.size).toBe(2);
    expect(suggestions.get('1')).toEqual(['2']);
    expect(suggestions.get('3')).toEqual(['2']);
  });
});
import { accountManagementService } from '../../src/services/accountManagementService';
import { optimizationEngine } from '../../src/services/optimizationEngine';
import { MetricsCalculationService } from '../../src/services/metricsCalculationService';
import { dataPollingService } from '../../src/services/dataPollingService';
import { bonzoApiService } from '../../src/services/bonzoApiService';

jest.mock('../../src/services/bonzoApiService');

describe('Basic Flow Integration', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('Fetch accounts, calculate metrics, and generate optimization suggestions', async () => {
    const mockAccounts = [
      { id: '1', name: 'Account 1', totalMessages: 100, totalResponses: 40, deliveredMessages: 80 },
      { id: '2', name: 'Account 2', totalMessages: 100, totalResponses: 60, deliveredMessages: 90 },
      { id: '3', name: 'Account 3', totalMessages: 100, totalResponses: 30, deliveredMessages: 40 },
    ];

    jest.spyOn(accountManagementService, 'getAccounts').mockResolvedValue(mockAccounts);

    // Fetch accounts
    const accounts = await accountManagementService.getAccounts();
    expect(accounts.length).toBe(3);

    // Calculate metrics
    const metricsService = new MetricsCalculationService();
    const accountsWithMetrics = accounts.map(account => ({
      ...account,
      ...metricsService.calculateAccountMetrics(account),
    }));

    // Verify metrics calculation
    expect(accountsWithMetrics[0].responseRate).toBe(40);
    expect(accountsWithMetrics[0].deliverability).toBe(80);

    // Generate optimization suggestions
    const underperformingAccounts = optimizationEngine.identifyUnderperformingAccounts(accountsWithMetrics);
    expect(underperformingAccounts.length).toBe(2);

    const suggestions = optimizationEngine.suggestContactTransfers(underperformingAccounts, accountsWithMetrics);
    expect(suggestions.size).toBe(2);
    expect(suggestions.get('1')).toEqual(['2']);
    expect(suggestions.get('3')).toEqual(['2']);
  });

  test('Data polling updates metrics and triggers optimization', async () => {
    const initialAccounts = [
      { id: '1', name: 'Account 1', totalMessages: 100, totalResponses: 40, deliveredMessages: 80 },
      { id: '2', name: 'Account 2', totalMessages: 100, totalResponses: 60, deliveredMessages: 90 },
    ];

    const updatedAccounts = [
      { id: '1', name: 'Account 1', totalMessages: 150, totalResponses: 70, deliveredMessages: 130 },
      { id: '2', name: 'Account 2', totalMessages: 120, totalResponses: 65, deliveredMessages: 110 },
    ];

    jest.spyOn(bonzoApiService, 'getAccountInfo')
      .mockResolvedValueOnce(initialAccounts)
      .mockResolvedValueOnce(updatedAccounts);

    // Initial fetch
    await dataPollingService.fetchLatestMetrics();
    let accounts = await accountManagementService.getAccounts();
    expect(accounts[0].totalMessages).toBe(100);
    expect(accounts[1].totalMessages).toBe(100);

    // Simulate time passing and another poll
    jest.advanceTimersByTime(5 * 60 * 1000); // 5 minutes
    await dataPollingService.fetchLatestMetrics();
    accounts = await accountManagementService.getAccounts();
    expect(accounts[0].totalMessages).toBe(150);
    expect(accounts[1].totalMessages).toBe(120);

    // Verify that optimization suggestions are updated
    const metricsService = new MetricsCalculationService();
    const accountsWithMetrics = accounts.map(account => ({
      ...account,
      ...metricsService.calculateAccountMetrics(account),
    }));

    const underperformingAccounts = optimizationEngine.identifyUnderperformingAccounts(accountsWithMetrics);
    const suggestions = optimizationEngine.suggestContactTransfers(underperformingAccounts, accountsWithMetrics);

    // No suggestions should be made as both accounts are now performing well
    expect(suggestions.size).toBe(0);
  });
});
