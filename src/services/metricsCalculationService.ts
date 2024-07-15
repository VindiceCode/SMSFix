import { AccountInfo } from '../types/accountTypes';

export interface Metrics {
  responseRate: number;
  deliverability: number;
}

export interface AccountMetrics extends Metrics {
  accountId: string;
  accountName: string;
}

export interface OverallMetrics extends Metrics {
  totalAccounts: number;
  totalMessages: number;
}

export class MetricsCalculationService {
  calculateAccountMetrics(account: AccountInfo): AccountMetrics {
    const responseRate = account.totalMessages > 0
      ? (account.totalResponses / account.totalMessages) * 100
      : 0;
    const deliverability = account.totalMessages > 0
      ? (account.deliveredMessages / account.totalMessages) * 100
      : 0;

    return {
      accountId: account.id,
      accountName: account.name,
      responseRate: parseFloat(responseRate.toFixed(2)),
      deliverability: parseFloat(deliverability.toFixed(2)),
    };
  }

  calculateOverallMetrics(accounts: AccountInfo[]): OverallMetrics {
    const totalAccounts = accounts.length;
    const totalMessages = accounts.reduce((sum, account) => sum + account.totalMessages, 0);
    const totalResponses = accounts.reduce((sum, account) => sum + account.totalResponses, 0);
    const totalDelivered = accounts.reduce((sum, account) => sum + account.deliveredMessages, 0);

    const responseRate = totalMessages > 0
      ? (totalResponses / totalMessages) * 100
      : 0;
    const deliverability = totalMessages > 0
      ? (totalDelivered / totalMessages) * 100
      : 0;

    return {
      totalAccounts,
      totalMessages,
      responseRate: parseFloat(responseRate.toFixed(2)),
      deliverability: parseFloat(deliverability.toFixed(2)),
    };
  }
}

export const metricsCalculationService = new MetricsCalculationService();
