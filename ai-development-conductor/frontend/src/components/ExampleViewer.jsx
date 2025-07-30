import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '../services/api';
import CodeBlock from './CodeBlock';
import LoadingSpinner from './LoadingSpinner';
import './ExampleViewer.css';

const ExampleViewer = () => {
  const { exampleId } = useParams();
  const [example, setExample] = useState(null);
  const [activeTab, setActiveTab] = useState('preview');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (exampleId) {
      fetchExample();
    }
  }, [exampleId]);

  const fetchExample = async () => {
    try {
      setIsLoading(true);
      const response = await api.get(`/examples/${exampleId}`);
      setExample(response.data.example);
    } catch (error) {
      console.error('Failed to fetch example:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const tabs = [
    { id: 'preview', label: 'Live Preview', icon: '👁️' },
    { id: 'frontend', label: 'Frontend Code', icon: '🎨' },
    { id: 'backend', label: 'Backend Code', icon: '⚙️' },
    { id: 'timeline', label: 'Generation Timeline', icon: '📋' }
  ];

  if (isLoading) {
    return <LoadingSpinner message="Loading example..." variant="code" />;
  }

  if (!example) {
    return (
      <div className="example-not-found">
        <h2>Example not found</h2>
        <p>The requested example could not be loaded.</p>
      </div>
    );
  }

  const renderPreview = () => (
    <div className="example-preview">
      <div className="preview-header">
        <h3>{example.name} - Live Preview</h3>
        <div className="preview-controls">
          <button className="control-btn">🔄 Refresh</button>
          <button className="control-btn">📱 Mobile View</button>
          <button className="control-btn">🖥️ Desktop View</button>
        </div>
      </div>
      <div className="preview-frame">
        <iframe
          src={`/examples/${example.id}/preview`}
          title={`${example.name} Preview`}
          className="preview-iframe"
        />
      </div>
    </div>
  );

  const renderCode = (codeType) => (
    <div className="code-viewer">
      <div className="code-header">
        <h3>{codeType === 'frontend' ? '🎨 Frontend' : '⚙️ Backend'} Code</h3>
        <div className="code-stats">
          <span>📄 {example.codeStats?.[codeType]?.files || 0} files</span>
          <span>📝 {example.codeStats?.[codeType]?.lines || 0} lines</span>
        </div>
      </div>
      <CodeBlock
        code={example.generatedCode?.[codeType] || '// Code not available'}
        language={codeType === 'frontend' ? 'jsx' : 'javascript'}
      />
    </div>
  );

  const renderTimeline = () => (
    <div className="generation-timeline">
      <h3>📋 AI Generation Timeline</h3>
      <div className="timeline-stats">
        <div className="stat">
          <span className="stat-value">{example.generationTime}</span>
          <span className="stat-label">Total Time</span>
        </div>
        <div className="stat">
          <span className="stat-value">{example.agentsUsed}</span>
          <span className="stat-label">Agents Used</span>
        </div>
        <div className="stat">
          <span className="stat-value">{example.codeStats?.totalLines || 0}</span>
          <span className="stat-label">Lines Generated</span>
        </div>
      </div>

      <div className="timeline-events">
        {example.timeline?.map((event, index) => (
          <div key={index} className="timeline-event">
            <div className="event-marker">
              {event.type === 'agent_started' && '🏁'}
              {event.type === 'agent_completed' && '✅'}
              {event.type === 'workflow_step' && '⚙️'}
              {event.type === 'code_generated' && '💻'}
              {event.type === 'qa_review' && '🔍'}
            </div>
            <div className="event-content">
              <h4>{event.title}</h4>
              <p>{event.description}</p>
              <div className="event-meta">
                <span className="event-time">
                  {new Date(event.timestamp).toLocaleTimeString()}
                </span>
                {event.agent && (
                  <span className="event-agent">🤖 {event.agent}</span>
                )}
                {event.duration && (
                  <span className="event-duration">⏱️ {event.duration}</span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="example-viewer">
      <div className="viewer-header">
        <h1>{example.name}</h1>
        <p>{example.description}</p>
        <div className="example-badges">
          <span className="badge type">{example.type}</span>
          <span className="badge status">{example.status}</span>
          <span className="badge agents">🤖 {example.agentsUsed} agents</span>
        </div>
      </div>

      <div className="viewer-tabs">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`tab-button ${activeTab === tab.id ? 'active' : ''}`}
          >
            <span className="tab-icon">{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>

      <div className="viewer-content">
        {activeTab === 'preview' && renderPreview()}
        {activeTab === 'frontend' && renderCode('frontend')}
        {activeTab === 'backend' && renderCode('backend')}
        {activeTab === 'timeline' && renderTimeline()}
      </div>
    </div>
  );
};

export default ExampleViewer;
