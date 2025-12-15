// Environment Configuration
// Supabase credentials are now fetched from Cloudflare Workers environment variables
// via the /supabase-config endpoint (similar to admin password)

export const ENV_CONFIG = {
  // Legacy AWS Configuration (kept for backward compatibility if needed)
  API_URL: 'https://vl3m1zxmu4.execute-api.sa-east-1.amazonaws.com/prod',
  AWS_REGION: 'sa-east-1',
  
  // API Endpoints
  ENDPOINTS: {
    JSON: '/json'
  }
};

// Helper function to get API URL
export const getApiUrl = () => ENV_CONFIG.API_URL; 