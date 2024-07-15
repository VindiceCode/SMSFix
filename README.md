# SMS Optimization System

## Overview
The SMS Optimization System is a React-based web application designed to help businesses optimize their SMS campaigns. It integrates with the Bonzo API to fetch account information, calculate performance metrics, and provide optimization suggestions for improving SMS campaign effectiveness.

## Features
- Dashboard displaying overall SMS campaign performance metrics
- Account management with detailed performance indicators
- Contact list management and transfer suggestions
- Optimization recommendations based on account performance
- Real-time data updates through webhooks and periodic polling

## Setup Instructions

### Prerequisites
- Node.js (v14 or later)
- npm (v6 or later)

### Installation
1. Clone the repository:
   ```
   git clone https://github.com/your-username/sms-optimization-system.git
   cd sms-optimization-system
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Set up environment variables:
   Create a `.env` file in the root directory and add the following variables:
   ```
   REACT_APP_BONZO_API_BASE_URL=https://api.bonzo.com
   REACT_APP_BONZO_API_KEY=your-api-key-here
   REACT_APP_BONZO_API_TIMEOUT=5000
   ```

4. Start the development server:
   ```
   npm start
   ```

## Usage Guidelines
1. Dashboard: View overall performance metrics on the main dashboard.
2. Account List: Navigate to the Account List to see individual account performance.
3. Optimization Recommendations: Check the Optimization Recommendations section for suggestions on improving campaign performance.
4. Contact Transfers: Use the Contact List management feature to transfer contacts between accounts based on optimization suggestions.

## Running Tests
To run the test suite:
```
npm test
```

## Deployment
For production deployment:
1. Build the project:
   ```
   npm run build
   ```
2. Deploy the contents of the `build` directory to your hosting service.

## Contributing
Please read CONTRIBUTING.md for details on our code of conduct and the process for submitting pull requests.

## License
This project is licensed under the MIT License - see the LICENSE.md file for details.
