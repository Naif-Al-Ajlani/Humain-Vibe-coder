const N8nService = require('../services/n8n-service');

class ExamplesController {
  constructor() {
    this.examples = new Map();
    this.initializeExamples();
  }

  initializeExamples() {
    // Pre-populate with some example data
    const sampleExamples = [
      {
        id: 'todo-app-demo',
        name: 'AI Todo App',
        type: 'todo-app',
        description: 'Todo application with AI-powered task categorization',
        status: 'completed',
        createdAt: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
        generationTime: '2m 34s',
        agentsUsed: 4,
        codeStats: {
          frontend: { files: 4, lines: 287 },
          backend: { files: 3, lines: 156 },
          totalLines: 443
        }
      }
    ];

    sampleExamples.forEach(example => {
      this.examples.set(example.id, example);
    });
  }

  async listExamples(req, res) {
    try {
      const examples = Array.from(this.examples.values()).sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );
      res.json({ examples });
    } catch (error) {
      res.status(500).json({ error: 'Failed to list examples' });
    }
  }

  async getExample(req, res) {
    try {
      const { id } = req.params;
      const example = this.examples.get(id);

      if (!example) {
        return res.status(404).json({ error: 'Example not found' });
      }

      res.json({ example });
    } catch (error) {
      res.status(500).json({ error: 'Failed to get example' });
    }
  }

  async generateExample(req, res) {
    try {
      const { exampleType } = req.body;

      const exampleId = `${exampleType}_${Date.now()}`;
      const startTime = new Date();

      // Trigger n8n example generation workflow
      const workflowResult = await N8nService.triggerWorkflow('example-generation', {
        exampleType,
        exampleId
      });

      const example = {
        id: exampleId,
        type: exampleType,
        name: this.getExampleName(exampleType),
        description: this.getExampleDescription(exampleType),
        status: 'generating',
        createdAt: startTime.toISOString(),
        generationStarted: startTime.toISOString(),
        n8nExecution: workflowResult,
        timeline: [{
          type: 'generation_started',
          title: 'Example Generation Started',
          description: `Started generating ${exampleType} example`,
          timestamp: startTime.toISOString()
        }]
      };

      this.examples.set(exampleId, example);

      // Emit real-time update
      req.app.get('io').emit('example_update', {
        exampleId,
        status: 'generating',
        progress: 0
      });

      res.status(201).json({
        success: true,
        example,
        message: 'Example generation started'
      });
    } catch (error) {
      console.error('Generate example error:', error);
      res.status(500).json({ error: 'Failed to generate example' });
    }
  }

  async updateExample(req, res) {
    try {
      const { id } = req.params;
      const updates = req.body;

      const example = this.examples.get(id);
      if (!example) {
        return res.status(404).json({ error: 'Example not found' });
      }

      const updatedExample = {
        ...example,
        ...updates,
        updatedAt: new Date().toISOString()
      };

      this.examples.set(id, updatedExample);

      // Emit real-time update
      req.app.get('io').emit('example_update', {
        exampleId: id,
        ...updates
      });

      res.json({ success: true, example: updatedExample });
    } catch (error) {
      res.status(500).json({ error: 'Failed to update example' });
    }
  }

  getExampleName(type) {
    const names = {
      'todo-app': 'AI Todo App',
      'chat-interface': 'AI Chat Interface',
      'dashboard': 'Analytics Dashboard'
    };
    return names[type] || 'AI Generated App';
  }

  getExampleDescription(type) {
    const descriptions = {
      'todo-app': 'Todo application with AI-powered task categorization',
      'chat-interface': 'Real-time chat with AI assistance and suggestions',
      'dashboard': 'Data visualization dashboard with AI-generated insights'
    };
    return descriptions[type] || 'AI generated application';
  }
}

module.exports = new ExamplesController();
