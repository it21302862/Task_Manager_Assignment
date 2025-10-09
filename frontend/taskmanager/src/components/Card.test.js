import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import Card from './Card';

// Mock the EditTask component
jest.mock('../modals/EditTask', () => {
  return function MockEditTask({ modal, toggle, updateTask, taskObj }) {
    return modal ? (
      <div data-testid="edit-task-modal">
        <div>Edit Task Modal</div>
        <div>Title: {taskObj.title}</div>
        <div>Description: {taskObj.description}</div>
        <button onClick={toggle}>Close Modal</button>
        <button onClick={() => updateTask({ ...taskObj, title: 'Updated Title' })}>
          Update Task
        </button>
      </div>
    ) : null;
  };
});

describe('Card Component', () => {
  const mockTaskObj = {
    id: 1,
    title: 'Test Task',
    description: 'Test Description'
  };

  const mockProps = {
    taskObj: mockTaskObj,
    index: 0,
    deleteTask: jest.fn(),
    completeTask: jest.fn(),
    updateListArray: jest.fn()
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders task information correctly', () => {
    render(<Card {...mockProps} />);
    
    expect(screen.getByText('Test Task')).toBeInTheDocument();
    expect(screen.getByText('Test Description')).toBeInTheDocument();
  });

  test('applies correct color scheme based on index', () => {
    const { container } = render(<Card {...mockProps} index={0} />);
    
    const cardTop = container.querySelector('.card-top');
    const cardHeader = container.querySelector('.card-header');
    
    expect(cardTop).toHaveStyle('background-color: #5D93E1');
    expect(cardHeader).toHaveStyle('background-color: #ECF3FC');
  });

  test('applies different color schemes for different indices', () => {
    const { container } = render(<Card {...mockProps} index={1} />);
    
    const cardTop = container.querySelector('.card-top');
    const cardHeader = container.querySelector('.card-header');
    
    expect(cardTop).toHaveStyle('background-color: #F9D288');
    expect(cardHeader).toHaveStyle('background-color: #FEFAF1');
  });

  test('handles color cycling correctly for indices beyond 4', () => {
    const { container } = render(<Card {...mockProps} index={5} />);
    
    const cardTop = container.querySelector('.card-top');
    const cardHeader = container.querySelector('.card-header');
    
    // Should cycle back to first color (index 5 % 5 = 0)
    expect(cardTop).toHaveStyle('background-color: #5D93E1');
    expect(cardHeader).toHaveStyle('background-color: #ECF3FC');
  });

  test('calls completeTask when Done button is clicked', () => {
    render(<Card {...mockProps} />);
    
    const doneButton = screen.getByText('Done');
    fireEvent.click(doneButton);
    
    expect(mockProps.completeTask).toHaveBeenCalledTimes(1);
  });

  test('calls deleteTask when delete icon is clicked', () => {
    render(<Card {...mockProps} />);
    
    const deleteIcon = document.querySelector('.fa-trash-alt');
    fireEvent.click(deleteIcon);
    
    expect(mockProps.deleteTask).toHaveBeenCalledTimes(1);
  });

  test('opens edit modal when edit icon is clicked', () => {
    render(<Card {...mockProps} />);
    
    const editIcon = document.querySelector('.fa-edit');
    fireEvent.click(editIcon);
    
    expect(screen.getByTestId('edit-task-modal')).toBeInTheDocument();
  });

  test('closes edit modal when toggle is called', () => {
    render(<Card {...mockProps} />);
    
    // Open modal
    const editIcon = document.querySelector('.fa-edit');
    fireEvent.click(editIcon);
    
    expect(screen.getByTestId('edit-task-modal')).toBeInTheDocument();
    
    // Close modal
    const closeButton = screen.getByText('Close Modal');
    fireEvent.click(closeButton);
    
    expect(screen.queryByTestId('edit-task-modal')).not.toBeInTheDocument();
  });

  test('calls updateListArray when task is updated', () => {
    render(<Card {...mockProps} />);
    
    // Open modal
    const editIcon = document.querySelector('.fa-edit');
    fireEvent.click(editIcon);
    
    // Update task
    const updateButton = screen.getByText('Update Task');
    fireEvent.click(updateButton);
    
    expect(mockProps.updateListArray).toHaveBeenCalledWith({
      ...mockTaskObj,
      title: 'Updated Title'
    });
  });

  test('renders all action buttons and icons', () => {
    render(<Card {...mockProps} />);
    
    expect(screen.getByText('Done')).toBeInTheDocument();
    expect(document.querySelector('.fa-edit')).toBeInTheDocument();
    expect(document.querySelector('.fa-trash-alt')).toBeInTheDocument();
  });

  test('has correct CSS classes applied', () => {
    const { container } = render(<Card {...mockProps} />);
    
    expect(container.querySelector('.card-wrapper')).toBeInTheDocument();
    expect(container.querySelector('.card-top')).toBeInTheDocument();
    expect(container.querySelector('.task-holder')).toBeInTheDocument();
    expect(container.querySelector('.card-header')).toBeInTheDocument();
    expect(container.querySelector('.card-actions')).toBeInTheDocument();
  });

  test('handles empty or undefined task object gracefully', () => {
    const propsWithEmptyTask = {
      ...mockProps,
      taskObj: { id: 1, title: '', description: '' }
    };
    
    render(<Card {...propsWithEmptyTask} />);
    
    const cardHeader = document.querySelector('.card-header');
    const cardDescription = document.querySelector('.mt-3');
    
    expect(cardHeader).toBeInTheDocument();
    expect(cardDescription).toBeInTheDocument();
  });

  test('handles long task titles and descriptions', () => {
    const longTaskObj = {
      id: 1,
      title: 'This is a very long task title that might overflow or cause layout issues',
      description: 'This is a very long description that contains multiple sentences and might test the layout and rendering capabilities of the component.'
    };
    
    const propsWithLongTask = {
      ...mockProps,
      taskObj: longTaskObj
    };
    
    render(<Card {...propsWithLongTask} />);
    
    expect(screen.getByText(longTaskObj.title)).toBeInTheDocument();
    expect(screen.getByText(longTaskObj.description)).toBeInTheDocument();
  });
});
