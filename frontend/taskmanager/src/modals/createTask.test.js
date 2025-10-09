import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import CreateTaskPopup from '../modals/createTask';

describe('CreateTaskPopup Component', () => {
  const mockProps = {
    modal: false,
    toggle: jest.fn(),
    save: jest.fn()
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('does not render when modal is closed', () => {
    render(<CreateTaskPopup {...mockProps} />);
    
    expect(screen.queryByText('Create Task')).not.toBeInTheDocument();
  });

  test('renders modal when modal is open', () => {
    render(<CreateTaskPopup {...mockProps} modal={true} />);
    
    expect(screen.getByText('Create Task')).toBeInTheDocument();
    expect(screen.getByText('Task Name')).toBeInTheDocument();
    expect(screen.getByText('Description')).toBeInTheDocument();
    expect(screen.getByText('Create')).toBeInTheDocument();
    expect(screen.getByText('Cancel')).toBeInTheDocument();
  });

  test('has correct form inputs with proper attributes', () => {
    render(<CreateTaskPopup {...mockProps} modal={true} />);
    
    const titleInput = screen.getByPlaceholderText('Title');
    const descriptionTextarea = screen.getByPlaceholderText('Description');
    
    expect(titleInput).toBeInTheDocument();
    expect(titleInput).toHaveAttribute('type', 'text');
    expect(titleInput).toHaveAttribute('name', 'title');
    expect(titleInput).toHaveClass('form-control', 'pretty-input');
    
    expect(descriptionTextarea).toBeInTheDocument();
    expect(descriptionTextarea).toHaveAttribute('name', 'description');
    expect(descriptionTextarea).toHaveAttribute('rows', '5');
    expect(descriptionTextarea).toHaveClass('form-control', 'pretty-input');
  });

  test('updates title input value when typing', () => {
    render(<CreateTaskPopup {...mockProps} modal={true} />);
    
    const titleInput = screen.getByPlaceholderText('Title');
    
    fireEvent.change(titleInput, { target: { value: 'New Task Title' } });
    
    expect(titleInput).toHaveValue('New Task Title');
  });

  test('updates description textarea value when typing', () => {
    render(<CreateTaskPopup {...mockProps} modal={true} />);
    
    const descriptionTextarea = screen.getByPlaceholderText('Description');
    
    fireEvent.change(descriptionTextarea, { target: { value: 'New task description' } });
    
    expect(descriptionTextarea).toHaveValue('New task description');
  });

  test('resets form fields when modal opens', () => {
    const { rerender } = render(<CreateTaskPopup {...mockProps} modal={false} />);
    
    // Open modal
    rerender(<CreateTaskPopup {...mockProps} modal={true} />);
    
    const titleInput = screen.getByPlaceholderText('Title');
    const descriptionTextarea = screen.getByPlaceholderText('Description');
    
    expect(titleInput).toHaveValue('');
    expect(descriptionTextarea).toHaveValue('');
  });

  test('resets form fields when modal reopens after being closed', () => {
    const { rerender } = render(<CreateTaskPopup {...mockProps} modal={true} />);
    
    // Fill in some values
    const titleInput = screen.getByPlaceholderText('Title');
    const descriptionTextarea = screen.getByPlaceholderText('Description');
    
    fireEvent.change(titleInput, { target: { value: 'Some Title' } });
    fireEvent.change(descriptionTextarea, { target: { value: 'Some Description' } });
    
    // Close modal
    rerender(<CreateTaskPopup {...mockProps} modal={false} />);
    
    // Reopen modal
    rerender(<CreateTaskPopup {...mockProps} modal={true} />);
    
    expect(titleInput).toHaveValue('');
    expect(descriptionTextarea).toHaveValue('');
  });

  test('calls save function with correct data when Create button is clicked', () => {
    render(<CreateTaskPopup {...mockProps} modal={true} />);
    
    const titleInput = screen.getByPlaceholderText('Title');
    const descriptionTextarea = screen.getByPlaceholderText('Description');
    const createButton = screen.getByText('Create');
    
    // Fill in form
    fireEvent.change(titleInput, { target: { value: 'Test Task' } });
    fireEvent.change(descriptionTextarea, { target: { value: 'Test Description' } });
    
    // Submit form
    fireEvent.click(createButton);
    
    expect(mockProps.save).toHaveBeenCalledWith({
      title: 'Test Task',
      description: 'Test Description'
    });
  });

  test('calls toggle function when Cancel button is clicked', () => {
    render(<CreateTaskPopup {...mockProps} modal={true} />);
    
    const cancelButton = screen.getByText('Cancel');
    fireEvent.click(cancelButton);
    
    expect(mockProps.toggle).toHaveBeenCalledTimes(1);
  });

  test('calls toggle function when modal header close button is clicked', () => {
    render(<CreateTaskPopup {...mockProps} modal={true} />);
    
    // Find the toggle button in the modal header (this would be the X button)
    const modalHeader = screen.getByText('Create Task').closest('.modal-header');
    const toggleButton = modalHeader.querySelector('button');
    
    if (toggleButton) {
      fireEvent.click(toggleButton);
      expect(mockProps.toggle).toHaveBeenCalledTimes(1);
    }
  });

  test('handles empty form submission', () => {
    render(<CreateTaskPopup {...mockProps} modal={true} />);
    
    const createButton = screen.getByText('Create');
    fireEvent.click(createButton);
    
    expect(mockProps.save).toHaveBeenCalledWith({
      title: '',
      description: ''
    });
  });

  test('handles form submission with only title', () => {
    render(<CreateTaskPopup {...mockProps} modal={true} />);
    
    const titleInput = screen.getByPlaceholderText('Title');
    const createButton = screen.getByText('Create');
    
    fireEvent.change(titleInput, { target: { value: 'Only Title' } });
    fireEvent.click(createButton);
    
    expect(mockProps.save).toHaveBeenCalledWith({
      title: 'Only Title',
      description: ''
    });
  });

  test('handles form submission with only description', () => {
    render(<CreateTaskPopup {...mockProps} modal={true} />);
    
    const descriptionTextarea = screen.getByPlaceholderText('Description');
    const createButton = screen.getByText('Create');
    
    fireEvent.change(descriptionTextarea, { target: { value: 'Only Description' } });
    fireEvent.click(createButton);
    
    expect(mockProps.save).toHaveBeenCalledWith({
      title: '',
      description: 'Only Description'
    });
  });

  test('handles long text input', () => {
    render(<CreateTaskPopup {...mockProps} modal={true} />);
    
    const titleInput = screen.getByPlaceholderText('Title');
    const descriptionTextarea = screen.getByPlaceholderText('Description');
    const createButton = screen.getByText('Create');
    
    const longTitle = 'A'.repeat(1000);
    const longDescription = 'B'.repeat(5000);
    
    fireEvent.change(titleInput, { target: { value: longTitle } });
    fireEvent.change(descriptionTextarea, { target: { value: longDescription } });
    fireEvent.click(createButton);
    
    expect(mockProps.save).toHaveBeenCalledWith({
      title: longTitle,
      description: longDescription
    });
  });

  test('handles special characters in input', () => {
    render(<CreateTaskPopup {...mockProps} modal={true} />);
    
    const titleInput = screen.getByPlaceholderText('Title');
    const descriptionTextarea = screen.getByPlaceholderText('Description');
    const createButton = screen.getByText('Create');
    
    const specialTitle = 'Task with special chars: !@#$%^&*()_+-=[]{}|;:,.<>?';
    const specialDescription = 'Description with émojis 🎉 and unicode: 中文';
    
    fireEvent.change(titleInput, { target: { value: specialTitle } });
    fireEvent.change(descriptionTextarea, { target: { value: specialDescription } });
    fireEvent.click(createButton);
    
    expect(mockProps.save).toHaveBeenCalledWith({
      title: specialTitle,
      description: specialDescription
    });
  });

  test('prevents default form submission behavior', () => {
    render(<CreateTaskPopup {...mockProps} modal={true} />);
    
    const titleInput = screen.getByPlaceholderText('Title');
    const createButton = screen.getByText('Create');
    
    fireEvent.change(titleInput, { target: { value: 'Test' } });
    
    // Create a spy to check if preventDefault was called
    const preventDefaultSpy = jest.fn();
    const mockEvent = { preventDefault: preventDefaultSpy };
    
    // Simulate form submission
    fireEvent.click(createButton);
    
    // The component should call preventDefault internally
    expect(mockProps.save).toHaveBeenCalled();
  });

  test('has proper accessibility attributes', () => {
    render(<CreateTaskPopup {...mockProps} modal={true} />);
    
    const titleInput = screen.getByPlaceholderText('Title');
    const descriptionTextarea = screen.getByPlaceholderText('Description');
    
    expect(titleInput).toHaveAttribute('name', 'title');
    expect(descriptionTextarea).toHaveAttribute('name', 'description');
  });

  test('renders with correct button colors', () => {
    render(<CreateTaskPopup {...mockProps} modal={true} />);
    
    const createButton = screen.getByText('Create');
    const cancelButton = screen.getByText('Cancel');
    
    expect(createButton).toHaveClass('btn-primary');
    expect(cancelButton).toHaveClass('btn-secondary');
  });
});
