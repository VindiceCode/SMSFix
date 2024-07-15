import axios, { AxiosInstance, AxiosError } from 'axios';
import bonzoApiConfig, { BonzoApiConfig } from '../config/bonzoApiConfig';

class BonzoApiService {
  private api: AxiosInstance;

  constructor(config: BonzoApiConfig = bonzoApiConfig) {
    this.api = axios.create({
      baseURL: `${config.baseUrl}/${config.apiVersion}`,
      timeout: config.timeout,
      headers: {
        'Authorization': `Bearer ${config.apiKey}`,
        'Content-Type': 'application/json',
        'X-Bonzo-Client': 'SMS-Optimization-System/1.0',
      },
    });

    this.api.interceptors.response.use(
      response => response,
      this.handleError
    );
  }

  private handleError(error: AxiosError): never {
    if (error.response) {
      const { status, data } = error.response;
      console.error('Bonzo API request failed:', status, data);
      if (data && typeof data === 'object' && 'error' in data) {
        throw new Error(`Bonzo API error: ${status} - ${data.error}`);
      } else {
        throw new Error(`Bonzo API request failed: ${status}`);
      }
    } else if (error.request) {
      console.error('No response received from Bonzo API:', error.request);
      throw new Error('No response received from Bonzo API');
    } else {
      console.error('Error setting up the Bonzo API request:', error.message);
      throw new Error(`Error setting up the Bonzo API request: ${error.message}`);
    }
  }

  async sendMessage(phoneNumber: string, message: string): Promise<any> {
    const response = await this.api.post('/messages', { phoneNumber, message });
    return response.data;
  }

  async getAccountInfo(accountId: string): Promise<any> {
    const response = await this.api.get(`/accounts/${accountId}`);
    return response.data;
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
