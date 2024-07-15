// Bonzo API Configuration

export interface BonzoApiConfig {
  baseUrl: string;
  apiKey: string;
  timeout: number;
}

const bonzoApiConfig: BonzoApiConfig = {
  baseUrl: process.env.REACT_APP_BONZO_API_BASE_URL || 'https://api.bonzo.com/v1',
  apiKey: process.env.REACT_APP_BONZO_API_KEY || '',
  timeout: parseInt(process.env.REACT_APP_BONZO_API_TIMEOUT || '10000', 10),
};

if (!bonzoApiConfig.apiKey) {
  console.error('REACT_APP_BONZO_API_KEY is not set in the environment variables');
}

export default bonzoApiConfig;
