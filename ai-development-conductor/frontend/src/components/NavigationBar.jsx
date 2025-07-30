import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './NavigationBar.css';

const NavigationBar = () => {
  const location = useLocation();

  const navItems = [
    { path: '/', label: 'Home', icon: '🏠' },
    { path: '/projects', label: 'Projects', icon: '📁' },
    { path: '/agents', label: 'Agents', icon: '🤖' },
    { path: '/workflows', label: 'Workflows', icon: '⚙️' }
  ];

  return (
    <nav className="navigation-bar">
      <div className="nav-brand">
        <h2>🎯 AI Conductor</h2>
      </div>
      <ul className="nav-links">
        {navItems.map((item) => (
          <li key={item.path}>
            <Link
              to={item.path}
              className={location.pathname === item.path ? 'active' : ''}
            >
              <span className="nav-icon">{item.icon}</span>
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
      <div className="nav-status">
        <StatusIndicator />
      </div>
    </nav>
  );
};

export default NavigationBar;
