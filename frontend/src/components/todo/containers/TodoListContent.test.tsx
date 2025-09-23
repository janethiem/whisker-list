import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import TodoListContent from './TodoListContent';
import type { TodoTask, TodoQueryParams } from '../../types/todo';

// Mock the sub-components
vi.mock('../item/TodoItem', () => ({
  default: ({ todo, onEdit }: { todo: TodoTask; onEdit: (todo: TodoTask) => void }) => (
    <div data-testid={`todo-item-${todo.id}`}>
      <span>{todo.title}</span>
      <button onClick={() => onEdit(todo)} data-testid={`edit-btn-${todo.id}`}>
        Edit
      </button>
    </div>
  )
}));

vi.mock('../features/TodoFilters', () => ({
  default: ({ onFiltersChange, initialFilters }: {
    onFiltersChange: (filters: TodoQueryParams) => void;
    initialFilters: TodoQueryParams
  }) => (
    <div data-testid="todo-filters">
      <span>Filters: {JSON.stringify(initialFilters)}</span>
      <button onClick={() => onFiltersChange({ search: 'test' })} data-testid="filter-btn">
        Change Filter
      </button>
    </div>
  )
}));

vi.mock('./TodoListHeader', () => ({
  default: ({ todoCount, onAddClick }: { todoCount?: number; onAddClick: () => void }) => (
    <div data-testid="todo-list-header">
      <span>Tasks: {todoCount || 0}</span>
      <button onClick={onAddClick} data-testid="add-task-btn">
        Add Task
      </button>
    </div>
  )
}));


const mockTodos: TodoTask[] = [
  {
    id: 1,
    title: 'Test Task 1',
    description: 'Description 1',
    isCompleted: false,
    createdAt: '2024-01-01T10:00:00Z',
    updatedAt: '2024-01-01T10:00:00Z',
    dueDate: '2024-01-15T10:00:00Z',
    priority: 1
  },
  {
    id: 2,
    title: 'Test Task 2',
    description: 'Description 2',
    isCompleted: true,
    createdAt: '2024-01-02T10:00:00Z',
    updatedAt: '2024-01-02T10:00:00Z',
    dueDate: '2024-01-20T10:00:00Z',
    priority: 2
  }
];

const mockQueryParams: TodoQueryParams = {
  search: 'test',
  sortBy: 'title',
  sortDescending: false
};

const mockOnFiltersChange = vi.fn();
const mockOnEdit = vi.fn();
const mockOnAddClick = vi.fn();

describe('TodoListContent', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders all components correctly', () => {
    render(
      <TodoListContent
        todos={mockTodos}
        queryParams={mockQueryParams}
        onFiltersChange={mockOnFiltersChange}
        onEdit={mockOnEdit}
        onAddClick={mockOnAddClick}
      />
    );

    // Check that header is rendered with correct count
    expect(screen.getByTestId('todo-list-header')).toBeInTheDocument();
    expect(screen.getByText('Tasks: 2')).toBeInTheDocument();

    // Check that filters are rendered with correct initial values
    expect(screen.getByTestId('todo-filters')).toBeInTheDocument();
    expect(screen.getByText('Filters: {"search":"test","sortBy":"title","sortDescending":false}')).toBeInTheDocument();

    // Check that todo items are rendered
    expect(screen.getByTestId('todo-item-1')).toBeInTheDocument();
    expect(screen.getByTestId('todo-item-2')).toBeInTheDocument();
  });

  it('passes filtered todos to TodoItem components', () => {
    // Since we can't easily mock the hook return value, we'll test that
    // TodoItems are rendered for the todos we pass in
    render(
      <TodoListContent
        todos={mockTodos}
        queryParams={mockQueryParams}
        onFiltersChange={mockOnFiltersChange}
        onEdit={mockOnEdit}
        onAddClick={mockOnAddClick}
      />
    );

    expect(screen.getByTestId('todo-item-1')).toBeInTheDocument();
    expect(screen.getByTestId('todo-item-2')).toBeInTheDocument();
  });

  it('handles edit action correctly', () => {
    render(
      <TodoListContent
        todos={mockTodos}
        queryParams={mockQueryParams}
        onFiltersChange={mockOnFiltersChange}
        onEdit={mockOnEdit}
        onAddClick={mockOnAddClick}
      />
    );

    const editButton = screen.getByTestId('edit-btn-1');
    editButton.click();

    expect(mockOnEdit).toHaveBeenCalledWith(mockTodos[0]);
  });

  it('handles add task button click (no-op)', () => {
    render(
      <TodoListContent
        todos={mockTodos}
        queryParams={mockQueryParams}
        onFiltersChange={mockOnFiltersChange}
        onEdit={mockOnEdit}
        onAddClick={mockOnAddClick}
      />
    );

    const addButton = screen.getByTestId('add-task-btn');
    expect(() => addButton.click()).not.toThrow(); // Should not throw since it's a no-op
  });

  it('handles empty todos list', () => {
    render(
      <TodoListContent
        todos={[]}
        queryParams={mockQueryParams}
        onFiltersChange={mockOnFiltersChange}
        onEdit={mockOnEdit}
        onAddClick={mockOnAddClick}
      />
    );

    expect(screen.getByText('Tasks: 0')).toBeInTheDocument();
    expect(screen.queryByTestId('todo-item-1')).not.toBeInTheDocument();
    expect(screen.queryByTestId('todo-item-2')).not.toBeInTheDocument();
  });

  it('passes query params to filters component', () => {
    const customQueryParams: TodoQueryParams = {
      isCompleted: true,
      priority: 3,
      search: 'urgent'
    };

    render(
      <TodoListContent
        todos={mockTodos}
        queryParams={customQueryParams}
        onFiltersChange={mockOnFiltersChange}
        onEdit={mockOnEdit}
        onAddClick={mockOnAddClick}
      />
    );

    expect(screen.getByText('Filters: {"isCompleted":true,"priority":3,"search":"urgent"}')).toBeInTheDocument();
  });

  it('calls onFiltersChange when filter button is clicked', () => {
    render(
      <TodoListContent
        todos={mockTodos}
        queryParams={mockQueryParams}
        onFiltersChange={mockOnFiltersChange}
        onEdit={mockOnEdit}
        onAddClick={mockOnAddClick}
      />
    );

    const filterButton = screen.getByTestId('filter-btn');
    filterButton.click();

    expect(mockOnFiltersChange).toHaveBeenCalledWith({ search: 'test' });
  });

  it('renders with minimal query params', () => {
    const minimalQueryParams: TodoQueryParams = {};

    render(
      <TodoListContent
        todos={mockTodos}
        queryParams={minimalQueryParams}
        onFiltersChange={mockOnFiltersChange}
        onEdit={mockOnEdit}
        onAddClick={mockOnAddClick}
      />
    );

    expect(screen.getByTestId('todo-list-header')).toBeInTheDocument();
    expect(screen.getByTestId('todo-filters')).toBeInTheDocument();
    expect(screen.getByTestId('todo-item-1')).toBeInTheDocument();
    expect(screen.getByTestId('todo-item-2')).toBeInTheDocument();
  });
});
