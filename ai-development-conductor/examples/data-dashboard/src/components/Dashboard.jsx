import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
} from 'chart.js';
import { Bar, Line, Doughnut } from 'react-chartjs-2';
import './Dashboard.css';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [aiInsights, setAiInsights] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedMetric, setSelectedMetric] = useState('revenue');

  useEffect(() => {
    fetchDashboardData();
    fetchAiInsights();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await axios.get('/api/dashboard/data');
      setDashboardData(response.data);
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchAiInsights = async () => {
    try {
      const response = await axios.get('/api/dashboard/insights');
      setAiInsights(response.data.insights);
    } catch (error) {
      console.error('Failed to fetch AI insights:', error);
    }
  };

  const generateChart = async (metric) => {
    try {
      setIsLoading(true);
      const response = await axios.post('/api/dashboard/analyze', {
        metric,
        timeframe: '30d'
      });

      setSelectedMetric(metric);
      setDashboardData(prev => ({
        ...prev,
        currentChart: response.data.chartData
      }));
    } catch (error) {
      console.error('Failed to generate chart:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading && !dashboardData) {
    return (
      <div className="dashboard-loading">
        <div className="loading-spinner">📊</div>
        <p>Loading AI-powered dashboard...</p>
      </div>
    );
  }

  const revenueData = {
    labels: dashboardData?.revenue?.labels || [],
    datasets: [
      {
        label: 'Revenue ($)',
        data: dashboardData?.revenue?.data || [],
        backgroundColor: 'rgba(59, 130, 246, 0.8)',
        borderColor: 'rgba(59, 130, 246, 1)',
        borderWidth: 2
      }
    ]
  };

  const trafficData = {
    labels: dashboardData?.traffic?.labels || [],
    datasets: [
      {
        label: 'Website Traffic',
        data: dashboardData?.traffic?.data || [],
        fill: true,
        backgroundColor: 'rgba(16, 185, 129, 0.2)',
        borderColor: 'rgba(16, 185, 129, 1)',
        tension: 0.4
      }
    ]
  };

  const userSegmentData = {
    labels: ['New Users', 'Returning Users', 'Premium Users'],
    datasets: [
      {
        data: dashboardData?.userSegments || [45, 35, 20],
        backgroundColor: [
          'rgba(239, 68, 68, 0.8)',
          'rgba(245, 158, 11, 0.8)',
          'rgba(139, 92, 246, 0.8)'
        ]
      }
    ]
  };

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>📊 AI-Powered Analytics Dashboard</h1>
        <div className="dashboard-controls">
          <button
            onClick={() => generateChart('revenue')}
            className={selectedMetric === 'revenue' ? 'active' : ''}
          >
            💰 Revenue
          </button>
          <button
            onClick={() => generateChart('traffic')}
            className={selectedMetric === 'traffic' ? 'active' : ''}
          >
            📈 Traffic
          </button>
          <button
            onClick={() => generateChart('users')}
            className={selectedMetric === 'users' ? 'active' : ''}
          >
            👥 Users
          </button>
        </div>
      </div>

      <div className="dashboard-grid">
        <div className="metric-cards">
          <div className="metric-card">
            <div className="metric-icon">💰</div>
            <div className="metric-content">
              <h3>Total Revenue</h3>
              <div className="metric-value">
                ${dashboardData?.totalRevenue?.toLocaleString() || '0'}
              </div>
              <div className="metric-change positive">
                ↗️ +12.5% from last month
              </div>
            </div>
          </div>

          <div className="metric-card">
            <div className="metric-icon">👥</div>
            <div className="metric-content">
              <h3>Active Users</h3>
              <div className="metric-value">
                {dashboardData?.activeUsers?.toLocaleString() || '0'}
              </div>
              <div className="metric-change positive">
                ↗️ +8.3% from last month
              </div>
            </div>
          </div>

          <div className="metric-card">
            <div className="metric-icon">📈</div>
            <div className="metric-content">
              <h3>Conversion Rate</h3>
              <div className="metric-value">
                {dashboardData?.conversionRate || '0'}%
              </div>
              <div className="metric-change negative">
                ↘️ -2.1% from last month
              </div>
            </div>
          </div>
        </div>

        <div className="chart-section">
          <div className="chart-container">
            <h3>📊 Revenue Trends</h3>
            <Bar data={revenueData} options={{ responsive: true }} />
          </div>

          <div className="chart-container">
            <h3>📈 Traffic Analytics</h3>
            <Line data={trafficData} options={{ responsive: true }} />
          </div>

          <div className="chart-container">
            <h3>👥 User Segments</h3>
            <Doughnut data={userSegmentData} options={{ responsive: true }} />
          </div>
        </div>

        <div className="ai-insights-panel">
          <h3>🤖 AI Insights</h3>
          <div className="insights-list">
            {aiInsights.map((insight, index) => (
              <div key={index} className="insight-item">
                <div className="insight-icon">{insight.icon}</div>
                <div className="insight-content">
                  <h4>{insight.title}</h4>
                  <p>{insight.description}</p>
                  <div className="insight-confidence">
                    🎯 Confidence: {Math.round(insight.confidence * 100)}%
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
