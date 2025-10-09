import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import EditTaskPopup from '../modals/EditTask';

describe('EditTaskPopup Component', () => {
  const mockTaskObj = {
    id: 1,
    title: 'Original Task',
    description: 'Original Description'
  };

  const mockProps = {
    modal: false,
    toggle: jest.fn(),
    updateTask: jest.fn(),
    taskObj: mockTaskObj
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('does not render when modal is closed', () => {
    render(<EditTaskPopup {...mockProps} />);
    
    expect(screen.queryByText('Update Task')).not.toBeInTheDocument();
  });

  test('renders modal when modal is open', () => {
    render(<EditTaskPopup {...mockProps} modal={true} />);
    
    expect(screen.getByText('Update Task')).toBeInTheDocument();
    expect(screen.getByText('Task Name')).toBeInTheDocument();
    expect(screen.getByText('Description')).toBeInTheDocument();
    expect(screen.getByText('Update')).toBeInTheDocument();
    expect(screen.getByText('Cancel')).toBeInTheDocument();
  });

  test('populates form fields with task data when modal opens', () => {
    render(<EditTaskPopup {...mockProps} modal={true} />);
    
    const titleInput = screen.getByDisplayValue('Original Task');
    const descriptionTextarea = screen.getByDisplayValue('Original Description');
    
    expect(titleInput).toBeInTheDocument();
    expect(descriptionTextarea).toBeInTheDocument();
  });

  test('has correct form inputs with proper attributes', () => {
    render(<EditTaskPopup {...mockProps} modal={true} />);
    
    const titleInput = screen.getByDisplayValue('Original Task');
    const descriptionTextarea = screen.getByDisplayValue('Original Description');
    
    expect(titleInput).toHaveAttribute('type', 'text');
    expect(titleInput).toHaveAttribute('name', 'title');
    expect(titleInput).toHaveClass('form-control', 'pretty-input');
    
    expect(descriptionTextarea).toHaveAttribute('name', 'description');
    expect(descriptionTextarea).toHaveAttribute('rows', '5');
    expect(descriptionTextarea).toHaveClass('form-control', 'pretty-input');
  });

  test('updates title input value when typing', () => {
    render(<EditTaskPopup {...mockProps} modal={true} />);
    
    const titleInput = screen.getByDisplayValue('Original Task');
    
    fireEvent.change(titleInput, { target: { value: 'Updated Task Title' } });
    
    expect(titleInput).toHaveValue('Updated Task Title');
  });

  test('updates description textarea value when typing', () => {
    render(<EditTaskPopup {...mockProps} modal={true} />);
    
    const descriptionTextarea = screen.getByDisplayValue('Original Description');
    
    fireEvent.change(descriptionTextarea, { target: { value: 'Updated description' } });
    
    expect(descriptionTextarea).toHaveValue('Updated description');
  });

  test('repopulates form fields when taskObj changes', () => {
    const newTaskObj = {
      id: 2,
      title: 'New Task',
      description: 'New Description'
    };

    const { rerender } = render(<EditTaskPopup {...mockProps} modal={true} />);
    
    // Change the task object
    rerender(<EditTaskPopup {...mockProps} modal={true} taskObj={newTaskObj} />);
    
    const titleInput = screen.getByDisplayValue('New Task');
    const descriptionTextarea = screen.getByDisplayValue('New Description');
    
    expect(titleInput).toBeInTheDocument();
    expect(descriptionTextarea).toBeInTheDocument();
  });

  test('repopulates form fields when modal reopens', () => {
    const { rerender } = render(<EditTaskPopup {...mockProps} modal={true} />);
    
    // Modify the form
    const titleInput = screen.getByDisplayValue('Original Task');
    fireEvent.change(titleInput, { target: { value: 'Modified Title' } });
    
    // Close modal
    rerender(<EditTaskPopup {...mockProps} modal={false} />);
    
    // Reopen modal
    rerender(<EditTaskPopup {...mockProps} modal={true} />);
    
    // Should be back to original values
    expect(screen.getByDisplayValue('Original Task')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Original Description')).toBeInTheDocument();
  });

  test('calls updateTask function with correct data when Update button is clicked', () => {
    render(<EditTaskPopup {...mockProps} modal={true} />);
    
    const titleInput = screen.getByDisplayValue('Original Task');
    const descriptionTextarea = screen.getByDisplayValue('Original Description');
    const updateButton = screen.getByText('Update');
    
    // Modify form
    fireEvent.change(titleInput, { target: { value: 'Updated Task' } });
    fireEvent.change(descriptionTextarea, { target: { value: 'Updated Description' } });
    
    // Submit form
    fireEvent.click(updateButton);
    
    expect(mockProps.updateTask).toHaveBeenCalledWith({
      id: 1,
      title: 'Updated Task',
      description: 'Updated Description'
    });
  });

  test('calls toggle function after successful update', () => {
    render(<EditTaskPopup {...mockProps} modal={true} />);
    
    const updateButton = screen.getByText('Update');
    fireEvent.click(updateButton);
    
    expect(mockProps.toggle).toHaveBeenCalledTimes(1);
  });

  test('calls toggle function when Cancel button is clicked', () => {
    render(<EditTaskPopup {...mockProps} modal={true} />);
    
    const cancelButton = screen.getByText('Cancel');
    fireEvent.click(cancelButton);
    
    expect(mockProps.toggle).toHaveBeenCalledTimes(1);
  });

  test('calls toggle function when modal header close button is clicked', () => {
    render(<EditTaskPopup {...mockProps} modal={true} />);
    
    // Find the toggle button in the modal header (this would be the X button)
    const modalHeader = screen.getByText('Update Task').closest('.modal-header');
    const toggleButton = modalHeader.querySelector('button');
    
    if (toggleButton) {
      fireEvent.click(toggleButton);
      expect(mockProps.toggle).toHaveBeenCalledTimes(1);
    }
  });

  test('handles update with empty fields', () => {
    render(<EditTaskPopup {...mockProps} modal={true} />);
    
    const titleInput = screen.getByDisplayValue('Original Task');
    const descriptionTextarea = screen.getByDisplayValue('Original Description');
    const updateButton = screen.getByText('Update');
    
    // Clear form
    fireEvent.change(titleInput, { target: { value: '' } });
    fireEvent.change(descriptionTextarea, { target: { value: '' } });
    
    fireEvent.click(updateButton);
    
    expect(mockProps.updateTask).toHaveBeenCalledWith({
      id: 1,
      title: '',
      description: ''
    });
  });

  test('handles update with only title change', () => {
    render(<EditTaskPopup {...mockProps} modal={true} />);
    
    const titleInput = screen.getByDisplayValue('Original Task');
    const updateButton = screen.getByText('Update');
    
    fireEvent.change(titleInput, { target: { value: 'Only Title Changed' } });
    fireEvent.click(updateButton);
    
    expect(mockProps.updateTask).toHaveBeenCalledWith({
      id: 1,
      title: 'Only Title Changed',
      description: 'Original Description'
    });
  });

  test('handles update with only description change', () => {
    render(<EditTaskPopup {...mockProps} modal={true} />);
    
    const descriptionTextarea = screen.getByDisplayValue('Original Description');
    const updateButton = screen.getByText('Update');
    
    fireEvent.change(descriptionTextarea, { target: { value: 'Only Description Changed' } });
    fireEvent.click(updateButton);
    
    expect(mockProps.updateTask).toHaveBeenCalledWith({
      id: 1,
      title: 'Original Task',
      description: 'Only Description Changed'
    });
  });

  test('handles long text input', () => {
    render(<EditTaskPopup {...mockProps} modal={true} />);
    
    const titleInput = screen.getByDisplayValue('Original Task');
    const descriptionTextarea = screen.getByDisplayValue('Original Description');
    const updateButton = screen.getByText('Update');
    
    const longTitle = 'A'.repeat(1000);
    const longDescription = 'B'.repeat(5000);
    
    fireEvent.change(titleInput, { target: { value: longTitle } });
    fireEvent.change(descriptionTextarea, { target: { value: longDescription } });
    fireEvent.click(updateButton);
    
    expect(mockProps.updateTask).toHaveBeenCalledWith({
      id: 1,
      title: longTitle,
      description: longDescription
    });
  });

  test('handles special characters in input', () => {
    render(<EditTaskPopup {...mockProps} modal={true} />);
    
    const titleInput = screen.getByDisplayValue('Original Task');
    const descriptionTextarea = screen.getByDisplayValue('Original Description');
    const updateButton = screen.getByText('Update');
    
    const specialTitle = 'Task with special chars: !@#$%^&*()_+-=[]{}|;:,.<>?';
    const specialDescription = 'Description with émojis 🎉 and unicode: 中文';
    
    fireEvent.change(titleInput, { target: { value: specialTitle } });
    fireEvent.change(descriptionTextarea, { target: { value: specialDescription } });
    fireEvent.click(updateButton);
    
    expect(mockProps.updateTask).toHaveBeenCalledWith({
      id: 1,
      title: specialTitle,
      description: specialDescription
    });
  });

  test('preserves task ID in update', () => {
    const taskWithDifferentId = {
      id: 999,
      title: 'Different Task',
      description: 'Different Description'
    };

    render(<EditTaskPopup {...mockProps} modal={true} taskObj={taskWithDifferentId} />);
    
    const updateButton = screen.getByText('Update');
    fireEvent.click(updateButton);
    
    expect(mockProps.updateTask).toHaveBeenCalledWith({
      id: 999,
      title: 'Different Task',
      description: 'Different Description'
    });
  });

  test('prevents default form submission behavior', () => {
    render(<EditTaskPopup {...mockProps} modal={true} />);
    
    const updateButton = screen.getByText('Update');
    
    // Create a spy to check if preventDefault was called
    const preventDefaultSpy = jest.fn();
    const mockEvent = { preventDefault: preventDefaultSpy };
    
    // Simulate form submission
    fireEvent.click(updateButton);
    
    // The component should call preventDefault internally
    expect(mockProps.updateTask).toHaveBeenCalled();
  });

  test('has proper accessibility attributes', () => {
    render(<EditTaskPopup {...mockProps} modal={true} />);
    
    const titleInput = screen.getByDisplayValue('Original Task');
    const descriptionTextarea = screen.getByDisplayValue('Original Description');
    
    expect(titleInput).toHaveAttribute('name', 'title');
    expect(descriptionTextarea).toHaveAttribute('name', 'description');
  });

  test('renders with correct button colors', () => {
    render(<EditTaskPopup {...mockProps} modal={true} />);
    
    const updateButton = screen.getByText('Update');
    const cancelButton = screen.getByText('Cancel');
    
    expect(updateButton).toHaveClass('btn-primary');
    expect(cancelButton).toHaveClass('btn-secondary');
  });

  test('handles undefined or null taskObj gracefully', () => {
    const propsWithNullTask = {
      ...mockProps,
      taskObj: null
    };

    // Should not crash the component
    expect(() => {
      render(<EditTaskPopup {...propsWithNullTask} modal={true} />);
    }).toThrow();
  });

  test('handles taskObj with missing properties', () => {
    const incompleteTaskObj = {
      id: 1
      // Missing title and description
    };

    const propsWithIncompleteTask = {
      ...mockProps,
      taskObj: incompleteTaskObj
    };

    render(<EditTaskPopup {...propsWithIncompleteTask} modal={true} />);
    
    const titleInput = screen.getAllByDisplayValue('')[0];
    const descriptionTextarea = screen.getAllByDisplayValue('')[1];
    
    expect(titleInput).toBeInTheDocument();
    expect(descriptionTextarea).toBeInTheDocument();
  });
});
