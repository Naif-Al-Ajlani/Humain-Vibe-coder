import React, { useState } from 'react';
import ProjectRequestInput from '../components/ProjectRequestInput';
import AIWorkflowVisualizer from '../components/AIWorkflowVisualizer';
import LiveCodePreview from '../components/LiveCodePreview';
import ProjectTimeline from '../components/ProjectTimeline';
import './HomePage.css';

const HomePage = () => {
  const [currentProject, setCurrentProject] = useState(null);

  const handleProjectCreated = (project) => {
    setCurrentProject(project);
  };

  return (
    <div className="home-page">
      <div className="page-header">
        <h1>🚀 AI Development Conductor</h1>
        <p>Transform your ideas into working applications with AI-native development</p>
      </div>

      <div className="dashboard-grid">
        <div className="grid-item input-section">
          <ProjectRequestInput onProjectCreated={handleProjectCreated} />
        </div>

        <div className="grid-item workflow-section">
          <AIWorkflowVisualizer projectId={currentProject?.id} />
        </div>

        <div className="grid-item preview-section">
          <LiveCodePreview
            projectId={currentProject?.id}
            code={currentProject?.generatedCode}
          />
        </div>

        <div className="grid-item timeline-section">
          <ProjectTimeline projectId={currentProject?.id} />
        </div>
      </div>
    </div>
  );
};

export default HomePage;
