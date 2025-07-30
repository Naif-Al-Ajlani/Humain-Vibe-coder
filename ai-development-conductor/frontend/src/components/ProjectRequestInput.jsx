import React, { useState } from 'react';
import api from '../services/api';
import './ProjectRequestInput.css';

const ProjectRequestInput = ({ onProjectCreated }) => {
  const [input, setInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedModel, setSelectedModel] = useState('gpt-4');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    setIsProcessing(true);
    try {
      // Create project
      const projectResponse = await api.post('/projects/create', {
        name: `AI Project ${Date.now()}`,
        description: input,
        requirements: input
      });

      // Process with AI
      const aiResponse = await api.post('/ai/generate', {
        description: input,
        type: 'project',
        model: selectedModel
      });

      // Combine results
      const project = {
        ...projectResponse.data.project,
        aiAnalysis: aiResponse.data.response
      };

      onProjectCreated?.(project);
      setInput('');
    } catch (error) {
      console.error('Failed to process project request:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="project-request-input">
      <form onSubmit={handleSubmit} className="input-form">
        <div className="form-header">
          <h3>🚀 Describe Your Project</h3>
          <select
            value={selectedModel}
            onChange={(e) => setSelectedModel(e.target.value)}
            className="model-selector"
          >
            <option value="gpt-4">GPT-4</option>
            <option value="claude-3-sonnet">Claude 3 Sonnet</option>
          </select>
        </div>

        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Example: Build a todo app with AI-powered task categorization and real-time sync..."
          className="project-textarea"
          rows={6}
          disabled={isProcessing}
        />

        <button
          type="submit"
          disabled={!input.trim() || isProcessing}
          className="submit-button"
        >
          {isProcessing ? '🔄 Processing...' : '✨ Generate Project'}
        </button>
      </form>
    </div>
  );
};

export default ProjectRequestInput;
