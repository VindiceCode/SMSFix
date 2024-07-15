import React, { useState, useEffect } from 'react';
import { contactTransferService, Contact } from '../services/contactTransferService';
import { accountManagementService, AccountWithMetrics } from '../services/accountManagementService';

const ContactList: React.FC = () => {
  const [accounts, setAccounts] = useState<AccountWithMetrics[]>([]);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [selectedAccount, setSelectedAccount] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchAccounts();
  }, []);

  useEffect(() => {
    if (selectedAccount) {
      fetchContacts(selectedAccount);
    }
  }, [selectedAccount]);

  const fetchAccounts = async () => {
    try {
      const fetchedAccounts = await accountManagementService.getAccounts();
      setAccounts(fetchedAccounts);
      if (fetchedAccounts.length > 0) {
        setSelectedAccount(fetchedAccounts[0].id);
      }
    } catch (err) {
      setError('Failed to fetch accounts');
    }
  };

  const fetchContacts = async (accountId: string) => {
    try {
      setLoading(true);
      const fetchedContacts = await contactTransferService.getContactsByAccount(accountId);
      setContacts(fetchedContacts);
      setError(null);
    } catch (err) {
      setError('Failed to fetch contacts');
    } finally {
      setLoading(false);
    }
  };

  const handleTransferContact = async (contactId: string, toAccountId: string) => {
    try {
      await contactTransferService.transferContact(contactId, selectedAccount, toAccountId);
      // Refresh contacts list after transfer
      await fetchContacts(selectedAccount);
    } catch (err) {
      setError('Failed to transfer contact');
    }
  };

  if (loading) return <div>Loading contacts...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="contact-list">
      <h2>Contact List</h2>
      <div>
        <label htmlFor="account-select">Select Account: </label>
        <select
          id="account-select"
          value={selectedAccount}
          onChange={(e) => setSelectedAccount(e.target.value)}
        >
          {accounts.map((account) => (
            <option key={account.id} value={account.id}>
              {account.name}
            </option>
          ))}
        </select>
      </div>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Phone Number</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {contacts.map((contact) => (
            <tr key={contact.id}>
              <td>{contact.name}</td>
              <td>{contact.phoneNumber}</td>
              <td>
                <select
                  onChange={(e) => handleTransferContact(contact.id, e.target.value)}
                  defaultValue=""
                >
                  <option value="" disabled>
                    Transfer to...
                  </option>
                  {accounts
                    .filter((account) => account.id !== selectedAccount)
                    .map((account) => (
                      <option key={account.id} value={account.id}>
                        {account.name}
                      </option>
                    ))}
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ContactList;
