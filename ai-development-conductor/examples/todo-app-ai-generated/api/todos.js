const express = require('express');
const axios = require('axios');
const router = express.Router();

// In-memory storage for demo (replace with database in production)
let todos = [];
let nextId = 1;

// AI categorization function
async function categorizeTodo(text) {
  try {
    const response = await axios.post('http://localhost:3001/api/ai/prompt', {
      prompt: `Categorize this todo item into one of these categories: work, personal, health, shopping, learning, other.

      Todo: "${text}"

      Respond with only a JSON object in this format:
      {
        "category": "category_name",
        "confidence": 0.95,
        "reasoning": "brief explanation"
      }`,
      model: 'gpt-4'
    });

    const aiResult = JSON.parse(response.data.response);
    return {
      category: aiResult.category,
      confidence: aiResult.confidence,
      reasoning: aiResult.reasoning
    };
  } catch (error) {
    console.error('AI categorization failed:', error);
    return {
      category: 'other',
      confidence: 0.5,
      reasoning: 'AI categorization unavailable'
    };
  }
}

// Get all todos
router.get('/', (req, res) => {
  res.json({ todos: todos.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)) });
});

// Create new todo
router.post('/', async (req, res) => {
  try {
    const { text, aiCategorize = true } = req.body;

    if (!text || !text.trim()) {
      return res.status(400).json({ error: 'Todo text is required' });
    }

    let category = 'other';
    let aiConfidence = 0.5;
    let aiReasoning = 'No AI categorization';

    if (aiCategorize) {
      const aiResult = await categorizeTodo(text);
      category = aiResult.category;
      aiConfidence = aiResult.confidence;
      aiReasoning = aiResult.reasoning;
    }

    const todo = {
      id: nextId++,
      text: text.trim(),
      completed: false,
      category: category,
      aiConfidence: aiConfidence,
      aiReasoning: aiReasoning,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    todos.push(todo);
    res.status(201).json({ todo });
  } catch (error) {
    console.error('Create todo error:', error);
    res.status(500).json({ error: 'Failed to create todo' });
  }
});

// Update todo
router.patch('/:id', (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const todoIndex = todos.findIndex(t => t.id === parseInt(id));
    if (todoIndex === -1) {
      return res.status(404).json({ error: 'Todo not found' });
    }

    todos[todoIndex] = {
      ...todos[todoIndex],
      ...updates,
      updatedAt: new Date().toISOString()
    };

    res.json({ todo: todos[todoIndex] });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update todo' });
  }
});

// Delete todo
router.delete('/:id', (req, res) => {
  try {
    const { id } = req.params;
    const todoIndex = todos.findIndex(t => t.id === parseInt(id));

    if (todoIndex === -1) {
      return res.status(404).json({ error: 'Todo not found' });
    }

    todos.splice(todoIndex, 1);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete todo' });
  }
});

// Get category statistics
router.get('/stats', (req, res) => {
  const stats = todos.reduce((acc, todo) => {
    acc[todo.category] = (acc[todo.category] || 0) + 1;
    return acc;
  }, {});

  res.json({ stats });
});

module.exports = router;
