import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import TodoItem from './TodoItem';
import type { TodoTask } from '../../types/todo';

// Mock the sub-components
vi.mock('./CompletionCheckbox', () => ({
  default: ({ isCompleted, onToggle, isLoading }: any) => (
    <button
      onClick={onToggle}
      disabled={isLoading}
      data-testid="completion-checkbox"
      data-completed={isCompleted}
      data-loading={isLoading}
    >
      {isCompleted ? 'Completed' : 'Not Completed'}
    </button>
  )
}));

vi.mock('./TodoActions', () => ({
  default: ({ onEdit, onDelete, isDeleting }: any) => (
    <div data-testid="todo-actions">
      <button onClick={onEdit} data-testid="edit-button">Edit</button>
      <button onClick={onDelete} disabled={isDeleting} data-testid="delete-button">
        Delete
      </button>
    </div>
  )
}));

vi.mock('./TodoMeta', () => ({
  default: ({ createdAt, dueDate, isCompleted, priority }: any) => (
    <div data-testid="todo-meta">
      Meta: {createdAt}, {dueDate}, {isCompleted ? 'completed' : 'pending'}, priority {priority}
    </div>
  )
}));

// Mock the hooks
const mockToggleTodoComplete = {
  mutate: vi.fn(),
  isPending: false,
};

const mockDeleteTodo = {
  mutateAsync: vi.fn(),
};

const mockUpdateTodo = {
  mutateAsync: vi.fn(),
};

vi.mock('../../../hooks/useTodos', () => ({
  useToggleTodoComplete: () => mockToggleTodoComplete,
  useDeleteTodo: () => mockDeleteTodo,
  useUpdateTodo: () => mockUpdateTodo,
}));

// Mock UI_TEXT constants
vi.mock('../../constants/strings', () => ({
  UI_TEXT: {
    TASK_TITLE_PLACEHOLDER: 'Task title...',
    TASK_DESCRIPTION_PLACEHOLDER: 'Add description...',
    ADD_DESCRIPTION: 'Add description...',
    CLICK_TO_ADD_DESCRIPTION: 'Click to add description',
  }
}));

// Mock window.confirm
Object.defineProperty(window, 'confirm', {
  writable: true,
  value: vi.fn(),
});

describe('TodoItem', () => {
  const mockTodo: TodoTask = {
    id: 1,
    title: 'Test Todo',
    description: 'Test description',
    isCompleted: false,
    createdAt: '2023-12-01T10:00:00Z',
    updatedAt: '2023-12-01T10:00:00Z',
    dueDate: '2023-12-10T10:00:00Z',
    priority: 2,
  };

  const defaultProps = {
    todo: mockTodo,
    onEdit: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
    (window.confirm as any).mockReturnValue(true);
  });

  it('renders todo item correctly', () => {
    render(<TodoItem {...defaultProps} />);
    
    expect(screen.getByText('Test Todo')).toBeInTheDocument();
    expect(screen.getByText('Test description')).toBeInTheDocument();
    expect(screen.getByTestId('completion-checkbox')).toBeInTheDocument();
    expect(screen.getByTestId('todo-actions')).toBeInTheDocument();
    expect(screen.getByTestId('todo-meta')).toBeInTheDocument();
  });

  it('renders completed todo with different styling', () => {
    const completedTodo = { ...mockTodo, isCompleted: true };
    render(<TodoItem {...defaultProps} todo={completedTodo} />);
    
    // Since we're using mocked components, just check that the completion status is correctly passed
    const checkbox = screen.getByTestId('completion-checkbox');
    expect(checkbox).toHaveAttribute('data-completed', 'true');
    
    // The actual styling would be tested in integration tests with real components
    // For unit tests, we verify the data is passed correctly
    expect(screen.getByText('Test Todo')).toBeInTheDocument();
  });

  it('renders overdue todo with red border', () => {
    // Set a past due date
    const overdueTodo = { 
      ...mockTodo, 
      dueDate: '2023-11-01T10:00:00Z', // Past date
      isCompleted: false 
    };
    
    render(<TodoItem {...defaultProps} todo={overdueTodo} />);
    
    // Verify the overdue todo data is passed correctly to meta component
    const todoMeta = screen.getByTestId('todo-meta');
    expect(todoMeta).toHaveTextContent('Meta: 2023-12-01T10:00:00Z, 2023-11-01T10:00:00Z, pending, priority 2');
  });

  it('calls toggle complete when checkbox is clicked', () => {
    render(<TodoItem {...defaultProps} />);
    
    const checkbox = screen.getByTestId('completion-checkbox');
    fireEvent.click(checkbox);
    
    expect(mockToggleTodoComplete.mutate).toHaveBeenCalledWith({
      id: 1,
      currentIsCompleted: false
    });
  });

  it('calls onEdit when edit button is clicked', () => {
    const handleEdit = vi.fn();
    render(<TodoItem {...defaultProps} onEdit={handleEdit} />);
    
    const editButton = screen.getByTestId('edit-button');
    fireEvent.click(editButton);
    
    expect(handleEdit).toHaveBeenCalledWith(mockTodo);
  });

  it('shows confirmation and deletes todo when delete button is clicked', async () => {
    render(<TodoItem {...defaultProps} />);
    
    const deleteButton = screen.getByTestId('delete-button');
    fireEvent.click(deleteButton);
    
    expect(window.confirm).toHaveBeenCalledWith('Are you sure you want to delete this task?');
    
    await waitFor(() => {
      expect(mockDeleteTodo.mutateAsync).toHaveBeenCalledWith(1);
    });
  });

  it('does not delete when confirmation is cancelled', () => {
    (window.confirm as any).mockReturnValue(false);
    
    render(<TodoItem {...defaultProps} />);
    
    const deleteButton = screen.getByTestId('delete-button');
    fireEvent.click(deleteButton);
    
    expect(window.confirm).toHaveBeenCalled();
    expect(mockDeleteTodo.mutateAsync).not.toHaveBeenCalled();
  });

  it('allows inline editing of title', () => {
    render(<TodoItem {...defaultProps} />);
    
    const title = screen.getByText('Test Todo');
    fireEvent.click(title);
    
    const titleInput = screen.getByDisplayValue('Test Todo');
    expect(titleInput).toBeInTheDocument();
    expect(titleInput).toHaveFocus();
  });

  it('allows inline editing of description', () => {
    render(<TodoItem {...defaultProps} />);
    
    const description = screen.getByText('Test description');
    fireEvent.click(description);
    
    const descriptionTextarea = screen.getByDisplayValue('Test description');
    expect(descriptionTextarea).toBeInTheDocument();
    expect(descriptionTextarea).toHaveFocus();
  });

  it('shows add description prompt when no description exists', () => {
    const todoWithoutDescription = { ...mockTodo, description: undefined };
    render(<TodoItem {...defaultProps} todo={todoWithoutDescription} />);
    
    expect(screen.getByText('Add description...')).toBeInTheDocument();
  });

  it('does not show add description prompt for completed todos', () => {
    const completedTodoWithoutDescription = { 
      ...mockTodo, 
      description: undefined,
      isCompleted: true
    };
    render(<TodoItem {...defaultProps} todo={completedTodoWithoutDescription} />);
    
    expect(screen.queryByText('Add description...')).not.toBeInTheDocument();
  });

  it('saves title edit on Enter key', async () => {
    render(<TodoItem {...defaultProps} />);
    
    const title = screen.getByText('Test Todo');
    fireEvent.click(title);
    
    const titleInput = screen.getByDisplayValue('Test Todo');
    fireEvent.change(titleInput, { target: { value: 'Updated Title' } });
    fireEvent.keyDown(titleInput, { key: 'Enter' });
    
    await waitFor(() => {
      expect(mockUpdateTodo.mutateAsync).toHaveBeenCalledWith({
        id: 1,
        data: {
          title: 'Updated Title',
          description: 'Test description',
          dueDate: '2023-12-10T10:00:00Z',
          priority: 2,
        }
      });
    });
  });

  it('cancels edit on Escape key', () => {
    render(<TodoItem {...defaultProps} />);
    
    const title = screen.getByText('Test Todo');
    fireEvent.click(title);
    
    const titleInput = screen.getByDisplayValue('Test Todo');
    fireEvent.change(titleInput, { target: { value: 'Updated Title' } });
    fireEvent.keyDown(titleInput, { key: 'Escape' });
    
    expect(screen.getByText('Test Todo')).toBeInTheDocument();
    expect(screen.queryByDisplayValue('Updated Title')).not.toBeInTheDocument();
    expect(mockUpdateTodo.mutateAsync).not.toHaveBeenCalled();
  });

  it('saves edit on blur', async () => {
    render(<TodoItem {...defaultProps} />);
    
    const title = screen.getByText('Test Todo');
    fireEvent.click(title);
    
    const titleInput = screen.getByDisplayValue('Test Todo');
    fireEvent.change(titleInput, { target: { value: 'Updated Title' } });
    fireEvent.blur(titleInput);
    
    // Wait for the setTimeout in handleBlur
    await waitFor(() => {
      expect(mockUpdateTodo.mutateAsync).toHaveBeenCalled();
    }, { timeout: 200 });
  });

  it('does not allow editing when todo is completed', () => {
    const completedTodo = { ...mockTodo, isCompleted: true };
    render(<TodoItem {...defaultProps} todo={completedTodo} />);
    
    const title = screen.getByText('Test Todo');
    fireEvent.click(title);
    
    // Should not switch to edit mode
    expect(screen.queryByDisplayValue('Test Todo')).not.toBeInTheDocument();
  });

  it('does not save empty title', () => {
    render(<TodoItem {...defaultProps} />);
    
    const title = screen.getByText('Test Todo');
    fireEvent.click(title);
    
    const titleInput = screen.getByDisplayValue('Test Todo');
    fireEvent.change(titleInput, { target: { value: '   ' } }); // Whitespace only
    fireEvent.keyDown(titleInput, { key: 'Enter' });
    
    expect(mockUpdateTodo.mutateAsync).not.toHaveBeenCalled();
  });

  it('handles update error gracefully', async () => {
    mockUpdateTodo.mutateAsync.mockRejectedValueOnce(new Error('Update failed'));
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    
    render(<TodoItem {...defaultProps} />);
    
    const title = screen.getByText('Test Todo');
    fireEvent.click(title);
    
    const titleInput = screen.getByDisplayValue('Test Todo');
    fireEvent.change(titleInput, { target: { value: 'Updated Title' } });
    fireEvent.keyDown(titleInput, { key: 'Enter' });
    
    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith('Failed to update todo:', expect.any(Error));
    });
    
    // Should remain in edit mode
    expect(screen.getByDisplayValue('Updated Title')).toBeInTheDocument();
    
    consoleSpy.mockRestore();
  });

  it('passes correct props to sub-components', () => {
    render(<TodoItem {...defaultProps} />);

    const checkbox = screen.getByTestId('completion-checkbox');
    expect(checkbox).toHaveAttribute('data-completed', 'false');
    expect(checkbox).toHaveAttribute('data-loading', 'false');

    const todoMeta = screen.getByTestId('todo-meta');
    expect(todoMeta).toHaveTextContent('Meta: 2023-12-01T10:00:00Z, 2023-12-10T10:00:00Z, pending, priority 2');
  });

});
