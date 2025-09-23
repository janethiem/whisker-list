import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
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

vi.mock('./features/TodoFilters', () => ({
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

vi.mock('./containers/TodoListHeader', () => ({
  default: ({ todoCount, onAddClick }: any) => (
    <div data-testid="todo-list-header">
      <span>Header {todoCount !== undefined ? `(${todoCount} tasks)` : ''}</span>
      <button onClick={onAddClick} data-testid="header-add-button">
        Add Task
      </button>
    </div>
  )
}));

vi.mock('./states/LoadingSkeleton', () => ({
  default: () => <div data-testid="loading-skeleton">Loading...</div>
}));

vi.mock('./containers/TodoListContent', () => ({
  default: ({ todos, queryParams, onFiltersChange, onEdit, onAddClick }: any) => (
    <div data-testid="todo-list-content">
      <div>Content ({todos?.length || 0} todos)</div>
      <div data-testid="content-query-params">{JSON.stringify(queryParams)}</div>
      <div data-testid="todo-list-header">
        <span>Header ({todos?.length || 0} tasks)</span>
        <button onClick={onAddClick} data-testid="content-add-button">
          Add Task
        </button>
      </div>
      <div data-testid="todo-filters">
        <button
          onClick={() => onFiltersChange && onFiltersChange({ search: 'test' })}
          data-testid="filters-change-button"
        >
          Change Filters
        </button>
        <span data-testid="initial-filters">
          {JSON.stringify(queryParams)}
        </span>
      </div>
      <button onClick={() => onEdit && onEdit(todos?.[0])} data-testid="content-edit-button">
        Edit First
      </button>
    </div>
  )
}));

vi.mock('./states/ErrorState', () => ({
  default: ({ error, queryParams: _, onFiltersChange: __, onRetry, onAddClick }: any) => (
    <div data-testid="error-state">
      <div data-testid="todo-list-header">Header</div>
      <span>Error: {error.message}</span>
      <button onClick={onRetry} data-testid="error-retry-button">Retry</button>
      <button onClick={onAddClick} data-testid="error-add-button">Add</button>
    </div>
  )
}));

vi.mock('./states/EmptyState', () => ({
  default: ({ queryParams: _, onFiltersChange: __, onAddClick }: any) => (
    <div data-testid="empty-state">
      <span>Empty State</span>
      <button onClick={onAddClick} data-testid="empty-add-button">Add</button>
    </div>
  )
}));

vi.mock('./features/EditModal', () => ({
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
  mockParams: {} as any, // To capture parameters passed to the hook
};

vi.mock('../../hooks/useTodos', () => ({
  useTodos: (params: any) => {
    // Capture the parameters passed to the hook
    mockUseTodos.mockParams = params;
    return mockUseTodos;
  },
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
    mockUseTodos.mockParams = {};
  });

  it('renders loading state correctly', () => {
    mockUseTodos.isLoading = true;

    render(<TodoList {...defaultProps} />);

    expect(screen.getByTestId('todo-list-header')).toBeInTheDocument();
    expect(screen.getByTestId('todo-filters')).toBeInTheDocument();
    expect(screen.getByTestId('loading-skeleton')).toBeInTheDocument();
  });

  it('renders error state correctly', () => {
    mockUseTodos.error = new Error('Failed to fetch');

    render(<TodoList {...defaultProps} />);

    expect(screen.getByTestId('error-state')).toBeInTheDocument();
    expect(screen.getByText('Error: Failed to fetch')).toBeInTheDocument();
    expect(screen.getByTestId('error-retry-button')).toBeInTheDocument();

    const retryButton = screen.getByTestId('error-retry-button');
    fireEvent.click(retryButton);
    expect(mockUseTodos.refetch).toHaveBeenCalledTimes(1);
  });

  it('renders empty state without filters', () => {
    mockUseTodos.data = [];

    render(<TodoList {...defaultProps} />);

    expect(screen.getByTestId('empty-state')).toBeInTheDocument();
    expect(screen.getByText('Empty State')).toBeInTheDocument();
    expect(screen.getByTestId('empty-add-button')).toBeInTheDocument();
  });

  it('renders empty state with filters', () => {
    mockUseTodos.data = [];
    const queryParams: TodoQueryParams = { search: 'test', isCompleted: true };

    render(<TodoList {...defaultProps} queryParams={queryParams} />);

    expect(screen.getByTestId('empty-state')).toBeInTheDocument();
    expect(screen.getByText('Empty State')).toBeInTheDocument();
  });

  it('renders todos list correctly', () => {
    mockUseTodos.data = mockTodos;

    render(<TodoList {...defaultProps} />);

    expect(screen.getByTestId('todo-list-content')).toBeInTheDocument();
    expect(screen.getByText('Content (2 todos)')).toBeInTheDocument();
  });

  it('shows task count correctly', () => {
    mockUseTodos.data = [mockTodos[0]]; // Single task

    render(<TodoList {...defaultProps} />);

    expect(screen.getByText('Content (1 todos)')).toBeInTheDocument();
  });

  it('opens create modal when add task button is clicked', () => {
    mockUseTodos.data = [];

    render(<TodoList {...defaultProps} />);

    const addButton = screen.getByTestId('empty-add-button');
    fireEvent.click(addButton);

    expect(screen.getByTestId('edit-modal')).toBeInTheDocument();
    expect(screen.getByText('Modal for: New Todo')).toBeInTheDocument();
  });

  it('opens create modal when add task button is clicked from content state', () => {
    mockUseTodos.data = mockTodos;

    render(<TodoList {...defaultProps} />);

    const addButton = screen.getByTestId('content-add-button');
    fireEvent.click(addButton);

    expect(screen.getByTestId('edit-modal')).toBeInTheDocument();
    expect(screen.getByText('Modal for: New Todo')).toBeInTheDocument();
  });

  it('opens edit modal when todo edit is clicked', () => {
    mockUseTodos.data = mockTodos;

    render(<TodoList {...defaultProps} />);

    const editButton = screen.getByTestId('content-edit-button');
    fireEvent.click(editButton);

    expect(screen.getByTestId('edit-modal')).toBeInTheDocument();
    expect(screen.getByText('Modal for: Edit 1')).toBeInTheDocument();
  });

  it('closes modal correctly', () => {
    mockUseTodos.data = [];

    render(<TodoList {...defaultProps} />);

    // Open modal
    const addButton = screen.getByTestId('empty-add-button');
    fireEvent.click(addButton);

    expect(screen.getByTestId('edit-modal')).toBeInTheDocument();

    // Close modal
    const closeButton = screen.getByTestId('modal-close');
    fireEvent.click(closeButton);

    expect(screen.queryByTestId('edit-modal')).not.toBeInTheDocument();
  });


  it('passes query params to filters', () => {
    const queryParams: TodoQueryParams = { search: 'test', priority: 2 };
    mockUseTodos.data = mockTodos; // Need data to render content state

    render(<TodoList {...defaultProps} queryParams={queryParams} />);

    // In content state, filters are inside TodoListContent
    const content = screen.getByTestId('todo-list-content');
    const initialFilters = content.querySelector('[data-testid="initial-filters"]');
    expect(initialFilters).toHaveTextContent(JSON.stringify(queryParams));
  });

  it('calls onFiltersChange when filters change', () => {
    const handleFiltersChange = vi.fn();
    mockUseTodos.data = mockTodos; // Need data to render content state

    render(<TodoList {...defaultProps} onFiltersChange={handleFiltersChange} />);

    // In content state, filters are inside TodoListContent
    const filtersChangeButton = screen.getByTestId('filters-change-button');
    fireEvent.click(filtersChangeButton);

    expect(handleFiltersChange).toHaveBeenCalledWith({ search: 'test' });
  });

  it('passes query params to content component', () => {
    const queryParams: TodoQueryParams = { search: 'test', priority: 2 };
    mockUseTodos.data = mockTodos;

    render(<TodoList {...defaultProps} queryParams={queryParams} />);

    const contentQueryParams = screen.getByTestId('content-query-params');
    expect(contentQueryParams).toHaveTextContent(JSON.stringify(queryParams));
  });

  it('renders correct components in different states', () => {
    // Test loading state
    mockUseTodos.isLoading = true;
    mockUseTodos.error = null;
    mockUseTodos.data = null;
    const { rerender } = render(<TodoList {...defaultProps} />);

    expect(screen.getByTestId('todo-list-header')).toBeInTheDocument();
    expect(screen.getByTestId('todo-filters')).toBeInTheDocument();
    expect(screen.getByTestId('loading-skeleton')).toBeInTheDocument();

    // Test error state
    mockUseTodos.isLoading = false;
    mockUseTodos.error = new Error('Test error');
    mockUseTodos.data = null;
    rerender(<TodoList {...defaultProps} />);

    expect(screen.getByTestId('error-state')).toBeInTheDocument();

    // Test empty state
    mockUseTodos.error = null;
    mockUseTodos.data = [];
    rerender(<TodoList {...defaultProps} />);

    expect(screen.getByTestId('empty-state')).toBeInTheDocument();
  });


  it('handles modal state correctly across different scenarios', () => {
    mockUseTodos.data = mockTodos;

    render(<TodoList {...defaultProps} />);

    // Test create modal - in content state, we need to use empty state to access add button
    // But for this test, let's focus on the edit functionality which is available in content state
    fireEvent.click(screen.getByTestId('content-edit-button'));
    expect(screen.getByText('Modal for: Edit 1')).toBeInTheDocument();

    // Test that editing state persists correctly
    fireEvent.click(screen.getByTestId('modal-close'));
    expect(screen.queryByTestId('edit-modal')).not.toBeInTheDocument();
  });


  // === SERVER-SIDE PARAMETER TESTS ===

  it('passes no parameters to server - all filtering is client-side', () => {
    const queryParams: TodoQueryParams = {
      search: 'test',
      isCompleted: false,
      priority: 2,
      sortBy: 'title',
      sortDescending: true
    };

    // Need to provide mock data to render content state instead of empty state
    mockUseTodos.data = mockTodos;

    render(<TodoList {...defaultProps} queryParams={queryParams} />);

    // Verify that the server receives no parameters - all filtering is client-side
    expect(mockUseTodos.mockParams).toEqual({});

    // Verify that the component renders correctly with sorting parameters
    expect(screen.getByTestId('todo-list-content')).toBeInTheDocument();

    // Verify that the content component receives the full query params (including sorting)
    const contentQueryParams = screen.getByTestId('content-query-params');
    expect(contentQueryParams).toHaveTextContent(JSON.stringify(queryParams));
  });

  it('passes no parameters to server when no filtering is applied', () => {
    const queryParams: TodoQueryParams = {
      sortBy: 'title',
      sortDescending: true
    };

    // Need to provide mock data to render content state instead of empty state
    mockUseTodos.data = mockTodos;

    render(<TodoList {...defaultProps} queryParams={queryParams} />);

    // Verify that no parameters are passed to server when only sorting is used
    expect(mockUseTodos.mockParams).toEqual({});

    // Component should render correctly even with only sorting parameters
    expect(screen.getByTestId('todo-list-content')).toBeInTheDocument();

    // Content should receive the sorting parameters for client-side processing
    const contentQueryParams = screen.getByTestId('content-query-params');
    expect(contentQueryParams).toHaveTextContent(JSON.stringify(queryParams));
  });
});
