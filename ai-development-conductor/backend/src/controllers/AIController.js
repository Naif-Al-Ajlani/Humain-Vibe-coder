const OpenAI = require('openai');
const Anthropic = require('@anthropic-ai/sdk');

class AIController {
  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    this.anthropic = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY,
    });
  }

  async processPrompt(req, res) {
    try {
      const { prompt, model = 'gpt-4' } = req.body;

      if (!prompt) {
        return res.status(400).json({ error: 'Prompt is required' });
      }

      let response;

      if (model.startsWith('gpt')) {
        response = await this.openai.chat.completions.create({
          model: model,
          messages: [{ role: 'user', content: prompt }],
          max_tokens: 1000
        });

        return res.json({
          response: response.choices[0].message.content,
          model: model,
          tokens: response.usage
        });
      } else if (model.startsWith('claude')) {
        response = await this.anthropic.messages.create({
          model: model,
          max_tokens: 1000,
          messages: [{ role: 'user', content: prompt }]
        });

        return res.json({
          response: response.content[0].text,
          model: model,
          tokens: response.usage
        });
      }

      res.status(400).json({ error: 'Unsupported model' });
    } catch (error) {
      console.error('AI processing error:', error);
      res.status(500).json({ error: 'AI processing failed' });
    }
  }

  async getAvailableModels(req, res) {
    res.json({
      models: [
        { id: 'gpt-4', name: 'GPT-4', provider: 'OpenAI' },
        { id: 'gpt-3.5-turbo', name: 'GPT-3.5 Turbo', provider: 'OpenAI' },
        { id: 'claude-3-sonnet', name: 'Claude 3 Sonnet', provider: 'Anthropic' }
      ]
    });
  }

  async generateCode(req, res) {
    try {
      const { description, type = 'component' } = req.body;

      const codePrompt = `Generate a ${type} based on this description: ${description}`;

      // This will be expanded in Phase 1 with proper code generation
      const response = await this.processPrompt({ body: { prompt: codePrompt } }, res);

    } catch (error) {
      console.error('Code generation error:', error);
      res.status(500).json({ error: 'Code generation failed' });
    }
  }
}

module.exports = new AIController();
