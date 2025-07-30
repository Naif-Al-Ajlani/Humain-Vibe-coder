const config = {
  development: {
    API_BASE_URL: 'http://localhost:3001/api',
    WEBSOCKET_URL: 'http://localhost:3001',
    AI_MODELS: {
      GPT: 'gpt-4',
      CLAUDE: 'claude-3-sonnet'
    }
  },
  production: {
    API_BASE_URL: '/api',
    WEBSOCKET_URL: window.location.origin,
    AI_MODELS: {
      GPT: 'gpt-4',
      CLAUDE: 'claude-3-sonnet'
    }
  }
};

const environment = process.env.NODE_ENV || 'development';
export default config[environment];
