import React from 'react';
import {render, screen} from '@testing-library/react'
import {mockTestEnv} from "./Config.test"
import {App} from './App';

mockTestEnv()

test('renders learn react link', () => {
  render(<App />);
  const linkElement = screen.getByText(/devotional gatherings/i);
  expect(linkElement).toBeInTheDocument();
});
