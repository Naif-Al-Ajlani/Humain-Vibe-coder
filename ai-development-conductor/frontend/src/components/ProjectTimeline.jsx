import React, { useState, useEffect } from 'react';
import api from '../services/api';
import './ProjectTimeline.css';

const ProjectTimeline = ({ projectId }) => {
  const [timeline, setTimeline] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (projectId) {
      fetchTimeline();
    }
  }, [projectId]);

  const fetchTimeline = async () => {
    try {
      setIsLoading(true);
      const response = await api.get(`/projects/${projectId}`);
      setTimeline(response.data.project.timeline || []);
    } catch (error) {
      console.error('Failed to fetch timeline:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const addTimelineEvent = (event) => {
    setTimeline(prev => [...prev, {
      id: Date.now(),
      timestamp: new Date().toISOString(),
      ...event
    }]);
  };

  const getEventIcon = (type) => {
    const icons = {
      'created': '🆕',
      'ai_analysis': '🧠',
      'code_generated': '💻',
      'agent_activated': '🤖',
      'workflow_started': '⚙️',
      'test_completed': '✅',
      'error': '❌'
    };
    return icons[type] || '📝';
  };

  if (isLoading) {
    return (
      <div className="timeline-loading">
        <div className="loading-spinner">🔄</div>
        <p>Loading timeline...</p>
      </div>
    );
  }

  return (
    <div className="project-timeline">
      <div className="timeline-header">
        <h3>📋 Project Timeline</h3>
        <div className="timeline-stats">
          <span className="stat">📊 {timeline.length} events</span>
        </div>
      </div>

      <div className="timeline-content">
        {timeline.length === 0 ? (
          <div className="timeline-empty">
            <p>No timeline events yet. Start by creating a project!</p>
          </div>
        ) : (
          <div className="timeline-events">
            {timeline.map((event) => (
              <div key={event.id} className="timeline-event">
                <div className="event-icon">
                  {getEventIcon(event.type)}
                </div>
                <div className="event-content">
                  <div className="event-header">
                    <h4>{event.title}</h4>
                    <span className="event-time">
                      {new Date(event.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                  <p className="event-description">{event.description}</p>
                  {event.agent && (
                    <span className="event-agent">🤖 {event.agent}</span>
                  )}
                  {event.details && (
                    <div className="event-details">
                      <pre>{JSON.stringify(event.details, null, 2)}</pre>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectTimeline;
