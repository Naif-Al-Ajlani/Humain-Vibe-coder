import React, { useState, useEffect } from 'react';
import './LiveCodePreview.css';

const LiveCodePreview = ({ projectId, code }) => {
  const [activeTab, setActiveTab] = useState('preview');
  const [generatedCode, setGeneratedCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (code) {
      setGeneratedCode(code);
    }
  }, [code]);

  const tabs = [
    { id: 'preview', label: 'Preview', icon: '👀' },
    { id: 'code', label: 'Code', icon: '💻' },
    { id: 'structure', label: 'Structure', icon: '🏗️' }
  ];

  const renderPreview = () => {
    if (!generatedCode) {
      return (
        <div className="preview-placeholder">
          <div className="placeholder-icon">🚀</div>
          <p>Code preview will appear here as AI generates your project</p>
        </div>
      );
    }

    return (
      <div className="code-preview">
        <iframe
          title="Generated Code Preview"
          srcDoc={generatedCode}
          className="preview-iframe"
        />
      </div>
    );
  };

  const renderCode = () => (
    <div className="code-editor">
      <pre className="code-block">
        <code>{generatedCode || '// Generated code will appear here...'}</code>
      </pre>
    </div>
  );

  const renderStructure = () => (
    <div className="project-structure">
      <div className="structure-tree">
        <div className="tree-item">📁 src/</div>
        <div className="tree-item indent">📁 components/</div>
        <div className="tree-item indent-2">📄 App.jsx</div>
        <div className="tree-item indent-2">📄 index.js</div>
        <div className="tree-item indent">📁 styles/</div>
        <div className="tree-item indent-2">📄 main.css</div>
      </div>
    </div>
  );

  return (
    <div className="live-code-preview">
      <div className="preview-header">
        <div className="preview-tabs">
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
        <div className="preview-actions">
          <button className="action-button">💾 Save</button>
          <button className="action-button">📤 Export</button>
        </div>
      </div>

      <div className="preview-content">
        {isLoading && <div className="loading-overlay">🔄 Generating...</div>}
        {activeTab === 'preview' && renderPreview()}
        {activeTab === 'code' && renderCode()}
        {activeTab === 'structure' && renderStructure()}
      </div>
    </div>
  );
};

export default LiveCodePreview;
