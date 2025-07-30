import React from 'react';
import './LoadingSpinner.css';

const LoadingSpinner = ({
  size = 'medium',
  message = 'Loading...',
  variant = 'default',
  inline = false
}) => {
  const getSpinnerIcon = () => {
    switch (variant) {
      case 'ai': return '🧠';
      case 'code': return '💻';
      case 'agent': return '🤖';
      case 'workflow': return '⚙️';
      default: return '🔄';
    }
  };

  return (
    <div className={`loading-spinner ${size} ${inline ? 'inline' : 'block'}`}>
      <div className="spinner-icon animate-spin">
        {getSpinnerIcon()}
      </div>
      {message && <p className="spinner-message">{message}</p>}
    </div>
  );
};

export default LoadingSpinner;
