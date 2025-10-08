import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import TodoFilters from './TodoFilters';
import type { TodoQueryParams } from '../../../types/todo';

// Mock the UI components
vi.mock('../../ui', () => ({
  Input: ({ value, onChange, placeholder, type }: any) => (
    <input
      type={type || 'text'}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      data-testid="mock-input"
    />
  ),
  Select: ({ value, onChange, children }: any) => (
    <select value={value} onChange={onChange} data-testid="mock-select">
      {children}
    </select>
  ),
  Button: ({ onClick, children, variant }: any) => (
    <button onClick={onClick} data-variant={variant} data-testid="mock-button">
      {children}
    </button>
  )
}));

// Mock UI_TEXT constants
vi.mock('../../../constants/strings', () => ({
  UI_TEXT: {
    SEARCH_TASKS: 'Search tasks...',
    ALL_TASKS: 'All Tasks',
    PENDING: 'Pending',
    COMPLETED: 'Completed',
    ALL_PRIORITIES: 'All Priorities',
    LOW_PRIORITY: 'Low Priority',
    MEDIUM_PRIORITY: 'Medium Priority',
    HIGH_PRIORITY: 'High Priority',
    SORT_BY_CREATED: 'Sort by Created',
    SORT_BY_TITLE: 'Sort by Title',
    SORT_BY_DUE_DATE: 'Sort by Due Date',
    SORT_BY_PRIORITY: 'Sort by Priority',
    CLEAR: 'Clear',
  }
}));

describe('TodoFilters', () => {
  const defaultProps = {
    filters: {},
    onFiltersChange: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders all filter controls', () => {
    render(<TodoFilters {...defaultProps} />);
    
    // Search input
    expect(screen.getByPlaceholderText('Search tasks...')).toBeInTheDocument();
    
    // Status filter
    expect(screen.getByText('All Tasks')).toBeInTheDocument();
    expect(screen.getByText('Pending')).toBeInTheDocument();
    expect(screen.getByText('Completed')).toBeInTheDocument();
    
    // Priority filter
    expect(screen.getByText('All Priorities')).toBeInTheDocument();
    expect(screen.getByText('Low Priority')).toBeInTheDocument();
    expect(screen.getByText('Medium Priority')).toBeInTheDocument();
    expect(screen.getByText('High Priority')).toBeInTheDocument();
    
    // Sort options
    expect(screen.getByText('Sort by Created')).toBeInTheDocument();
    expect(screen.getByText('Sort by Title')).toBeInTheDocument();
    expect(screen.getByText('Sort by Due Date')).toBeInTheDocument();
    expect(screen.getByText('Sort by Priority')).toBeInTheDocument();
  });

  it('populates form with initial filters', () => {
    const filters: TodoQueryParams = {
      search: 'initial search',
      isCompleted: false,
      priority: 3,
      sortBy: 'dueDate',
    };
    
    render(<TodoFilters {...defaultProps} filters={filters} />);
    
    const searchInput = screen.getByPlaceholderText('Search tasks...');
    expect(searchInput).toHaveValue('initial search');
    
    const selects = screen.getAllByTestId('mock-select');
    expect(selects[0]).toHaveValue('false'); // isCompleted
    expect(selects[1]).toHaveValue('3');     // priority
    expect(selects[2]).toHaveValue('dueDate'); // sortBy
  });

  it('filters by search text', () => {
    render(<TodoFilters {...defaultProps} />);
    
    const searchInput = screen.getByPlaceholderText('Search tasks...');
    fireEvent.change(searchInput, { target: { value: 'buy milk' } });
    
    expect(defaultProps.onFiltersChange).toHaveBeenCalledWith({
      search: 'buy milk'
    });
  });

  it('filters by completion status', () => {
    render(<TodoFilters {...defaultProps} />);
    
    const statusSelect = screen.getAllByTestId('mock-select')[0];
    fireEvent.change(statusSelect, { target: { value: 'true' } });
    
    expect(defaultProps.onFiltersChange).toHaveBeenCalledWith({
      isCompleted: true
    });
  });

  it('filters by priority level', () => {
    render(<TodoFilters {...defaultProps} />);
    
    const prioritySelect = screen.getAllByTestId('mock-select')[1];
    fireEvent.change(prioritySelect, { target: { value: '3' } });
    
    expect(defaultProps.onFiltersChange).toHaveBeenCalledWith({
      priority: 3
    });
  });

  it('sorts by selected criteria', () => {
    render(<TodoFilters {...defaultProps} />);
    
    const sortSelect = screen.getAllByTestId('mock-select')[2];
    fireEvent.change(sortSelect, { target: { value: 'dueDate' } });
    
    expect(defaultProps.onFiltersChange).toHaveBeenCalledWith({
      sortBy: 'dueDate'
    });
  });

  it('clears all active filters', () => {
    const filters: TodoQueryParams = {
      search: 'test',
      isCompleted: true,
      priority: 2,
    };
    
    render(<TodoFilters {...defaultProps} filters={filters} />);
    
    expect(screen.getByText('Clear')).toBeInTheDocument();
    
    fireEvent.click(screen.getByText('Clear'));
    
    expect(defaultProps.onFiltersChange).toHaveBeenCalledWith({});
  });

  it('shows clear button only when filters are active', () => {
    // Render without filters - no clear button
    const { unmount } = render(<TodoFilters {...defaultProps} filters={{}} />);
    expect(screen.queryByText('Clear')).not.toBeInTheDocument();
    unmount();
    
    // Render with filters - clear button appears
    const filters: TodoQueryParams = {
      search: 'test',
      isCompleted: true,
    };
    render(<TodoFilters {...defaultProps} filters={filters} />);
    expect(screen.getByText('Clear')).toBeInTheDocument();
  });

  it('converts empty strings to undefined in filter values', () => {
    const { rerender } = render(<TodoFilters {...defaultProps} filters={{}} />);
    
    const searchInput = screen.getByPlaceholderText('Search tasks...');
    
    // First add a search value
    fireEvent.change(searchInput, { target: { value: 'test' } });
    expect(defaultProps.onFiltersChange).toHaveBeenLastCalledWith({
      search: 'test'
    });
    
    // Update component with new filters
    rerender(<TodoFilters {...defaultProps} filters={{ search: 'test' }} />);
    
    // Then clear it
    fireEvent.change(searchInput, { target: { value: '' } });
    
    expect(defaultProps.onFiltersChange).toHaveBeenLastCalledWith({
      search: undefined
    });
  });
});