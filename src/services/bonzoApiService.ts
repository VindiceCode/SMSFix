import axios, { AxiosInstance } from 'axios';
import bonzoApiConfig, { BonzoApiConfig } from '../config/bonzoApiConfig';

class BonzoApiService {
  private api: AxiosInstance;

  constructor(config: BonzoApiConfig = bonzoApiConfig) {
    this.api = axios.create({
      baseURL: config.baseUrl,
      timeout: config.timeout,
      headers: {
        'Authorization': `Bearer ${config.apiKey}`,
        'Content-Type': 'application/json',
      },
    });
  }

  private handleError(error: any): never {
    if (axios.isAxiosError(error)) {
      console.error('API request failed:', error.response?.data || error.message);
      throw new Error(`API request failed: ${error.response?.data?.message || error.message}`);
    }
    throw error;
  }

  async sendMessage(phoneNumber: string, message: string): Promise<any> {
    try {
      const response = await this.api.post('/messages', { phoneNumber, message });
      return response.data;
    } catch (error) {
      this.handleError(error);
    }
  }

  async getAccountInfo(accountId: string): Promise<any> {
    try {
      const response = await this.api.get(`/accounts/${accountId}`);
      return response.data;
    } catch (error) {
      this.handleError(error);
    }
  }

  async createAccount(accountData: Partial<AccountInfo>): Promise<AccountInfo> {
    try {
      const response = await this.api.post('/accounts', accountData);
      return response.data;
    } catch (error) {
      this.handleError(error);
    }
  }

  async updateAccount(accountId: string, accountData: Partial<AccountInfo>): Promise<AccountInfo> {
    try {
      const response = await this.api.put(`/accounts/${accountId}`, accountData);
      return response.data;
    } catch (error) {
      this.handleError(error);
    }
  }

  async deleteAccount(accountId: string): Promise<void> {
    try {
      await this.api.delete(`/accounts/${accountId}`);
    } catch (error) {
      this.handleError(error);
    }
  }

  // Add more API wrapper functions as needed
}

export default new BonzoApiService();
