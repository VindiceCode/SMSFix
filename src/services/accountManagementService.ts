import bonzoApiService from './bonzoApiService';
import { metricsCalculationService } from './metricsCalculationService';
import { AccountInfo } from '../types/accountTypes';

export interface AccountWithMetrics extends AccountInfo {
  responseRate: number;
  deliverability: number;
}

class AccountManagementService {
  async getAccounts(): Promise<AccountWithMetrics[]> {
    try {
      const accounts = await bonzoApiService.getAccountInfo('all');
      return accounts.map((account: AccountInfo) => {
        const metrics = metricsCalculationService.calculateAccountMetrics(account);
        return {
          ...account,
          responseRate: metrics.responseRate,
          deliverability: metrics.deliverability,
        };
      });
    } catch (error) {
      console.error('Failed to fetch accounts:', error);
      throw error;
    }
  }

  async createAccount(accountData: Partial<AccountInfo>): Promise<AccountInfo> {
    try {
      return await bonzoApiService.createAccount(accountData);
    } catch (error) {
      console.error('Failed to create account:', error);
      throw error;
    }
  }

  async updateAccount(accountId: string, accountData: Partial<AccountInfo>): Promise<AccountInfo> {
    try {
      return await bonzoApiService.updateAccount(accountId, accountData);
    } catch (error) {
      console.error('Failed to update account:', error);
      throw error;
    }
  }

  async deleteAccount(accountId: string): Promise<void> {
    try {
      await bonzoApiService.deleteAccount(accountId);
    } catch (error) {
      console.error('Failed to delete account:', error);
      throw error;
    }
  }
}

export const accountManagementService = new AccountManagementService();
