import React, { useState, useEffect } from 'react';
import websocketService from '../services/websocket';
import './AIWorkflowVisualizer.css';

const AIWorkflowVisualizer = ({ projectId }) => {
  const [workflowSteps, setWorkflowSteps] = useState([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [coordinationId, setCoordinationId] = useState(null);
  const [agentCoordination, setAgentCoordination] = useState({});

  useEffect(() => {
    const socket = websocketService.connect();

    websocketService.on('workflow_update', (data) => {
      if (data.projectId === projectId) {
        setWorkflowSteps(data.steps || []);
        setCurrentStep(data.currentStep || 0);
        setIsActive(data.isActive || false);
        setCoordinationId(data.coordinationId);
      }
    });

    websocketService.on('agent_coordination', (data) => {
      if (data.projectId === projectId) {
        setAgentCoordination(data);
      }
    });

    return () => {
      websocketService.off('workflow_update');
      websocketService.off('agent_coordination');
    };
  }, [projectId]);

  const getAgentIcon = (agentName) => {
    const icons = {
      'architect': '🏗️',
      'frontend': '🎨',
      'backend': '⚙️',
      'qa': '🔍',
      'system': '💻'
    };
    return icons[agentName] || '🤖';
  };

  const getStepStatus = (index) => {
    if (index < currentStep) return 'completed';
    if (index === currentStep && isActive) return 'active';
    return 'pending';
  };

  return (
    <div className="workflow-visualizer enhanced">
      <div className="workflow-header">
        <h3>🔄 Multi-Agent Workflow</h3>
        <div className="workflow-status">
          <div className={`status-badge ${isActive ? 'active' : 'idle'}`}>
            {isActive ? '🟢 Running' : '⚪ Idle'}
          </div>
          {coordinationId && (
            <div className="coordination-id">
              ID: {coordinationId.slice(-8)}
            </div>
          )}
        </div>
      </div>

      <div className="agent-coordination-status">
        {Object.entries(agentCoordination).map(([agentId, status]) => (
          <div key={agentId} className={`agent-status ${status}`}>
            <span className="agent-icon">{getAgentIcon(agentId)}</span>
            <span className="agent-name">{agentId}</span>
            <span className={`status-dot ${status}`}></span>
          </div>
        ))}
      </div>

      <div className="workflow-steps">
        {workflowSteps.length === 0 ? (
          <div className="no-workflow">
            <div className="placeholder-icon">⚙️</div>
            <p>Workflow will appear here when agents start working</p>
          </div>
        ) : (
          workflowSteps.map((step, index) => (
            <div
              key={index}
              className={`workflow-step ${getStepStatus(index)}`}
            >
              <div className="step-icon">
                {getAgentIcon(step.agent)}
              </div>
              <div className="step-content">
                <div className="step-header">
                  <h4>{step.action || step.name}</h4>
                  <span className="step-time">
                    {step.timestamp && new Date(step.timestamp).toLocaleTimeString()}
                  </span>
                </div>
                <p className="step-description">
                  {step.result ? step.result.substring(0, 100) + '...' : 'Processing...'}
                </p>
                <div className="step-meta">
                  <span className="step-agent">👤 {step.agent}</span>
                  {step.result && (
                    <button className="view-details-btn">
                      👁️ View Details
                    </button>
                  )}
                </div>
              </div>
              <div className="step-status">
                {getStepStatus(index) === 'completed' && '✅'}
                {getStepStatus(index) === 'active' && '🔄'}
                {getStepStatus(index) === 'pending' && '⏳'}
              </div>
            </div>
          ))
        )}
      </div>

      {isActive && (
        <div className="workflow-progress">
          <div className="progress-bar">
            <div
              className="progress-fill"
              style={{ width: `${(currentStep / Math.max(workflowSteps.length, 1)) * 100}%` }}
            ></div>
          </div>
          <p className="progress-text">
            Step {currentStep + 1} of {workflowSteps.length}
          </p>
        </div>
      )}
    </div>
  );
};

export default AIWorkflowVisualizer;
