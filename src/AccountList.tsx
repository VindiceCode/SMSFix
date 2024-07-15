import React, { useState, useEffect } from 'react';
import { accountManagementService, AccountWithMetrics } from '../services/accountManagementService';

const AccountList: React.FC = () => {
  const [accounts, setAccounts] = useState<AccountWithMetrics[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchAccounts();
  }, []);

  const fetchAccounts = async () => {
    try {
      setLoading(true);
      const fetchedAccounts = await accountManagementService.getAccounts();
      setAccounts(fetchedAccounts);
      setError(null);
    } catch (err) {
      setError('Failed to fetch accounts');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = async (accountId: string) => {
    if (window.confirm('Are you sure you want to delete this account?')) {
      try {
        await accountManagementService.deleteAccount(accountId);
        setAccounts(accounts.filter(account => account.id !== accountId));
      } catch (err) {
        setError('Failed to delete account');
      }
    }
  };

  if (loading) return <div>Loading accounts...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="account-list">
      <h2>SMS Sender Accounts</h2>
      <table>
        <thead>
          <tr>
            <th>Account Name</th>
            <th>Response Rate</th>
            <th>Deliverability</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {accounts.map(account => (
            <tr key={account.id}>
              <td>{account.name}</td>
              <td>{account.responseRate.toFixed(2)}%</td>
              <td>{account.deliverability.toFixed(2)}%</td>
              <td>
                <button onClick={() => {/* Implement edit functionality */}}>Edit</button>
                <button onClick={() => handleDeleteAccount(account.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <button onClick={() => {/* Implement add account functionality */}}>Add New Account</button>
    </div>
  );
};

export default AccountList;
