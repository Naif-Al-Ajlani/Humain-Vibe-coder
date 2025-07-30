import React, { useState, useEffect } from 'react';
import api from '../services/api';
import websocketService from '../services/websocket';
import LoadingSpinner from './LoadingSpinner';
import './AgentDashboard.css';

const AgentDashboard = () => {
  const [agents, setAgents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedAgent, setSelectedAgent] = useState(null);

  useEffect(() => {
    fetchAgentStatus();

    const socket = websocketService.connect();
    websocketService.on('agent_status_update', (data) => {
      setAgents(prev => prev.map(agent =>
        agent.id === data.agentId ? { ...agent, ...data.status } : agent
      ));
    });

    return () => {
      websocketService.off('agent_status_update');
    };
  }, []);

  const fetchAgentStatus = async () => {
    try {
      setIsLoading(true);
      const response = await api.get('/agents/status');
      setAgents(response.data.agents);
    } catch (error) {
      console.error('Failed to fetch agent status:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getAgentIcon = (agentId) => {
    const icons = {
      'architect': '🏗️',
      'frontend': '🎨',
      'backend': '⚙️',
      'qa': '🔍'
    };
    return icons[agentId] || '🤖';
  };

  const getStatusColor = (status) => {
    const colors = {
      'idle': 'gray',
      'active': 'green',
      'coordinating': 'blue',
      'error': 'red'
    };
    return colors[status] || 'gray';
  };

  if (isLoading) {
    return <LoadingSpinner message="Loading agents..." variant="agent" />;
  }

  return (
    <div className="agent-dashboard">
      <div className="dashboard-header">
        <h2>🤖 AI Agent Status</h2>
        <button onClick={fetchAgentStatus} className="refresh-btn">
          🔄 Refresh
        </button>
      </div>

      <div className="agent-grid">
        {agents.map((agent) => (
          <div
            key={agent.id}
            className={`agent-card ${agent.status}`}
            onClick={() => setSelectedAgent(agent)}
          >
            <div className="agent-header">
              <span className="agent-icon">{getAgentIcon(agent.id)}</span>
              <div className="agent-info">
                <h3>{agent.name}</h3>
                <p className="agent-role">{agent.role}</p>
              </div>
              <div className={`status-indicator ${getStatusColor(agent.status)}`}>
                {agent.status}
              </div>
            </div>

            <div className="agent-details">
              <div className="capabilities">
                <strong>Capabilities:</strong>
                <div className="capability-tags">
                  {agent.capabilities?.slice(0, 3).map((cap, index) => (
                    <span key={index} className="capability-tag">
                      {cap.replace('_', ' ')}
                    </span>
                  ))}
                </div>
              </div>

              {agent.currentTask && (
                <div className="current-task">
                  <strong>Current Task:</strong>
                  <p>{agent.currentTask.action}</p>
                </div>
              )}

              {agent.lastActive && (
                <div className="last-active">
                  <strong>Last Active:</strong>
                  <p>{new Date(agent.lastActive).toLocaleTimeString()}</p>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {selectedAgent && (
        <AgentDetailModal
          agent={selectedAgent}
          onClose={() => setSelectedAgent(null)}
        />
      )}
    </div>
  );
};

const AgentDetailModal = ({ agent, onClose }) => (
  <div className="modal-overlay" onClick={onClose}>
    <div className="modal-content" onClick={e => e.stopPropagation()}>
      <div className="modal-header">
        <h3>{getAgentIcon(agent.id)} {agent.name}</h3>
        <button onClick={onClose} className="close-btn">×</button>
      </div>

      <div className="modal-body">
        <div className="detail-section">
          <h4>Role & Status</h4>
          <p><strong>Role:</strong> {agent.role}</p>
          <p><strong>Status:</strong> {agent.status}</p>
        </div>

        <div className="detail-section">
          <h4>All Capabilities</h4>
          <div className="capability-list">
            {agent.capabilities?.map((cap, index) => (
              <span key={index} className="capability-item">
                {cap.replace('_', ' ')}
              </span>
            ))}
          </div>
        </div>

        {agent.currentTask && (
          <div className="detail-section">
            <h4>Current Task</h4>
            <pre>{JSON.stringify(agent.currentTask, null, 2)}</pre>
          </div>
        )}
      </div>
    </div>
  </div>
);

export default AgentDashboard;
