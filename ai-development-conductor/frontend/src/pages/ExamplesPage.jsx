import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import './ExamplesPage.css';

const ExamplesPage = () => {
  const [examples, setExamples] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [generating, setGenerating] = useState(null);

  useEffect(() => {
    fetchExamples();
  }, []);

  const fetchExamples = async () => {
    try {
      setIsLoading(true);
      const response = await api.get('/examples');
      setExamples(response.data.examples);
    } catch (error) {
      console.error('Failed to fetch examples:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const generateExample = async (exampleType) => {
    try {
      setGenerating(exampleType);
      const response = await api.post('/examples/generate', {
        exampleType
      });

      // Add new example to list
      setExamples(prev => [...prev, response.data.example]);
    } catch (error) {
      console.error('Failed to generate example:', error);
    } finally {
      setGenerating(null);
    }
  };

  const exampleTypes = [
    {
      id: 'todo-app',
      name: 'AI Todo App',
      description: 'Todo application with AI-powered task categorization',
      icon: '✅',
      features: ['CRUD Operations', 'AI Categorization', 'Real-time Updates', 'Statistics'],
      complexity: 'Medium',
      estimatedTime: '2-3 minutes'
    },
    {
      id: 'chat-interface',
      name: 'AI Chat Interface',
      description: 'Real-time chat with AI assistance and suggestions',
      icon: '💬',
      features: ['Real-time Messaging', 'AI Suggestions', 'Smart Responses', 'WebSocket'],
      complexity: 'Medium',
      estimatedTime: '3-4 minutes'
    },
    {
      id: 'dashboard',
      name: 'Analytics Dashboard',
      description: 'Data visualization dashboard with AI-generated insights',
      icon: '📊',
      features: ['Data Visualization', 'AI Insights', 'Interactive Charts', 'Real-time Data'],
      complexity: 'Complex',
      estimatedTime: '4-5 minutes'
    }
  ];

  if (isLoading) {
    return <LoadingSpinner message="Loading examples..." variant="code" />;
  }

  return (
    <div className="examples-page">
      <div className="page-header">
        <h1>🚀 AI-Generated Examples</h1>
        <p>Watch our multi-agent system build complete applications in minutes</p>
      </div>

      <div className="example-types-grid">
        {exampleTypes.map((type) => {
          const existingExample = examples.find(ex => ex.type === type.id);
          const isGenerating = generating === type.id;

          return (
            <div key={type.id} className="example-type-card">
              <div className="card-header">
                <span className="example-icon">{type.icon}</span>
                <h3>{type.name}</h3>
                <span className={`complexity-badge ${type.complexity.toLowerCase()}`}>
                  {type.complexity}
                </span>
              </div>

              <p className="example-description">{type.description}</p>

              <div className="example-features">
                <h4>Features:</h4>
                <ul>
                  {type.features.map((feature, index) => (
                    <li key={index}>{feature}</li>
                  ))}
                </ul>
              </div>

              <div className="example-meta">
                <span className="estimated-time">
                  ⏱️ Est. time: {type.estimatedTime}
                </span>
              </div>

              <div className="card-actions">
                {existingExample ? (
                  <div className="existing-example">
                    <Link
                      to={`/examples/${existingExample.id}`}
                      className="view-example-btn"
                    >
                      👁️ View Example
                    </Link>
                    <Link
                      to={`/examples/${existingExample.id}/code`}
                      className="view-code-btn"
                    >
                      💻 View Code
                    </Link>
                  </div>
                ) : (
                  <button
                    onClick={() => generateExample(type.id)}
                    disabled={isGenerating}
                    className="generate-btn"
                  >
                    {isGenerating ? (
                      <>🔄 Generating...</>
                    ) : (
                      <>✨ Generate Example</>
                    )}
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div className="generated-examples">
        <h2>📋 Generated Examples</h2>
        {examples.length === 0 ? (
          <div className="no-examples">
            <div className="empty-icon">📝</div>
            <p>No examples generated yet. Click "Generate Example" above to create one!</p>
          </div>
        ) : (
          <div className="examples-list">
            {examples.map((example) => (
              <div key={example.id} className="example-item">
                <div className="example-info">
                  <h3>{example.name}</h3>
                  <p>{example.description}</p>
                  <div className="example-stats">
                    <span>📅 {new Date(example.createdAt).toLocaleDateString()}</span>
                    <span>⏱️ {example.generationTime}</span>
                    <span>🤖 {example.agentsUsed} agents</span>
                  </div>
                </div>
                <div className="example-actions">
                  <Link to={`/examples/${example.id}`} className="action-btn view">
                    👁️ View
                  </Link>
                  <Link to={`/examples/${example.id}/code`} className="action-btn code">
                    💻 Code
                  </Link>
                  <Link to={`/examples/${example.id}/timeline`} className="action-btn timeline">
                    📋 Timeline
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ExamplesPage;
