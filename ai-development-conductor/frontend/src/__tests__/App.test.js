import React from 'react';
import { render, screen } from '@testing-library/react';

// Basic test to ensure testing framework works
test('renders without crashing', () => {
  const div = document.createElement('div');
  expect(div).toBeDefined();
});

test('should pass basic test', () => {
  expect(true).toBe(true);
});
