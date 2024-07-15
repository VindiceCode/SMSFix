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
