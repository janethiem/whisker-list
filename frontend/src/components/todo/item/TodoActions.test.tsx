import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import TodoActions from './TodoActions';

// Mock the Icon component
vi.mock('../../ui/Icon', () => ({
  default: ({ name, size }: any) => (
    <div data-testid="mock-icon" data-name={name} data-size={size}>
      {name}
    </div>
  )
}));

// Mock the UI_TEXT constants
vi.mock('../../../constants/strings', () => ({
  UI_TEXT: {
    EDIT_DUE_DATE_AND_PRIORITY: 'Edit due date and priority',
    EDIT: 'Edit',
    DELETE_TASK: 'Delete task',
    DELETE: 'Delete',
  }
}));

describe('TodoActions', () => {
  const defaultProps = {
    onEdit: vi.fn(),
    onDelete: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders edit and delete buttons', () => {
    render(<TodoActions {...defaultProps} />);
    
    const editButton = screen.getByText('Edit');
    const deleteButton = screen.getByText('Delete');
    
    expect(editButton).toBeInTheDocument();
    expect(deleteButton).toBeInTheDocument();
  });

  it('renders edit button with correct icon and styling', () => {
    render(<TodoActions {...defaultProps} />);
    
    const editButton = screen.getByText('Edit').closest('button');
    expect(editButton).toHaveAttribute('title', 'Edit due date and priority');
    expect(editButton).toHaveClass(
      'p-3',
      'text-gray-400',
      'hover:text-blue-600',
      'hover:bg-blue-50',
      'rounded',
      'transition-colors',
      'flex',
      'flex-col',
      'items-center',
      'min-w-[80px]'
    );
    
    const icons = screen.getAllByTestId('mock-icon');
    const editIcon = icons[0]; // First icon should be edit
    expect(editIcon).toHaveAttribute('data-name', 'edit');
    expect(editIcon).toHaveAttribute('data-size', '60');
  });

  it('renders delete button with correct icon and styling', () => {
    render(<TodoActions {...defaultProps} />);
    
    const deleteButton = screen.getByText('Delete').closest('button');
    expect(deleteButton).toHaveAttribute('title', 'Delete task');
    expect(deleteButton).toHaveClass(
      'p-3',
      'text-gray-400',
      'hover:text-red-600',
      'hover:bg-red-50',
      'rounded',
      'transition-colors',
      'flex',
      'flex-col',
      'items-center',
      'min-w-[80px]'
    );
    
    const deleteIcon = screen.getAllByTestId('mock-icon')[1]; // Second icon
    expect(deleteIcon).toHaveAttribute('data-name', 'delete');
    expect(deleteIcon).toHaveAttribute('data-size', '40');
  });

  it('calls onEdit when edit button is clicked', () => {
    const handleEdit = vi.fn();
    render(<TodoActions {...defaultProps} onEdit={handleEdit} />);
    
    const editButton = screen.getByText('Edit');
    fireEvent.click(editButton);
    
    expect(handleEdit).toHaveBeenCalledTimes(1);
  });

  it('calls onDelete when delete button is clicked', () => {
    const handleDelete = vi.fn();
    render(<TodoActions {...defaultProps} onDelete={handleDelete} />);
    
    const deleteButton = screen.getByText('Delete');
    fireEvent.click(deleteButton);
    
    expect(handleDelete).toHaveBeenCalledTimes(1);
  });

  it('disables delete button when isDeleting is true', () => {
    render(<TodoActions {...defaultProps} isDeleting={true} />);
    
    const deleteButton = screen.getByText('Delete').closest('button');
    expect(deleteButton).toBeDisabled();
    expect(deleteButton).toHaveClass('disabled:opacity-50');
  });

  it('does not disable delete button when isDeleting is false', () => {
    render(<TodoActions {...defaultProps} isDeleting={false} />);
    
    const deleteButton = screen.getByText('Delete').closest('button');
    expect(deleteButton).not.toBeDisabled();
  });

  it('does not call onDelete when delete button is disabled', () => {
    const handleDelete = vi.fn();
    render(
      <TodoActions 
        {...defaultProps} 
        onDelete={handleDelete} 
        isDeleting={true} 
      />
    );
    
    const deleteButton = screen.getByText('Delete');
    fireEvent.click(deleteButton);
    
    expect(handleDelete).not.toHaveBeenCalled();
  });

  it('has proper container layout', () => {
    render(<TodoActions {...defaultProps} />);
    
    // Find the container that wraps both buttons
    const editButton = screen.getByText('Edit').closest('button');
    const container = editButton?.parentElement;
    expect(container).toHaveClass('flex', 'items-start', 'gap-2');
  });

  it('has proper icon container styling', () => {
    render(<TodoActions {...defaultProps} />);
    
    const editIconContainer = screen.getByText('Edit').closest('button')?.querySelector('.flex.items-center.justify-center.h-\\[60px\\]');
    expect(editIconContainer).toBeInTheDocument();
    expect(editIconContainer).toHaveClass('flex', 'items-center', 'justify-center', 'h-[60px]');
  });

  it('has proper label styling', () => {
    render(<TodoActions {...defaultProps} />);
    
    const editLabel = screen.getByText('Edit');
    const deleteLabel = screen.getByText('Delete');
    
    expect(editLabel).toHaveClass('text-sm', 'font-medium', 'mt-1');
    expect(deleteLabel).toHaveClass('text-sm', 'font-medium', 'mt-1');
  });
});
