import axios, { AxiosInstance, AxiosError } from 'axios';
import bonzoApiConfig, { BonzoApiConfig } from '../config/bonzoApiConfig';

interface Prospect {
  id: string;
  // Add other prospect properties as needed
}

interface Campaign {
  id: string;
  // Add other campaign properties as needed
}

interface CommunicationHistory {
  // Add communication history properties
}

class BonzoApiService {
  private api: AxiosInstance;
  private retryDelay: number = 1000; // 1 second initial delay
  private maxRetries: number = 3;

  constructor(config: BonzoApiConfig = bonzoApiConfig) {
    this.api = axios.create({
      baseURL: config.baseUrl,
      timeout: config.timeout,
      headers: {
        'Authorization': `Bearer ${config.apiKey}`,
        'Content-Type': 'application/x-www-form-urlencoded',
        'Accept': 'application/json',
        'X-Bonzo-Client': 'SMS-Optimization-System/1.0',
      },
    });

    this.api.interceptors.response.use(
      response => response,
      this.handleError
    );
  }

  private async handleError(error: AxiosError): Promise<never> {
    if (error.response) {
      const { status, data } = error.response;
      console.error('Bonzo API request failed:', status, data);
      if (status === 429) {
        // Rate limit error, implement retry logic
        return this.retryRequest(error);
      }
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

  private async retryRequest(error: AxiosError): Promise<any> {
    if (error.config && error.config.retryCount === undefined) {
      error.config.retryCount = 0;
    }

    if (error.config && error.config.retryCount < this.maxRetries) {
      error.config.retryCount++;
      const delay = this.retryDelay * Math.pow(2, error.config.retryCount - 1);
      console.log(`Retrying request (attempt ${error.config.retryCount}) after ${delay}ms`);
      await new Promise(resolve => setTimeout(resolve, delay));
      return this.api.request(error.config);
    }

    throw error;
  }

  async getProspects(): Promise<Prospect[]> {
    const response = await this.api.get('/prospects');
    return response.data;
  }

  async getProspectCommunication(prospectId: string): Promise<CommunicationHistory> {
    const response = await this.api.get(`/prospects/${prospectId}/communication`);
    return response.data;
  }

  async changeCampaign(prospectId: string, campaignId: string): Promise<void> {
    await this.api.post(`/prospects/${prospectId}/campaign/${campaignId}`);
  }

  async getCampaigns(): Promise<Campaign[]> {
    const response = await this.api.get('/campaigns');
    return response.data;
  }

  // Existing methods
  async sendMessage(phoneNumber: string, message: string): Promise<any> {
    const response = await this.api.post('/messages', { phoneNumber, message });
    return response.data;
  }

  async getAccountInfo(accountId: string): Promise<any> {
    const response = await this.api.get(`/accounts/${accountId}`);
    return response.data;
  }

  async createAccount(accountData: Partial<AccountInfo>): Promise<AccountInfo> {
    const response = await this.api.post('/accounts', accountData);
    return response.data;
  }

  async updateAccount(accountId: string, accountData: Partial<AccountInfo>): Promise<AccountInfo> {
    const response = await this.api.put(`/accounts/${accountId}`, accountData);
    return response.data;
  }

  async deleteAccount(accountId: string): Promise<void> {
    await this.api.delete(`/accounts/${accountId}`);
  }
}

export const bonzoApiService = new BonzoApiService();
