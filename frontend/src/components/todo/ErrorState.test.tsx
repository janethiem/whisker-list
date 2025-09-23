import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import ErrorState from './ErrorState';
import type { TodoQueryParams } from '../../types/todo';

// Mock the sub-components
vi.mock('./TodoFilters', () => ({
  default: ({ initialFilters }: {
    onFiltersChange: (filters: TodoQueryParams) => void;
    initialFilters: TodoQueryParams
  }) => (
    <div data-testid="todo-filters">
      <span>Filters: {JSON.stringify(initialFilters)}</span>
    </div>
  )
}));

vi.mock('./TodoListHeader', () => ({
  default: ({ onAddClick }: { onAddClick: () => void }) => (
    <div data-testid="todo-list-header">
      <button onClick={onAddClick} data-testid="add-task-btn">
        Add Task
      </button>
    </div>
  )
}));

// Mock the UI components
vi.mock('../ui', () => ({
  Icon: ({ name, size, className }: { name: string; size: number; className?: string }) => (
    <div data-testid={`icon-${name}`} style={{ width: size, height: size }} className={className}>
      Icon: {name}
    </div>
  ),
  Button: ({ onClick, children, variant }: {
    onClick: () => void;
    children: React.ReactNode;
    variant?: string
  }) => (
    <button onClick={onClick} data-variant={variant} data-testid="error-button">
      {children}
    </button>
  )
}));

// Mock UI_TEXT constants
vi.mock('../../constants/strings', () => ({
  UI_TEXT: {
    SOMETHING_WENT_WRONG: 'Something went wrong',
    FAILED_TO_LOAD_TASKS: 'Failed to load your tasks',
    TRY_AGAIN: 'Try Again'
  }
}));

const mockError = new Error('Network error occurred');
const mockQueryParams: TodoQueryParams = {
  search: 'test',
  isCompleted: false
};

const mockOnFiltersChange = vi.fn();
const mockOnRetry = vi.fn();
const mockOnAddClick = vi.fn();

describe('ErrorState', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders error state with custom error message', () => {
    render(
      <ErrorState
        error={mockError}
        queryParams={mockQueryParams}
        onFiltersChange={mockOnFiltersChange}
        onRetry={mockOnRetry}
        onAddClick={mockOnAddClick}
      />
    );

    // Check that header is rendered
    expect(screen.getByTestId('todo-list-header')).toBeInTheDocument();

    // Check that filters are rendered with correct params
    expect(screen.getByTestId('todo-filters')).toBeInTheDocument();
    expect(screen.getByText('Filters: {"search":"test","isCompleted":false}')).toBeInTheDocument();

    // Check error icon
    expect(screen.getByTestId('icon-cat-cross-paws')).toBeInTheDocument();

    // Check error message
    expect(screen.getByText('Something went wrong')).toBeInTheDocument();
    expect(screen.getByText('Network error occurred')).toBeInTheDocument();
  });

  it('renders error state with default error message', () => {
    const genericError = new Error();
    render(
      <ErrorState
        error={genericError}
        queryParams={mockQueryParams}
        onFiltersChange={mockOnFiltersChange}
        onRetry={mockOnRetry}
        onAddClick={mockOnAddClick}
      />
    );

    expect(screen.getByText('Failed to load your tasks')).toBeInTheDocument();
  });

  it('handles retry button click', () => {
    render(
      <ErrorState
        error={mockError}
        queryParams={mockQueryParams}
        onFiltersChange={mockOnFiltersChange}
        onRetry={mockOnRetry}
        onAddClick={mockOnAddClick}
      />
    );

    const retryButton = screen.getByTestId('error-button');
    retryButton.click();

    expect(mockOnRetry).toHaveBeenCalledTimes(1);
  });

  it('handles add task button click', () => {
    render(
      <ErrorState
        error={mockError}
        queryParams={mockQueryParams}
        onFiltersChange={mockOnFiltersChange}
        onRetry={mockOnRetry}
        onAddClick={mockOnAddClick}
      />
    );

    const addButton = screen.getByTestId('add-task-btn');
    addButton.click();

    expect(mockOnAddClick).toHaveBeenCalledTimes(1);
  });

  it('applies correct styling to error container', () => {
    render(
      <ErrorState
        error={mockError}
        queryParams={mockQueryParams}
        onFiltersChange={mockOnFiltersChange}
        onRetry={mockOnRetry}
        onAddClick={mockOnAddClick}
      />
    );

    const errorContainer = screen.getByText('Something went wrong').closest('div');
    expect(errorContainer).toHaveClass('text-center', 'py-12', 'border', 'rounded');
    expect(errorContainer).toHaveStyle({
      backgroundColor: '#ffffff',
      borderColor: '#d4b8a3'
    });
  });

  it('renders with empty query params', () => {
    render(
      <ErrorState
        error={mockError}
        queryParams={{}}
        onFiltersChange={mockOnFiltersChange}
        onRetry={mockOnRetry}
        onAddClick={mockOnAddClick}
      />
    );

    expect(screen.getByText('Filters: {}')).toBeInTheDocument();
  });

  it('has correct button variant for retry', () => {
    render(
      <ErrorState
        error={mockError}
        queryParams={mockQueryParams}
        onFiltersChange={mockOnFiltersChange}
        onRetry={mockOnRetry}
        onAddClick={mockOnAddClick}
      />
    );

    const retryButton = screen.getByTestId('error-button');
    expect(retryButton).toHaveAttribute('data-variant', 'danger');
  });

  it('renders all required UI elements', () => {
    render(
      <ErrorState
        error={mockError}
        queryParams={mockQueryParams}
        onFiltersChange={mockOnFiltersChange}
        onRetry={mockOnRetry}
        onAddClick={mockOnAddClick}
      />
    );

    // Header component
    expect(screen.getByTestId('todo-list-header')).toBeInTheDocument();

    // Filters component
    expect(screen.getByTestId('todo-filters')).toBeInTheDocument();

    // Error icon
    expect(screen.getByTestId('icon-cat-cross-paws')).toBeInTheDocument();

    // Error title
    expect(screen.getByText('Something went wrong')).toBeInTheDocument();

    // Error message
    expect(screen.getByText('Network error occurred')).toBeInTheDocument();

    // Retry button
    expect(screen.getByText('Try Again')).toBeInTheDocument();
  });
});
