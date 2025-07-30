# Lovable Component Generation Prompts

## Core Prompt
Generate a React component compatible with the Lovable design system.

### Guidelines
- Use Lovable's design tokens for colors, spacing, and typography.
- Adhere to Lovable's component API and conventions.
- Ensure the generated component is accessible and responsive.
- The component should be self-contained and easily reusable.

### Example
**User Request:** "Create a primary button component."

**Generated Code:**
```jsx
import React from 'react';
import { useTheme } from '@lovable/theme';

const PrimaryButton = ({ children, onClick, disabled }) => {
  const theme = useTheme();

  const styles = {
    backgroundColor: theme.colors.primary,
    color: theme.colors.white,
    padding: `${theme.spacing.small} ${theme.spacing.medium}`,
    borderRadius: theme.radii.medium,
    border: 'none',
    cursor: disabled ? 'not-allowed' : 'pointer',
    opacity: disabled ? 0.6 : 1,
  };

  return (
    <button style={styles} onClick={onClick} disabled={disabled}>
      {children}
    </button>
  );
};

export default PrimaryButton;
```
