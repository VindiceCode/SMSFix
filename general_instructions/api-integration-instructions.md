# Bonzo API Integration Instructions

1. Authentication:
   - Use Bearer token authentication.
   - Store API token securely (use environment variables).

2. Essential API Endpoints:
   - Base URL: https://api.bonzo.com
   - Key endpoints to implement:
     - GET /prospects: List prospects
     - GET /prospects/{prospect}/communication: Get communication history
     - POST /prospects/{prospect}/campaign/{campaign}: Change campaign
     - GET /campaigns: List campaigns

3. Request Headers:
   ```typescript
   const bonzoHeaders = {
     "Content-Type": "application/x-www-form-urlencoded",
     "accept": "application/json",
     "Authorization": "Bearer [YOUR_BONZO_API_TOKEN]"
   };
   ```

4. Error Handling:
   - Implement basic error handling for API calls.
   - Log error messages for debugging.

5. Rate Limiting:
   - Implement simple retry logic for rate limit errors.

6. Webhook Integration:
   - Set up webhook endpoints for critical real-time updates.
   - Implement handlers for: new messages and prospect updates.
   - Verify webhook authenticity using the header:
     ```
     x-bonzo-code: "c81e728d9d4c2f636f067f89cc14862c"
     ```

7. Data Polling:
   - Implement basic polling for key performance metrics.
   - Use a reasonable interval (e.g., every 5 minutes) to balance data freshness and API load.

8. Response Parsing:
   - Create basic interfaces for API responses.
   - Validate essential data received from the API.

9. API Wrapper:
   - Create a simple service for core API calls.
   - Implement methods for each essential endpoint used in the application.

10. Testing:
    - Create basic mock responses for essential API endpoints.
    - Test happy path scenarios for critical API interactions.

Remember: Refer to the official Bonzo API documentation for detailed information. Focus on implementing the core API interactions needed for basic system functionality.
