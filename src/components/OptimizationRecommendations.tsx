import React, { useEffect, useState } from 'react';
import { optimizationEngine } from '../services/optimizationEngine';
import { AccountWithMetrics } from '../types/account';
import { accountManagementService } from '../services/accountManagementService';

const OptimizationRecommendations: React.FC = () => {
  const [recommendations, setRecommendations] = useState<Map<string, string[]>>(new Map());
  const [accounts, setAccounts] = useState<AccountWithMetrics[]>([]);

  useEffect(() => {
    const fetchAccountsAndGenerateRecommendations = async () => {
      try {
        const fetchedAccounts = await accountManagementService.getAccounts();
        setAccounts(fetchedAccounts);

        const underperformingAccounts = optimizationEngine.identifyUnderperformingAccounts(fetchedAccounts);
        const suggestions = optimizationEngine.suggestContactTransfers(underperformingAccounts, fetchedAccounts);
        setRecommendations(suggestions);
      } catch (error) {
        console.error('Failed to fetch accounts or generate recommendations:', error);
      }
    };

    fetchAccountsAndGenerateRecommendations();
  }, []);

  return (
    <div>
      <h2>Optimization Recommendations</h2>
      {recommendations.size === 0 ? (
        <p>No recommendations at this time.</p>
      ) : (
        <ul>
          {Array.from(recommendations).map(([underperformingAccountId, suggestedAccountIds]) => (
            <li key={underperformingAccountId}>
              Transfer contacts from account {underperformingAccountId} to account(s): {suggestedAccountIds.join(', ')}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default OptimizationRecommendations;
