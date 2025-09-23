import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import EmptyState from './EmptyState';
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
  Button: ({ onClick, children, variant, icon, iconSize, className }: {
    onClick: () => void;
    children: React.ReactNode;
    variant?: string;
    icon?: string;
    iconSize?: number;
    className?: string;
  }) => (
    <button
      onClick={onClick}
      data-variant={variant}
      data-icon={icon}
      data-iconsize={iconSize}
      className={className}
      data-testid="empty-state-button"
    >
      {children}
    </button>
  )
}));

// Mock UI_TEXT constants
vi.mock('../../constants/strings', () => ({
  UI_TEXT: {
    ALL_CAUGHT_UP: 'All caught up!',
    NO_TASKS_FOUND: 'No tasks found',
    NO_TASKS_YET: 'No tasks yet. Create your first one to get started!',
    TRY_ADJUSTING_FILTERS: 'Try adjusting your filters to see more tasks',
    CREATE_FIRST_TASK: 'Create First Task'
  }
}));

const mockQueryParams: TodoQueryParams = {
  search: 'test',
  isCompleted: false
};

const emptyQueryParams: TodoQueryParams = {};

const mockOnFiltersChange = vi.fn();
const mockOnAddClick = vi.fn();

describe('EmptyState', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('when no filters are active', () => {
    it('renders sleeping cat icon and no tasks message', () => {
      render(
        <EmptyState
          queryParams={emptyQueryParams}
          onFiltersChange={mockOnFiltersChange}
          onAddClick={mockOnAddClick}
        />
      );

      // Check header is rendered
      expect(screen.getByTestId('todo-list-header')).toBeInTheDocument();

      // Check filters are rendered with empty params
      expect(screen.getByTestId('todo-filters')).toBeInTheDocument();
      expect(screen.getByText('Filters: {}')).toBeInTheDocument();

      // Check sleeping cat icon
      expect(screen.getByTestId('icon-sleeping-cat')).toBeInTheDocument();

      // Check no tasks message
      expect(screen.getByText('All caught up!')).toBeInTheDocument();
      expect(screen.getByText('No tasks yet. Create your first one to get started!')).toBeInTheDocument();
    });

    it('renders create first task button', () => {
      render(
        <EmptyState
          queryParams={emptyQueryParams}
          onFiltersChange={mockOnFiltersChange}
          onAddClick={mockOnAddClick}
        />
      );

      const button = screen.getByTestId('empty-state-button');
      expect(button).toBeInTheDocument();
      expect(button).toHaveTextContent('Create First Task');
      expect(button).toHaveAttribute('data-variant', 'primary');
      expect(button).toHaveAttribute('data-icon', 'add');
      expect(button).toHaveAttribute('data-iconsize', '20');
    });

    it('handles add task button click', () => {
      render(
        <EmptyState
          queryParams={emptyQueryParams}
          onFiltersChange={mockOnFiltersChange}
          onAddClick={mockOnAddClick}
        />
      );

      const button = screen.getByTestId('empty-state-button');
      button.click();

      expect(mockOnAddClick).toHaveBeenCalledTimes(1);
    });
  });

  describe('when filters are active', () => {
    it('renders magnifying glass icon and no results message', () => {
      render(
        <EmptyState
          queryParams={mockQueryParams}
          onFiltersChange={mockOnFiltersChange}
          onAddClick={mockOnAddClick}
        />
      );

      // Check magnifying glass icon
      expect(screen.getByTestId('icon-cat-magnifying-glass')).toBeInTheDocument();

      // Check no results message
      expect(screen.getByText('No tasks found')).toBeInTheDocument();
      expect(screen.getByText('Try adjusting your filters to see more tasks')).toBeInTheDocument();
    });

    it('does not render create first task button when filters are active', () => {
      render(
        <EmptyState
          queryParams={mockQueryParams}
          onFiltersChange={mockOnFiltersChange}
          onAddClick={mockOnAddClick}
        />
      );

      expect(screen.queryByTestId('empty-state-button')).not.toBeInTheDocument();
    });

    it('renders filters with active params', () => {
      render(
        <EmptyState
          queryParams={mockQueryParams}
          onFiltersChange={mockOnFiltersChange}
          onAddClick={mockOnAddClick}
        />
      );

      expect(screen.getByText('Filters: {"search":"test","isCompleted":false}')).toBeInTheDocument();
    });
  });

  describe('filter detection logic', () => {
    const testCases = [
      { params: { search: 'test' }, description: 'search filter' },
      { params: { isCompleted: true }, description: 'status filter' },
      { params: { priority: 3 }, description: 'priority filter' },
      { params: { sortBy: 'title', sortDescending: true }, description: 'sort parameters' },
    ];

    testCases.forEach(({ params, description }) => {
      it(`detects ${description} as active`, () => {
        render(
          <EmptyState
            queryParams={params}
            onFiltersChange={mockOnFiltersChange}
            onAddClick={mockOnAddClick}
          />
        );

        expect(screen.getByTestId('icon-cat-magnifying-glass')).toBeInTheDocument();
        expect(screen.queryByTestId('empty-state-button')).not.toBeInTheDocument();
      });
    });

    it('treats empty string as no filter', () => {
      render(
        <EmptyState
          queryParams={{ search: '' }}
          onFiltersChange={mockOnFiltersChange}
          onAddClick={mockOnAddClick}
        />
      );

      expect(screen.getByTestId('icon-sleeping-cat')).toBeInTheDocument();
      expect(screen.getByTestId('empty-state-button')).toBeInTheDocument();
    });

    it('treats undefined values as no filter', () => {
      render(
        <EmptyState
          queryParams={{ search: undefined, isCompleted: undefined }}
          onFiltersChange={mockOnFiltersChange}
          onAddClick={mockOnAddClick}
        />
      );

      expect(screen.getByTestId('icon-sleeping-cat')).toBeInTheDocument();
      expect(screen.getByTestId('empty-state-button')).toBeInTheDocument();
    });
  });

  it('applies correct styling to empty state container', () => {
    render(
      <EmptyState
        queryParams={emptyQueryParams}
        onFiltersChange={mockOnFiltersChange}
        onAddClick={mockOnAddClick}
      />
    );

    const container = screen.getByText('All caught up!').closest('div');
    expect(container).toHaveClass('text-center', 'py-12', 'border', 'rounded');
    expect(container).toHaveStyle({
      backgroundColor: '#ffffff',
      borderColor: '#d4b8a3'
    });
  });

});
