// Environment Configuration
// Replace these values with your actual API Gateway URL

export const ENV_CONFIG = {
  // Your API Gateway URL - replace with actual value
  API_URL: 'https://vl3m1zxmu4.execute-api.sa-east-1.amazonaws.com/prod',
  
  // AWS Region
  AWS_REGION: 'sa-east-1',
  
  // Admin password from Cloudflare environment variable
  ADMIN_PASSWORD: import.meta.env.ADMIN_PASSWORD || '',
  
  // API Endpoints
  ENDPOINTS: {
    JSON: '/json'
  }
};

// Helper function to get API URL
export const getApiUrl = () => ENV_CONFIG.API_URL; 