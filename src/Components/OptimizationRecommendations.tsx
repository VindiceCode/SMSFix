import React, { useEffect, useState, useCallback } from 'react';
import { optimizationEngine } from '../services/optimizationEngine';
import { AccountWithMetrics } from '../services/accountManagementService';
import { accountManagementService } from '../services/accountManagementService';

const OptimizationRecommendations: React.FC = () => {
  const [recommendations, setRecommendations] = useState<Map<string, string[]>>(new Map());
  const [accounts, setAccounts] = useState<AccountWithMetrics[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAccountsAndGenerateRecommendations = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const fetchedAccounts = await accountManagementService.getAccounts();
      setAccounts(fetchedAccounts);

      const underperformingAccounts = optimizationEngine.identifyUnderperformingAccounts(fetchedAccounts);
      const suggestions = optimizationEngine.suggestContactTransfers(underperformingAccounts, fetchedAccounts);
      setRecommendations(suggestions);
    } catch (error) {
      console.error('Failed to fetch accounts or generate recommendations:', error);
      setError('Failed to fetch accounts or generate recommendations. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAccountsAndGenerateRecommendations();
  }, [fetchAccountsAndGenerateRecommendations]);

  if (isLoading) {
    return <div>Loading recommendations...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

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
      <button onClick={fetchAccountsAndGenerateRecommendations}>Refresh Recommendations</button>
    </div>
  );
};

export default OptimizationRecommendations;
