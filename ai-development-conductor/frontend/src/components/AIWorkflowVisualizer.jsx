import React, { useState, useEffect } from 'react';
import websocketService from '../services/websocket';
import './AIWorkflowVisualizer.css';

const AIWorkflowVisualizer = ({ projectId }) => {
  const [workflowSteps, setWorkflowSteps] = useState([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    const socket = websocketService.connect();

    // Listen for workflow updates
    websocketService.on('workflow_update', (data) => {
      if (data.projectId === projectId) {
        setWorkflowSteps(data.steps);
        setCurrentStep(data.currentStep);
        setIsActive(data.isActive);
      }
    });

    return () => {
      websocketService.off('workflow_update');
    };
  }, [projectId]);

  const getStepIcon = (step) => {
    const icons = {
      'analyze': '🔍',
      'design': '🎨',
      'code': '💻',
      'test': '🧪',
      'deploy': '🚀'
    };
    return icons[step.type] || '⚙️';
  };

  const getStepStatus = (index) => {
    if (index < currentStep) return 'completed';
    if (index === currentStep && isActive) return 'active';
    return 'pending';
  };

  return (
    <div className="workflow-visualizer">
      <div className="workflow-header">
        <h3>🔄 AI Workflow Progress</h3>
        <div className={`status-badge ${isActive ? 'active' : 'idle'}`}>
          {isActive ? 'Running' : 'Idle'}
        </div>
      </div>

      <div className="workflow-steps">
        {workflowSteps.map((step, index) => (
          <div
            key={index}
            className={`workflow-step ${getStepStatus(index)}`}
          >
            <div className="step-icon">
              {getStepIcon(step)}
            </div>
            <div className="step-content">
              <h4>{step.name}</h4>
              <p>{step.description}</p>
              {step.agent && (
                <span className="step-agent">👤 {step.agent}</span>
              )}
            </div>
            <div className="step-status">
              {getStepStatus(index) === 'completed' && '✅'}
              {getStepStatus(index) === 'active' && '🔄'}
              {getStepStatus(index) === 'pending' && '⏳'}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AIWorkflowVisualizer;
