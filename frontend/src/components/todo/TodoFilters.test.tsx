import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import TodoFilters from './TodoFilters';
import type { TodoQueryParams } from '../../types/todo';

// Mock the UI components
vi.mock('../ui', () => ({
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
vi.mock('../../constants/strings', () => ({
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
    onFiltersChange: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
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

  it('calls onFiltersChange initially with empty filters', () => {
    render(<TodoFilters {...defaultProps} />);
    
    // Fast-forward past initial debounce
    vi.advanceTimersByTime(300);
    
    expect(defaultProps.onFiltersChange).toHaveBeenCalledWith({});
  });

  it('calls onFiltersChange with initial filters', () => {
    const initialFilters: TodoQueryParams = {
      search: 'test',
      isCompleted: true,
      priority: 2,
    };
    
    render(<TodoFilters {...defaultProps} initialFilters={initialFilters} />);
    
    // Fast-forward past initial debounce
    vi.advanceTimersByTime(300);
    
    expect(defaultProps.onFiltersChange).toHaveBeenCalledWith(initialFilters);
  });

  it('debounces search input changes', () => {
    render(<TodoFilters {...defaultProps} />);
    
    const searchInput = screen.getByPlaceholderText('Search tasks...');
    
    // Clear initial call
    vi.advanceTimersByTime(300);
    defaultProps.onFiltersChange.mockClear();
    
    // Type search term
    fireEvent.change(searchInput, { target: { value: 'test search' } });
    
    // Should not call immediately
    expect(defaultProps.onFiltersChange).not.toHaveBeenCalled();
    
    // Fast-forward past debounce
    vi.advanceTimersByTime(300);
    
    expect(defaultProps.onFiltersChange).toHaveBeenCalledWith({
      search: 'test search'
    });
  });

  it('debounces multiple rapid search changes', () => {
    render(<TodoFilters {...defaultProps} />);
    
    const searchInput = screen.getByPlaceholderText('Search tasks...');
    
    // Clear initial call
    vi.advanceTimersByTime(300);
    defaultProps.onFiltersChange.mockClear();
    
    // Rapid changes
    fireEvent.change(searchInput, { target: { value: 'a' } });
    fireEvent.change(searchInput, { target: { value: 'ab' } });
    fireEvent.change(searchInput, { target: { value: 'abc' } });
    fireEvent.change(searchInput, { target: { value: 'abcd' } });
    
    // Should not call during rapid changes
    expect(defaultProps.onFiltersChange).not.toHaveBeenCalled();
    
    // Fast-forward past debounce
    vi.advanceTimersByTime(300);
    
    // Should only be called once with final value
    expect(defaultProps.onFiltersChange).toHaveBeenCalledTimes(1);
    expect(defaultProps.onFiltersChange).toHaveBeenCalledWith({
      search: 'abcd'
    });
  });

  it('calls onFiltersChange when status filter changes', () => {
    render(<TodoFilters {...defaultProps} />);
    
    // Clear initial call
    vi.advanceTimersByTime(300);
    defaultProps.onFiltersChange.mockClear();
    
    const statusSelect = screen.getAllByTestId('mock-select')[0];
    fireEvent.change(statusSelect, { target: { value: 'true' } });
    
    // Fast-forward past debounce
    vi.advanceTimersByTime(300);
    
    expect(defaultProps.onFiltersChange).toHaveBeenCalledWith({
      isCompleted: true
    });
  });

  it('calls onFiltersChange when priority filter changes', () => {
    render(<TodoFilters {...defaultProps} />);
    
    // Clear initial call
    vi.advanceTimersByTime(300);
    defaultProps.onFiltersChange.mockClear();
    
    const prioritySelect = screen.getAllByTestId('mock-select')[1];
    fireEvent.change(prioritySelect, { target: { value: '2' } });
    
    // Fast-forward past debounce
    vi.advanceTimersByTime(300);
    
    expect(defaultProps.onFiltersChange).toHaveBeenCalledWith({
      priority: 2
    });
  });

  it('calls onFiltersChange when sort changes', () => {
    render(<TodoFilters {...defaultProps} />);
    
    // Clear initial call
    vi.advanceTimersByTime(300);
    defaultProps.onFiltersChange.mockClear();
    
    const sortSelect = screen.getAllByTestId('mock-select')[2];
    fireEvent.change(sortSelect, { target: { value: 'title' } });
    
    // Fast-forward past debounce
    vi.advanceTimersByTime(300);
    
    expect(defaultProps.onFiltersChange).toHaveBeenCalledWith({
      sortBy: 'title'
    });
  });

  it('shows clear button when filters are active', () => {
    const initialFilters: TodoQueryParams = {
      search: 'test',
      isCompleted: true,
    };
    
    render(<TodoFilters {...defaultProps} initialFilters={initialFilters} />);
    
    expect(screen.getByText('Clear')).toBeInTheDocument();
  });

  it('does not show clear button when no filters are active', () => {
    render(<TodoFilters {...defaultProps} />);
    
    expect(screen.queryByText('Clear')).not.toBeInTheDocument();
  });

  it('clears all filters when clear button is clicked', () => {
    const initialFilters: TodoQueryParams = {
      search: 'test',
      isCompleted: true,
      priority: 2,
    };
    
    render(<TodoFilters {...defaultProps} initialFilters={initialFilters} />);
    
    // Clear initial call
    vi.advanceTimersByTime(300);
    defaultProps.onFiltersChange.mockClear();
    
    const clearButton = screen.getByText('Clear');
    fireEvent.click(clearButton);
    
    // Fast-forward past debounce
    vi.advanceTimersByTime(300);
    
    expect(defaultProps.onFiltersChange).toHaveBeenCalledWith({});
    
    // Clear button should no longer be visible
    expect(screen.queryByText('Clear')).not.toBeInTheDocument();
  });

  it('populates form with initial filters', () => {
    const initialFilters: TodoQueryParams = {
      search: 'initial search',
      isCompleted: false,
      priority: 3,
      sortBy: 'dueDate',
    };
    
    render(<TodoFilters {...defaultProps} initialFilters={initialFilters} />);
    
    const searchInput = screen.getByPlaceholderText('Search tasks...');
    expect(searchInput).toHaveValue('initial search');
    
    const selects = screen.getAllByTestId('mock-select');
    expect(selects[0]).toHaveValue('false'); // isCompleted
    expect(selects[1]).toHaveValue('3');     // priority
    expect(selects[2]).toHaveValue('dueDate'); // sortBy
  });

  it('updates form when initialFilters prop changes', () => {
    const { rerender } = render(<TodoFilters {...defaultProps} />);
    
    const searchInput = screen.getByPlaceholderText('Search tasks...');
    expect(searchInput).toHaveValue('');
    
    const newFilters: TodoQueryParams = {
      search: 'new search'
    };
    
    rerender(<TodoFilters {...defaultProps} initialFilters={newFilters} />);
    expect(searchInput).toHaveValue('new search');
  });

  it('handles empty string values correctly', () => {
    render(<TodoFilters {...defaultProps} />);
    
    // Clear initial call
    vi.advanceTimersByTime(300);
    defaultProps.onFiltersChange.mockClear();
    
    const searchInput = screen.getByPlaceholderText('Search tasks...');
    
    // First add some text
    fireEvent.change(searchInput, { target: { value: 'test' } });
    vi.advanceTimersByTime(300);
    
    // Clear the previous call
    defaultProps.onFiltersChange.mockClear();
    
    // Then clear it
    fireEvent.change(searchInput, { target: { value: '' } });
    
    // Fast-forward past debounce
    vi.advanceTimersByTime(300);
    
    expect(defaultProps.onFiltersChange).toHaveBeenCalledWith({
      search: undefined
    });
  });

  it('prevents infinite re-renders with stable callback ref', async () => {
    let renderCount = 0;
    const TestWrapper = () => {
      renderCount++;
      // Simulate parent component that creates new function on each render
      const handleFiltersChange = () => {};
      return <TodoFilters onFiltersChange={handleFiltersChange} />;
    };
    
    render(<TestWrapper />);
    
    // Let initial effects settle
    vi.advanceTimersByTime(300);
    
    // Should not cause excessive re-renders
    expect(renderCount).toBeLessThan(5);
  });

  it('has proper container styling', () => {
    render(<TodoFilters {...defaultProps} />);
    
    const container = screen.getByPlaceholderText('Search tasks...').closest('div')?.parentElement;
    expect(container).toHaveClass(
      'flex',
      'flex-wrap',
      'items-center',
      'gap-3',
      'p-4',
      'border',
      'rounded',
      'mb-6'
    );
  });
});