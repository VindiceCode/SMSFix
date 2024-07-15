import React from 'react';
import { useQuery } from 'react-query';
import { AccountInfo } from '../services/accountManagementService';
import { metricsCalculationService, AccountMetrics, OverallMetrics } from '../services/metricsCalculationService';
import { bonzoApiService } from '../services/bonzoApiService';

const MetricsDisplay: React.FC = () => {
  const { data: accountsData, isLoading, error } = useQuery<AccountInfo[], Error>(
    'accounts',
    () => bonzoApiService.getAccountInfo('all')
  );

  if (isLoading) return <div>Loading metrics...</div>;
  if (error) return <div>Error loading metrics: {error.message}</div>;
  if (!accountsData) return <div>No account data available</div>;

  const accountMetrics: AccountMetrics[] = accountsData.map(account => 
    metricsCalculationService.calculateAccountMetrics(account)
  );
  const overallMetrics: OverallMetrics = metricsCalculationService.calculateOverallMetrics(accountsData);

  return (
    <div className="metrics-display">
      <h2>Performance Metrics</h2>
      
      <div className="overall-metrics">
        <h3>Overall Metrics</h3>
        <p>Total Accounts: {overallMetrics.totalAccounts}</p>
        <p>Total Messages: {overallMetrics.totalMessages}</p>
        <p>Response Rate: {overallMetrics.responseRate.toFixed(2)}%</p>
        <p>Deliverability: {overallMetrics.deliverability.toFixed(2)}%</p>
      </div>

      <div className="account-metrics">
        <h3>Account Metrics</h3>
        <table>
          <thead>
            <tr>
              <th>Account Name</th>
              <th>Response Rate</th>
              <th>Deliverability</th>
            </tr>
          </thead>
          <tbody>
            {accountMetrics.map(metric => (
              <tr key={metric.accountId}>
                <td>{metric.accountName}</td>
                <td>{metric.responseRate.toFixed(2)}%</td>
                <td>{metric.deliverability.toFixed(2)}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MetricsDisplay;
import React from 'react';
import { useQuery } from 'react-query';
import { AccountInfo } from '../types/accountTypes';
import { metricsCalculationService, AccountMetrics, OverallMetrics } from '../services/metricsCalculationService';
import bonzoApiService from '../services/bonzoApiService';

const MetricsDisplay: React.FC = () => {
  const { data: accountsData, isLoading, error } = useQuery<AccountInfo[], Error>(
    'accounts',
    () => bonzoApiService.getAccountInfo('all')
  );

  if (isLoading) return <div>Loading metrics...</div>;
  if (error) return <div>Error loading metrics: {error.message}</div>;
  if (!accountsData) return <div>No account data available</div>;

  const accountMetrics: AccountMetrics[] = accountsData.map(account => 
    metricsCalculationService.calculateAccountMetrics(account)
  );
  const overallMetrics: OverallMetrics = metricsCalculationService.calculateOverallMetrics(accountsData);

  return (
    <div className="metrics-display">
      <h2>Performance Metrics</h2>
      
      <div className="overall-metrics">
        <h3>Overall Metrics</h3>
        <p>Total Accounts: {overallMetrics.totalAccounts}</p>
        <p>Total Messages: {overallMetrics.totalMessages}</p>
        <p>Response Rate: {overallMetrics.responseRate.toFixed(2)}%</p>
        <p>Deliverability: {overallMetrics.deliverability.toFixed(2)}%</p>
      </div>

      <div className="account-metrics">
        <h3>Account Metrics</h3>
        <table>
          <thead>
            <tr>
              <th>Account Name</th>
              <th>Response Rate</th>
              <th>Deliverability</th>
            </tr>
          </thead>
          <tbody>
            {accountMetrics.map(metric => (
              <tr key={metric.accountId}>
                <td>{metric.accountName}</td>
                <td>{metric.responseRate.toFixed(2)}%</td>
                <td>{metric.deliverability.toFixed(2)}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MetricsDisplay;
