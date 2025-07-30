import React, { useState, useEffect } from 'react';
import api from '../services/api';
import websocketService from '../services/websocket';
import './StatusIndicator.css';

const StatusIndicator = () => {
  const [systemStatus, setSystemStatus] = useState({
    api: 'checking',
    websocket: 'checking',
    ai: 'checking',
    agents: 'checking'
  });

  useEffect(() => {
    checkSystemHealth();
    const interval = setInterval(checkSystemHealth, 30000); // Check every 30 seconds

    // WebSocket status
    const socket = websocketService.connect();
    socket.on('connect', () => {
      setSystemStatus(prev => ({ ...prev, websocket: 'connected' }));
    });

    socket.on('disconnect', () => {
      setSystemStatus(prev => ({ ...prev, websocket: 'disconnected' }));
    });

    return () => {
      clearInterval(interval);
      websocketService.off('connect');
      websocketService.off('disconnect');
    };
  }, []);

  const checkSystemHealth = async () => {
    try {
      // Check API health
      const apiResponse = await api.get('/health');
      setSystemStatus(prev => ({
        ...prev,
        api: apiResponse.status === 200 ? 'healthy' : 'error'
      }));

      // Check AI models
      const aiResponse = await api.get('/ai/models');
      setSystemStatus(prev => ({
        ...prev,
        ai: aiResponse.data.models.length > 0 ? 'healthy' : 'error'
      }));

      // Check agents
      const agentsResponse = await api.get('/agents/status');
      setSystemStatus(prev => ({
        ...prev,
        agents: 'healthy'
      }));

    } catch (error) {
      setSystemStatus(prev => ({
        ...prev,
        api: 'error',
        ai: 'error',
        agents: 'error'
      }));
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'healthy': return '🟢';
      case 'connected': return '🟢';
      case 'error': return '🔴';
      case 'disconnected': return '🔴';
      case 'checking': return '🟡';
      default: return '⚪';
    }
  };

  const getOverallStatus = () => {
    const statuses = Object.values(systemStatus);
    if (statuses.every(s => s === 'healthy' || s === 'connected')) return 'healthy';
    if (statuses.some(s => s === 'error' || s === 'disconnected')) return 'error';
    return 'warning';
  };

  return (
    <div className="status-indicator">
      <div className={`status-badge ${getOverallStatus()}`}>
        {getStatusIcon(getOverallStatus())} System
      </div>
      <div className="status-details">
        <div className="status-item">
          {getStatusIcon(systemStatus.api)} API
        </div>
        <div className="status-item">
          {getStatusIcon(systemStatus.websocket)} WS
        </div>
        <div className="status-item">
          {getStatusIcon(systemStatus.ai)} AI
        </div>
        <div className="status-item">
          {getStatusIcon(systemStatus.agents)} Agents
        </div>
      </div>
    </div>
  );
};

export default StatusIndicator;
