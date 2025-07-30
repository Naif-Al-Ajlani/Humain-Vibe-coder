# Code Preview Generation Prompts

## Component Generation Prompt
Generate React functional components based on project requirements.

### Guidelines
- Use modern React hooks (useState, useEffect, etc.)
- Include proper TypeScript interfaces when applicable
- Follow accessibility best practices
- Include basic styling with CSS classes
- Add proper error handling
- Include loading states
- Make components reusable and modular

### Template
```jsx
import React, { useState, useEffect } from 'react';
import './ComponentName.css';

const ComponentName = ({ prop1, prop2, onAction }) => {
  const [state, setState] = useState(initialValue);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Component logic
  }, [dependencies]);

  const handleAction = async () => {
    setLoading(true);
    setError(null);
    try {
      // Action logic
      onAction?.();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (error) {
    return <div className="error-state">Error: {error}</div>;
  }

  return (
    <div className="component-name">
      {/* Component JSX */}
    </div>
  );
};

export default ComponentName;
```
