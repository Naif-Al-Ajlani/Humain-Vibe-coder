const aiModels = {
  openai: {
    models: [
      { id: 'gpt-4', name: 'GPT-4', maxTokens: 8192 },
      { id: 'gpt-3.5-turbo', name: 'GPT-3.5 Turbo', maxTokens: 4096 }
    ],
    apiKey: process.env.OPENAI_API_KEY
  },
  anthropic: {
    models: [
      { id: 'claude-3-sonnet', name: 'Claude 3 Sonnet', maxTokens: 200000 },
      { id: 'claude-3-haiku', name: 'Claude 3 Haiku', maxTokens: 200000 }
    ],
    apiKey: process.env.ANTHROPIC_API_KEY
  }
};

module.exports = aiModels;
