import { MetricsCalculationService } from '../../src/services/metricsCalculationService';
import { OptimizationEngine } from '../../src/services/optimizationEngine';
import { AccountWithMetrics } from '../../src/types/account';

describe('MetricsCalculationService', () => {
  const metricsService = new MetricsCalculationService();

  test('calculateAccountMetrics returns correct metrics', () => {
    const account = {
      id: '1',
      name: 'Test Account',
      totalMessages: 100,
      totalResponses: 60,
      deliveredMessages: 90,
    };

    const metrics = metricsService.calculateAccountMetrics(account);

    expect(metrics.responseRate).toBe(60);
    expect(metrics.deliverability).toBe(90);
    expect(metrics.accountId).toBe('1');
    expect(metrics.accountName).toBe('Test Account');
  });
});

describe('OptimizationEngine', () => {
  const optimizationEngine = new OptimizationEngine();

  test('identifyUnderperformingAccounts correctly identifies accounts', () => {
    const accounts: AccountWithMetrics[] = [
      { id: '1', name: 'Account 1', responseRate: 40, deliverability: 80 },
      { id: '2', name: 'Account 2', responseRate: 60, deliverability: 90 },
      { id: '3', name: 'Account 3', responseRate: 30, deliverability: 40 },
    ];

    const underperforming = optimizationEngine.identifyUnderperformingAccounts(accounts);

    expect(underperforming.length).toBe(2);
    expect(underperforming[0].id).toBe('1');
    expect(underperforming[1].id).toBe('3');
  });

  test('suggestContactTransfers provides correct suggestions', () => {
    const accounts: AccountWithMetrics[] = [
      { id: '1', name: 'Account 1', responseRate: 40, deliverability: 80 },
      { id: '2', name: 'Account 2', responseRate: 60, deliverability: 90 },
      { id: '3', name: 'Account 3', responseRate: 30, deliverability: 40 },
    ];

    const underperforming = optimizationEngine.identifyUnderperformingAccounts(accounts);
    const suggestions = optimizationEngine.suggestContactTransfers(underperforming, accounts);

    expect(suggestions.size).toBe(2);
    expect(suggestions.get('1')).toEqual(['2']);
    expect(suggestions.get('3')).toEqual(['2']);
  });
});
