import { AccountWithMetrics } from '../types/account';
import { Contact } from '../types/contact';

export class OptimizationEngine {
  private UNDERPERFORMING_THRESHOLD: number = 50; // 50% response rate or deliverability

  identifyUnderperformingAccounts(accounts: AccountWithMetrics[]): AccountWithMetrics[] {
    return accounts.filter(account => 
      account.responseRate < this.UNDERPERFORMING_THRESHOLD || 
      account.deliverability < this.UNDERPERFORMING_THRESHOLD
    );
  }

  suggestContactTransfers(underperformingAccounts: AccountWithMetrics[], allAccounts: AccountWithMetrics[]): Map<string, string[]> {
    const suggestions = new Map<string, string[]>();

    underperformingAccounts.forEach(underperformingAccount => {
      const betterPerformingAccounts = allAccounts.filter(account => 
        account.id !== underperformingAccount.id &&
        account.responseRate > underperformingAccount.responseRate &&
        account.deliverability > underperformingAccount.deliverability
      );

      if (betterPerformingAccounts.length > 0) {
        // Suggest transferring to the best performing account
        const bestAccount = betterPerformingAccounts.reduce((prev, current) => 
          (prev.responseRate + prev.deliverability > current.responseRate + current.deliverability) ? prev : current
        );

        suggestions.set(underperformingAccount.id, [bestAccount.id]);
      }
    });

    return suggestions;
  }
}

export const optimizationEngine = new OptimizationEngine();
