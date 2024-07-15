// Bonzo API Configuration

export interface BonzoApiConfig {
  baseUrl: string;
  apiKey: string;
  timeout: number;
  webhookSecret: string;
}

const bonzoApiConfig: BonzoApiConfig = {
  baseUrl: process.env.REACT_APP_BONZO_API_BASE_URL || 'https://api.bonzo.com',
  apiKey: process.env.REACT_APP_BONZO_API_KEY || '',
  timeout: parseInt(process.env.REACT_APP_BONZO_API_TIMEOUT || '10000', 10),
  webhookSecret: process.env.REACT_APP_BONZO_WEBHOOK_SECRET || '',
};

if (!bonzoApiConfig.apiKey) {
  console.error('REACT_APP_BONZO_API_KEY is not set in the environment variables');
}

if (!bonzoApiConfig.webhookSecret) {
  console.error('REACT_APP_BONZO_WEBHOOK_SECRET is not set in the environment variables');
}

export default bonzoApiConfig;
