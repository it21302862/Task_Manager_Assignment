import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import App from './App';

// Mock the TodoList component
jest.mock('./components/TodoList', () => {
  return function MockTodoList() {
    return <div data-testid="todo-list">TodoList Component</div>;
  };
});

// Mock bootstrap CSS
jest.mock('bootstrap/dist/css/bootstrap.min.css', () => ({}));

describe('App Component', () => {
  test('renders App component without crashing', () => {
    render(<App />);
    expect(screen.getByTestId('todo-list')).toBeInTheDocument();
  });

  test('renders TodoList component', () => {
    render(<App />);
    expect(screen.getByText('TodoList Component')).toBeInTheDocument();
  });

  test('has correct App class', () => {
    const { container } = render(<App />);
    expect(container.querySelector('.App')).toBeInTheDocument();
  });

  test('renders only TodoList component', () => {
    render(<App />);
    const appContainer = screen.getByTestId('todo-list').parentElement;
    expect(appContainer.children).toHaveLength(1);
  });

  test('component structure is correct', () => {
    const { container } = render(<App />);
    
    const appDiv = container.querySelector('.App');
    expect(appDiv).toBeInTheDocument();
    expect(appDiv.children).toHaveLength(1);
    expect(appDiv.children[0]).toHaveAttribute('data-testid', 'todo-list');
  });
});
