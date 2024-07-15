// Bonzo API Configuration

export interface BonzoApiConfig {
  baseUrl: string;
  apiKey: string;
  timeout: number;
}

const bonzoApiConfig: BonzoApiConfig = {
  baseUrl: 'https://api.bonzo.com/v1',
  apiKey: 'YOUR_API_KEY_HERE', // Replace with actual API key
  timeout: 10000, // 10 seconds
};

export default bonzoApiConfig;
