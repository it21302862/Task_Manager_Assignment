import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import TodoList from './TodoList';

// Mock fetch globally
global.fetch = jest.fn();

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
global.localStorage = localStorageMock;

// Mock the child components
jest.mock('./Card', () => {
  return function MockCard({ taskObj, deleteTask, completeTask, updateListArray }) {
    return (
      <div data-testid={`card-${taskObj.id}`}>
        <div>{taskObj.title}</div>
        <div>{taskObj.description}</div>
        <button onClick={deleteTask}>Delete</button>
        <button onClick={completeTask}>Complete</button>
        <button onClick={() => updateListArray({ ...taskObj, title: 'Updated' })}>
          Update
        </button>
      </div>
    );
  };
});

jest.mock('../modals/createTask', () => {
  return function MockCreateTask({ modal, toggle, save }) {
    return modal ? (
      <div data-testid="create-task-modal">
        <div>Create Task Modal</div>
        <button onClick={() => save({ title: 'New Task', description: 'New Description' })}>
          Save Task
        </button>
        <button onClick={toggle}>Close Modal</button>
      </div>
    ) : null;
  };
});

// Mock reactstrap components
jest.mock('reactstrap', () => ({
  Button: ({ children, ...props }) => <button {...props}>{children}</button>,
  Modal: ({ children, isOpen }) => isOpen ? <div data-testid="modal">{children}</div> : null,
  ModalHeader: ({ children }) => <div data-testid="modal-header">{children}</div>,
  ModalBody: ({ children }) => <div data-testid="modal-body">{children}</div>,
  ModalFooter: ({ children }) => <div data-testid="modal-footer">{children}</div>,
}));

describe('TodoList Component', () => {
  const mockTasks = [
    { id: 1, title: 'Task 1', description: 'Description 1', completed: false },
    { id: 2, title: 'Task 2', description: 'Description 2', completed: false },
    { id: 3, title: 'Task 3', description: 'Description 3', completed: true }
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    localStorageMock.getItem.mockReturnValue('light');
    document.body.classList.remove('dark-theme');
  });

  afterEach(() => {
    document.body.classList.remove('dark-theme');
  });

  test('renders TodoList component with header and create button', () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockTasks,
    });

    render(<TodoList />);
    
    expect(screen.getByText('Todo List')).toBeInTheDocument();
    expect(screen.getByText('Create Task')).toBeInTheDocument();
  });

  test('loads and displays tasks on component mount', async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockTasks,
    });

    render(<TodoList />);
    
    await waitFor(() => {
      expect(screen.getByText('Task 1')).toBeInTheDocument();
      expect(screen.getByText('Task 2')).toBeInTheDocument();
    });

    expect(fetch).toHaveBeenCalledWith(`${process.env.REACT_APP_API_BASE_URL}/api/tasks/recent`);
  });

  test('filters out completed tasks and limits to 5', async () => {
    const manyTasks = Array.from({ length: 10 }, (_, i) => ({
      id: i + 1,
      title: `Task ${i + 1}`,
      description: `Description ${i + 1}`,
      completed: i >= 5 // First 5 are active, rest are completed
    }));

    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => manyTasks,
    });

    render(<TodoList />);
    
    await waitFor(() => {
      expect(screen.getByText('Task 1')).toBeInTheDocument();
      expect(screen.getByText('Task 5')).toBeInTheDocument();
    });

    // Should not show completed tasks or more than 5
    expect(screen.queryByText('Task 6')).not.toBeInTheDocument();
  });

  test('handles API error gracefully', async () => {
    fetch.mockRejectedValueOnce(new Error('API Error'));

    render(<TodoList />);
    
    await waitFor(() => {
      expect(screen.getByText('Todo List')).toBeInTheDocument();
    });

    // Should still render the component even if API fails
    expect(screen.getByText('Create Task')).toBeInTheDocument();
  });

  test('handles non-ok response from API', async () => {
    fetch.mockResolvedValueOnce({
      ok: false,
      status: 500,
    });

    render(<TodoList />);
    
    await waitFor(() => {
      expect(screen.getByText('Todo List')).toBeInTheDocument();
    });

    // Should still render the component
    expect(screen.getByText('Create Task')).toBeInTheDocument();
  });

  test('toggles theme between light and dark', async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => [],
    });

    render(<TodoList />);
    
    await waitFor(() => {
      expect(screen.getByText('Todo List')).toBeInTheDocument();
    });
    
    const themeToggle = screen.getByLabelText('Toggle theme');
    
    // Initially light theme
    expect(themeToggle.querySelector('.fa-moon')).toBeInTheDocument();
    
    // Click to toggle to dark
    fireEvent.click(themeToggle);
    expect(document.body.classList.contains('dark-theme')).toBe(true);
    
    // Click to toggle back to light
    fireEvent.click(themeToggle);
    expect(document.body.classList.contains('dark-theme')).toBe(false);
  });

  test('loads theme from localStorage on mount', async () => {
    localStorageMock.getItem.mockReturnValue('dark');
    
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => [],
    });

    render(<TodoList />);
    
    await waitFor(() => {
      expect(screen.getByText('Todo List')).toBeInTheDocument();
    });
    // The component should render without crashing when localStorage returns 'dark'
    expect(screen.getByText('Todo List')).toBeInTheDocument();
  });

  test('opens create task modal when Create Task button is clicked', () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => [],
    });

    render(<TodoList />);
    
    const createButton = screen.getByText('Create Task');
    fireEvent.click(createButton);
    
    expect(screen.getByTestId('create-task-modal')).toBeInTheDocument();
  });

  test('creates new task successfully', async () => {
    fetch
      .mockResolvedValueOnce({
        ok: true,
        json: async () => [],
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ id: 4, title: 'New Task', description: 'New Description', completed: false }),
      });

    render(<TodoList />);
    
    // Open modal
    const createButton = screen.getByText('Create Task');
    fireEvent.click(createButton);
    
    // Save task
    const saveButton = screen.getByText('Save Task');
    fireEvent.click(saveButton);
    
    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith(`${process.env.REACT_APP_API_BASE_URL}/api/tasks`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: 'New Task', description: 'New Description' })
      });
    });
  });

  test('handles task creation error', async () => {
    fetch
      .mockResolvedValueOnce({
        ok: true,
        json: async () => [],
      })
      .mockRejectedValueOnce(new Error('Creation failed'));

    render(<TodoList />);
    
    // Open modal
    const createButton = screen.getByText('Create Task');
    fireEvent.click(createButton);
    
    // Save task
    const saveButton = screen.getByText('Save Task');
    fireEvent.click(saveButton);
    
    // Should not crash the component
    await waitFor(() => {
      expect(screen.getByText('Todo List')).toBeInTheDocument();
    });
  });

  test('deletes task successfully', async () => {
    fetch
      .mockResolvedValueOnce({
        ok: true,
        json: async () => mockTasks,
      })
      .mockResolvedValueOnce({
        ok: true,
      });

    render(<TodoList />);
    
    await waitFor(() => {
      expect(screen.getByText('Task 1')).toBeInTheDocument();
    });

    const deleteButton = screen.getByTestId('card-1').querySelector('button');
    fireEvent.click(deleteButton);
    
    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith(`${process.env.REACT_APP_API_BASE_URL}/api/tasks/1`, {
        method: 'DELETE'
      });
    });
  });

  test('completes task successfully', async () => {
    fetch
      .mockResolvedValueOnce({
        ok: true,
        json: async () => mockTasks,
      })
      .mockResolvedValueOnce({
        ok: true,
      });

    render(<TodoList />);
    
    await waitFor(() => {
      expect(screen.getByText('Task 1')).toBeInTheDocument();
    });

    const completeButton = screen.getByTestId('card-1').querySelectorAll('button')[1];
    fireEvent.click(completeButton);
    
    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith(`${process.env.REACT_APP_API_BASE_URL}/api/tasks/1/complete`, {
        method: 'PUT'
      });
    });
  });

  test('updates task in list when updateListArray is called', async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockTasks,
    });

    render(<TodoList />);
    
    await waitFor(() => {
      expect(screen.getByText('Task 1')).toBeInTheDocument();
    });

    const updateButton = screen.getByTestId('card-1').querySelectorAll('button')[2];
    fireEvent.click(updateButton);
    
    await waitFor(() => {
      expect(screen.getByText('Updated')).toBeInTheDocument();
    });
  });

  test('handles delete task error', async () => {
    fetch
      .mockResolvedValueOnce({
        ok: true,
        json: async () => mockTasks,
      })
      .mockRejectedValueOnce(new Error('Delete failed'));

    render(<TodoList />);
    
    await waitFor(() => {
      expect(screen.getByText('Task 1')).toBeInTheDocument();
    });

    const deleteButton = screen.getByTestId('card-1').querySelector('button');
    fireEvent.click(deleteButton);
    
    // Should not crash the component
    await waitFor(() => {
      expect(screen.getByText('Task 1')).toBeInTheDocument();
    });
  });

  test('handles complete task error', async () => {
    fetch
      .mockResolvedValueOnce({
        ok: true,
        json: async () => mockTasks,
      })
      .mockRejectedValueOnce(new Error('Complete failed'));

    render(<TodoList />);
    
    await waitFor(() => {
      expect(screen.getByText('Task 1')).toBeInTheDocument();
    });

    const completeButton = screen.getByTestId('card-1').querySelectorAll('button')[1];
    fireEvent.click(completeButton);
    
    // Should not crash the component
    await waitFor(() => {
      expect(screen.getByText('Task 1')).toBeInTheDocument();
    });
  });

  test('renders empty state when no tasks', async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => [],
    });

    render(<TodoList />);
    
    await waitFor(() => {
      expect(screen.getByText('Todo List')).toBeInTheDocument();
    });

    expect(screen.getByText('Create Task')).toBeInTheDocument();
  });

  test('displays correct theme icon', async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => [],
    });

    render(<TodoList />);
    
    await waitFor(() => {
      expect(screen.getByText('Todo List')).toBeInTheDocument();
    });
    
    // Should show moon icon for light theme
    expect(screen.getByLabelText('Toggle theme').querySelector('.fa-moon')).toBeInTheDocument();
    
    // Toggle to dark theme
    fireEvent.click(screen.getByLabelText('Toggle theme'));
    
    // Should show sun icon for dark theme
    expect(screen.getByLabelText('Toggle theme').querySelector('.fa-sun')).toBeInTheDocument();
  });
});
