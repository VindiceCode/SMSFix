import bonzoApiService from './bonzoApiService';

export interface Contact {
  id: string;
  name: string;
  phoneNumber: string;
  accountId: string;
}

class ContactTransferService {
  async getContactsByAccount(accountId: string): Promise<Contact[]> {
    try {
      return await bonzoApiService.getContacts(accountId);
    } catch (error) {
      console.error('Failed to fetch contacts:', error);
      throw new Error('Failed to fetch contacts');
    }
  }

  async transferContact(contactId: string, fromAccountId: string, toAccountId: string): Promise<void> {
    try {
      await bonzoApiService.transferContact(contactId, fromAccountId, toAccountId);
    } catch (error) {
      console.error('Failed to transfer contact:', error);
      throw new Error('Failed to transfer contact');
    }
  }

  async bulkTransferContacts(contactIds: string[], fromAccountId: string, toAccountId: string): Promise<void> {
    try {
      await bonzoApiService.bulkTransferContacts(contactIds, fromAccountId, toAccountId);
    } catch (error) {
      console.error('Failed to bulk transfer contacts:', error);
      throw new Error('Failed to bulk transfer contacts');
    }
  }
}

export const contactTransferService = new ContactTransferService();
