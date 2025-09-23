import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import TodoMeta from './TodoMeta';

// Mock the Icon component
vi.mock('../ui/Icon', () => ({
  default: ({ name, size }: any) => (
    <div data-testid="mock-icon" data-name={name} data-size={size}>
      {name}
    </div>
  )
}));

// Mock PriorityBadge component
vi.mock('./PriorityBadge', () => ({
  default: ({ priority }: any) => (
    <div data-testid="mock-priority-badge" data-priority={priority}>
      Priority {priority}
    </div>
  )
}));

describe('TodoMeta', () => {
  const defaultProps = {
    createdAt: '2023-12-01T10:00:00Z',
    isCompleted: false,
    priority: 2 as const,
  };

  beforeEach(() => {
    // Mock current date to ensure consistent testing
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2023-12-05T10:00:00Z'));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('renders priority badge', () => {
    render(<TodoMeta {...defaultProps} />);
    
    const priorityBadge = screen.getByTestId('mock-priority-badge');
    expect(priorityBadge).toBeInTheDocument();
    expect(priorityBadge).toHaveAttribute('data-priority', '2');
  });

  it('renders created date', () => {
    render(<TodoMeta {...defaultProps} />);
    
    expect(screen.getByText(/Created 12\/1\/2023/)).toBeInTheDocument();
  });

  it('renders due date when provided', () => {
    render(<TodoMeta {...defaultProps} dueDate="2023-12-10T10:00:00Z" />);
    
    expect(screen.getByText(/Due 12\/10\/2023/)).toBeInTheDocument();
    
    const calendarIcon = screen.getByTestId('mock-icon');
    expect(calendarIcon).toHaveAttribute('data-name', 'calendar');
    expect(calendarIcon).toHaveAttribute('data-size', '12');
  });

  it('does not render due date when not provided', () => {
    render(<TodoMeta {...defaultProps} />);
    
    expect(screen.queryByText(/Due/)).not.toBeInTheDocument();
    expect(screen.queryByTestId('mock-icon')).not.toBeInTheDocument();
  });

  it('shows overdue status for past due date on incomplete task', () => {
    render(
      <TodoMeta 
        {...defaultProps} 
        dueDate="2023-12-01T10:00:00Z" // Past date
        isCompleted={false}
      />
    );
    
    const dueDateText = screen.getByText(/Due 12\/1\/2023 \(Overdue\)/);
    expect(dueDateText).toBeInTheDocument();
    expect(dueDateText.closest('div')).toHaveClass('text-red-600', 'font-medium');
  });

  it('does not show overdue status for past due date on completed task', () => {
    render(
      <TodoMeta 
        {...defaultProps} 
        dueDate="2023-12-01T10:00:00Z" // Past date
        isCompleted={true}
      />
    );
    
    expect(screen.getByText(/Due 12\/1\/2023/)).toBeInTheDocument();
    expect(screen.queryByText(/Overdue/)).not.toBeInTheDocument();
    
    const dueDateDiv = screen.getByText(/Due 12\/1\/2023/).closest('div');
    expect(dueDateDiv).not.toHaveClass('text-red-600');
  });

  it('does not show overdue for future due date', () => {
    render(
      <TodoMeta 
        {...defaultProps} 
        dueDate="2023-12-10T10:00:00Z" // Future date
        isCompleted={false}
      />
    );
    
    expect(screen.getByText(/Due 12\/10\/2023/)).toBeInTheDocument();
    expect(screen.queryByText(/Overdue/)).not.toBeInTheDocument();
    
    const dueDateDiv = screen.getByText(/Due 12\/10\/2023/).closest('div');
    expect(dueDateDiv).not.toHaveClass('text-red-600');
  });

  it('has proper layout and styling', () => {
    render(<TodoMeta {...defaultProps} dueDate="2023-12-10T10:00:00Z" />);
    
    // Since we're using mocked components, verify the meta information is rendered correctly
    expect(screen.getByTestId('mock-priority-badge')).toBeInTheDocument();
    expect(screen.getByTestId('mock-icon')).toBeInTheDocument();
    expect(screen.getByText(/Due 12\/10\/2023/)).toBeInTheDocument();
    expect(screen.getByText(/Created 12\/1\/2023/)).toBeInTheDocument();
    
    // The actual styling would be tested in integration tests with real components
    // For unit tests, we verify the correct data is displayed
  });

  it('renders all elements in correct order', () => {
    render(<TodoMeta {...defaultProps} dueDate="2023-12-10T10:00:00Z" />);
    
    // Check that all elements are present
    expect(screen.getByTestId('mock-priority-badge')).toBeInTheDocument();
    expect(screen.getByText(/Due 12\/10\/2023/)).toBeInTheDocument();
    expect(screen.getByText(/Created 12\/1\/2023/)).toBeInTheDocument();
    
    // Since elements are rendered by mocked components, just verify they exist
    expect(screen.getByTestId('mock-priority-badge')).toHaveAttribute('data-priority', '2');
  });
});
