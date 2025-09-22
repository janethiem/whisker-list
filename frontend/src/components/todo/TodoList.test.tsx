import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import TodoList from './TodoList';
import type { TodoTask, TodoQueryParams } from '../../types/todo';

// Mock the sub-components
vi.mock('../ui', () => ({
  Icon: ({ name, size, className }: any) => (
    <div data-testid="mock-icon" data-name={name} data-size={size} className={className}>
      {name}
    </div>
  ),
  Button: ({ children, onClick, variant, icon, iconSize, className }: any) => (
    <button
      onClick={onClick}
      data-variant={variant}
      data-icon={icon}
      data-icon-size={iconSize}
      className={className}
      data-testid="mock-button"
    >
      {children}
    </button>
  )
}));

vi.mock('./TodoItem', () => ({
  default: ({ todo, onEdit }: any) => (
    <div data-testid="todo-item" data-todo-id={todo.id}>
      <span>{todo.title}</span>
      <button onClick={() => onEdit(todo)} data-testid={`edit-${todo.id}`}>
        Edit {todo.id}
      </button>
    </div>
  )
}));

vi.mock('./TodoFilters', () => ({
  default: ({ onFiltersChange, initialFilters }: any) => (
    <div data-testid="todo-filters">
      <button
        onClick={() => onFiltersChange({ search: 'test' })}
        data-testid="filters-change-button"
      >
        Change Filters
      </button>
      <span data-testid="initial-filters">
        {JSON.stringify(initialFilters)}
      </span>
    </div>
  )
}));

vi.mock('./EditModal', () => ({
  default: ({ todo, onClose, onSuccess }: any) => (
    <div data-testid="edit-modal">
      <span>Modal for: {todo ? `Edit ${todo.id}` : 'New Todo'}</span>
      <button onClick={onClose} data-testid="modal-close">Close</button>
      <button onClick={onSuccess} data-testid="modal-success">Success</button>
    </div>
  )
}));

// Mock the hooks
const mockUseTodos = {
  data: null as TodoTask[] | null,
  isLoading: false,
  error: null as Error | null,
  refetch: vi.fn(),
};

vi.mock('../../hooks/useTodos', () => ({
  useTodos: () => mockUseTodos,
}));

// Mock UI_TEXT constants
vi.mock('../../constants/strings', () => ({
  UI_TEXT: {
    YOUR_TASKS: 'Your Tasks',
    ADD_TASK: 'Add Task',
    SOMETHING_WENT_WRONG: 'Something went wrong',
    FAILED_TO_LOAD_TASKS: 'Failed to load your tasks',
    TRY_AGAIN: 'Try Again',
    ALL_CAUGHT_UP: 'All caught up!',
    NO_TASKS_FOUND: 'No tasks found',
    NO_TASKS_YET: 'No tasks yet. Create your first one to get started!',
    TRY_ADJUSTING_FILTERS: 'Try adjusting your filters to see more tasks',
    CREATE_FIRST_TASK: 'Create First Task',
    TASK_COUNT: (count: number) => `(${count} task${count !== 1 ? 's' : ''})`,
  }
}));

describe('TodoList', () => {
  const defaultProps = {
    onFiltersChange: vi.fn(),
  };

  const mockTodos: TodoTask[] = [
    {
      id: 1,
      title: 'Todo 1',
      description: 'Description 1',
      isCompleted: false,
      createdAt: '2023-12-01T10:00:00Z',
      updatedAt: '2023-12-01T10:00:00Z',
      priority: 1,
    },
    {
      id: 2,
      title: 'Todo 2',
      description: 'Description 2',
      isCompleted: true,
      createdAt: '2023-12-02T10:00:00Z',
      updatedAt: '2023-12-02T10:00:00Z',
      priority: 2,
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    mockUseTodos.data = null;
    mockUseTodos.isLoading = false;
    mockUseTodos.error = null;
  });

  it('renders loading state correctly', () => {
    mockUseTodos.isLoading = true;
    
    render(<TodoList {...defaultProps} />);
    
    expect(screen.getByText('Your Tasks')).toBeInTheDocument();
    expect(screen.getByText('Add Task')).toBeInTheDocument();
    expect(screen.getByTestId('todo-filters')).toBeInTheDocument();
    
    // Should show loading skeletons
    const skeletons = screen.getAllByTestId('mock-icon');
    expect(skeletons).toHaveLength(1); // Header icon
  });

  it('renders error state correctly', () => {
    mockUseTodos.error = new Error('Failed to fetch');
    
    render(<TodoList {...defaultProps} />);
    
    expect(screen.getByText('Something went wrong')).toBeInTheDocument();
    expect(screen.getByText('Failed to fetch')).toBeInTheDocument();
    expect(screen.getByText('Try Again')).toBeInTheDocument();
    
    const tryAgainButton = screen.getByText('Try Again');
    fireEvent.click(tryAgainButton);
    expect(mockUseTodos.refetch).toHaveBeenCalledTimes(1);
  });

  it('renders empty state without filters', () => {
    mockUseTodos.data = [];
    
    render(<TodoList {...defaultProps} />);
    
    expect(screen.getByText('All caught up!')).toBeInTheDocument();
    expect(screen.getByText('No tasks yet. Create your first one to get started!')).toBeInTheDocument();
    expect(screen.getByText('Create First Task')).toBeInTheDocument();
  });

  it('renders empty state with filters', () => {
    mockUseTodos.data = [];
    const queryParams: TodoQueryParams = { search: 'test', isCompleted: true };
    
    render(<TodoList {...defaultProps} queryParams={queryParams} />);
    
    expect(screen.getByText('No tasks found')).toBeInTheDocument();
    expect(screen.getByText('Try adjusting your filters to see more tasks')).toBeInTheDocument();
    expect(screen.queryByText('Create First Task')).not.toBeInTheDocument();
  });

  it('renders todos list correctly', () => {
    mockUseTodos.data = mockTodos;
    
    render(<TodoList {...defaultProps} />);
    
    expect(screen.getByText('Your Tasks')).toBeInTheDocument();
    expect(screen.getByText('(2 tasks)')).toBeInTheDocument();
    
    expect(screen.getAllByTestId('todo-item')).toHaveLength(2);
    expect(screen.getByText('Todo 1')).toBeInTheDocument();
    expect(screen.getByText('Todo 2')).toBeInTheDocument();
  });

  it('shows task count correctly', () => {
    mockUseTodos.data = [mockTodos[0]]; // Single task
    
    render(<TodoList {...defaultProps} />);
    
    expect(screen.getByText('(1 task)')).toBeInTheDocument();
  });

  it('opens create modal when add task button is clicked', () => {
    mockUseTodos.data = mockTodos;
    
    render(<TodoList {...defaultProps} />);
    
    const addButton = screen.getByText('Add Task');
    fireEvent.click(addButton);
    
    expect(screen.getByTestId('edit-modal')).toBeInTheDocument();
    expect(screen.getByText('Modal for: New Todo')).toBeInTheDocument();
  });

  it('opens edit modal when todo edit is clicked', () => {
    mockUseTodos.data = mockTodos;
    
    render(<TodoList {...defaultProps} />);
    
    const editButton = screen.getByTestId('edit-1');
    fireEvent.click(editButton);
    
    expect(screen.getByTestId('edit-modal')).toBeInTheDocument();
    expect(screen.getByText('Modal for: Edit 1')).toBeInTheDocument();
  });

  it('closes modal correctly', () => {
    mockUseTodos.data = mockTodos;
    
    render(<TodoList {...defaultProps} />);
    
    // Open modal
    const addButton = screen.getByText('Add Task');
    fireEvent.click(addButton);
    
    expect(screen.getByTestId('edit-modal')).toBeInTheDocument();
    
    // Close modal
    const closeButton = screen.getByTestId('modal-close');
    fireEvent.click(closeButton);
    
    expect(screen.queryByTestId('edit-modal')).not.toBeInTheDocument();
  });

  it('handles modal success correctly', () => {
    mockUseTodos.data = mockTodos;
    
    render(<TodoList {...defaultProps} />);
    
    // Open modal
    const addButton = screen.getByText('Add Task');
    fireEvent.click(addButton);
    
    // Trigger success
    const successButton = screen.getByTestId('modal-success');
    fireEvent.click(successButton);
    
    expect(mockUseTodos.refetch).toHaveBeenCalledTimes(1);
  });

  it('passes query params to filters', () => {
    const queryParams: TodoQueryParams = { search: 'test', priority: 2 };
    
    render(<TodoList {...defaultProps} queryParams={queryParams} />);
    
    const initialFilters = screen.getByTestId('initial-filters');
    expect(initialFilters).toHaveTextContent(JSON.stringify(queryParams));
  });

  it('calls onFiltersChange when filters change', () => {
    const handleFiltersChange = vi.fn();
    
    render(<TodoList {...defaultProps} onFiltersChange={handleFiltersChange} />);
    
    const filtersChangeButton = screen.getByTestId('filters-change-button');
    fireEvent.click(filtersChangeButton);
    
    expect(handleFiltersChange).toHaveBeenCalledWith({ search: 'test' });
  });

  it('renders correct icons in different states', () => {
    // Test loading state icon
    mockUseTodos.isLoading = true;
    const { rerender } = render(<TodoList {...defaultProps} />);
    
    expect(screen.getByTestId('mock-icon')).toHaveAttribute('data-name', 'list');
    
    // Test error state icon
    mockUseTodos.isLoading = false;
    mockUseTodos.error = new Error('Test error');
    rerender(<TodoList {...defaultProps} />);
    
    const errorIcon = screen.getAllByTestId('mock-icon').find(icon => 
      icon.getAttribute('data-name') === 'cat-cross-paws'
    );
    expect(errorIcon).toBeInTheDocument();
    
    // Test empty state without filters
    mockUseTodos.error = null;
    mockUseTodos.data = [];
    rerender(<TodoList {...defaultProps} />);
    
    const emptyIcon = screen.getAllByTestId('mock-icon').find(icon => 
      icon.getAttribute('data-name') === 'sleeping-cat'
    );
    expect(emptyIcon).toBeInTheDocument();
    
    // Test empty state with filters
    rerender(<TodoList {...defaultProps} queryParams={{ search: 'test' }} />);
    
    const searchIcon = screen.getAllByTestId('mock-icon').find(icon => 
      icon.getAttribute('data-name') === 'cat-magnifying-glass'
    );
    expect(searchIcon).toBeInTheDocument();
  });

  it('renders all required UI elements consistently', () => {
    const states = [
      { data: mockTodos, isLoading: false, error: null },
      { data: [], isLoading: false, error: null },
      { data: null, isLoading: true, error: null },
      { data: null, isLoading: false, error: new Error('Test') },
    ];
    
    states.forEach((state, index) => {
      mockUseTodos.data = state.data;
      mockUseTodos.isLoading = state.isLoading;
      mockUseTodos.error = state.error;
      
      const { unmount } = render(<TodoList {...defaultProps} />);
      
      // All states should have header and filters
      expect(screen.getByText('Your Tasks')).toBeInTheDocument();
      expect(screen.getByText('Add Task')).toBeInTheDocument();
      expect(screen.getByTestId('todo-filters')).toBeInTheDocument();
      
      unmount();
    });
  });

  it('handles modal state correctly across different scenarios', () => {
    mockUseTodos.data = mockTodos;
    
    render(<TodoList {...defaultProps} />);
    
    // Test create modal
    fireEvent.click(screen.getByText('Add Task'));
    expect(screen.getByText('Modal for: New Todo')).toBeInTheDocument();
    
    // Close and test edit modal
    fireEvent.click(screen.getByTestId('modal-close'));
    fireEvent.click(screen.getByTestId('edit-1'));
    expect(screen.getByText('Modal for: Edit 1')).toBeInTheDocument();
    
    // Test that editing state persists correctly
    fireEvent.click(screen.getByTestId('modal-close'));
    expect(screen.queryByTestId('edit-modal')).not.toBeInTheDocument();
  });
});
