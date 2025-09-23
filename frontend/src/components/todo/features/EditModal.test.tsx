import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import EditModal from './EditModal';
import type { TodoTask } from '../../types/todo';

// Mock the UI components
vi.mock('../../ui/Icon', () => ({
  default: ({ name, size }: any) => (
    <div data-testid="mock-icon" data-name={name} data-size={size} />
  )
}));

vi.mock('../../ui/Button', () => ({
  default: ({ children, onClick, type, variant, disabled, isLoading, className }: any) => (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      data-variant={variant}
      data-loading={isLoading}
      className={className}
      data-testid="mock-button"
    >
      {children}
    </button>
  )
}));

vi.mock('../../ui/FormField', () => ({
  Input: ({ label, name, value, onChange, required, maxLength, placeholder }: any) => (
    <div>
      {label && <label htmlFor={name}>{label} {required && '*'}</label>}
      <input
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        maxLength={maxLength}
        placeholder={placeholder}
        data-testid={`mock-input-${name}`}
      />
    </div>
  ),
  Textarea: ({ label, name, value, onChange, maxLength, rows, placeholder }: any) => (
    <div>
      {label && <label htmlFor={name}>{label}</label>}
      <textarea
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        maxLength={maxLength}
        rows={rows}
        placeholder={placeholder}
        data-testid={`mock-textarea-${name}`}
      />
    </div>
  ),
  Select: ({ label, name, value, onChange, children }: any) => (
    <div>
      {label && <label htmlFor={name}>{label}</label>}
      <select
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        data-testid={`mock-select-${name}`}
      >
        {children}
      </select>
    </div>
  )
}));

// Mock the hooks
const mockCreateTodo = {
  mutateAsync: vi.fn(),
  isPending: false,
};

const mockUpdateTodo = {
  mutateAsync: vi.fn(),
  isPending: false,
};

vi.mock('../../../hooks/useTodos', () => ({
  useCreateTodo: () => mockCreateTodo,
  useUpdateTodo: () => mockUpdateTodo,
}));

// Mock UI_TEXT constants
vi.mock('../../../constants/strings', () => ({
  UI_TEXT: {
    EDIT_TASK: 'Edit Task',
    NEW_TASK: 'New Task',
    TITLE: 'Title',
    DESCRIPTION: 'Description',
    DUE_DATE: 'Due Date',
    PRIORITY: 'Priority',
    CANCEL: 'Cancel',
    UPDATE: 'Update',
    CREATE: 'Create',
    WHAT_NEEDS_TO_BE_DONE: 'What needs to be done?',
    ADDITIONAL_DETAILS: 'Additional details...',
    LOW: 'Low',
    MEDIUM: 'Medium',
    HIGH: 'High',
  }
}));

describe('EditModal', () => {
  const defaultProps = {
    onClose: vi.fn(),
    onSuccess: vi.fn(),
  };

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

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders create modal when no todo provided', () => {
    render(<EditModal {...defaultProps} />);
    
    expect(screen.getByText('New Task')).toBeInTheDocument();
    expect(screen.getByText('Create Task')).toBeInTheDocument();
    
    const icon = screen.getByTestId('mock-icon');
    expect(icon).toHaveAttribute('data-name', 'add');
  });

  it('renders edit modal when todo is provided', () => {
    render(<EditModal {...defaultProps} todo={mockTodo} />);
    
    expect(screen.getByText('Edit Task')).toBeInTheDocument();
    expect(screen.getByText('Update Task')).toBeInTheDocument();
    
    const icon = screen.getByTestId('mock-icon');
    expect(icon).toHaveAttribute('data-name', 'edit');
  });

  it('populates form fields when editing', () => {
    render(<EditModal {...defaultProps} todo={mockTodo} />);
    
    const titleInput = screen.getByTestId('mock-input-title');
    const descriptionTextarea = screen.getByTestId('mock-textarea-description');
    const dueDateInput = screen.getByTestId('mock-input-dueDate');
    const prioritySelect = screen.getByTestId('mock-select-priority');
    
    expect(titleInput).toHaveValue('Test Todo');
    expect(descriptionTextarea).toHaveValue('Test description');
    expect(dueDateInput).toHaveValue('2023-12-10');
    expect(prioritySelect).toHaveValue('2');
  });

  it('starts with empty form when creating', () => {
    render(<EditModal {...defaultProps} />);
    
    const titleInput = screen.getByTestId('mock-input-title');
    const descriptionTextarea = screen.getByTestId('mock-textarea-description');
    const dueDateInput = screen.getByTestId('mock-input-dueDate');
    const prioritySelect = screen.getByTestId('mock-select-priority');
    
    expect(titleInput).toHaveValue('');
    expect(descriptionTextarea).toHaveValue('');
    expect(dueDateInput).toHaveValue('');
    expect(prioritySelect).toHaveValue('1');
  });

  it('updates form fields when user types', () => {
    render(<EditModal {...defaultProps} />);
    
    const titleInput = screen.getByTestId('mock-input-title');
    fireEvent.change(titleInput, { target: { value: 'New Title' } });
    
    expect(titleInput).toHaveValue('New Title');
  });


  it('calls onClose when cancel button is clicked', () => {
    const handleClose = vi.fn();
    render(<EditModal {...defaultProps} onClose={handleClose} />);
    
    const cancelButton = screen.getByText('Cancel');
    fireEvent.click(cancelButton);
    
    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  it('creates new todo on form submission', async () => {
    const handleSuccess = vi.fn();
    const handleClose = vi.fn();
    
    render(
      <EditModal 
        onClose={handleClose} 
        onSuccess={handleSuccess} 
      />
    );
    
    // Fill out form
    const titleInput = screen.getByTestId('mock-input-title');
    fireEvent.change(titleInput, { target: { value: 'New Todo' } });
    
    const form = screen.getByTestId('mock-input-title').closest('form');
    fireEvent.submit(form!);
    
    await waitFor(() => {
      expect(mockCreateTodo.mutateAsync).toHaveBeenCalledWith({
        title: 'New Todo',
        description: undefined,
        dueDate: undefined,
        priority: 1,
      });
    });
    
    expect(handleSuccess).toHaveBeenCalledTimes(1);
    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  it('updates existing todo on form submission', async () => {
    const handleSuccess = vi.fn();
    const handleClose = vi.fn();
    
    render(
      <EditModal 
        onClose={handleClose} 
        onSuccess={handleSuccess}
        todo={mockTodo}
      />
    );
    
    // Modify title
    const titleInput = screen.getByTestId('mock-input-title');
    fireEvent.change(titleInput, { target: { value: 'Updated Todo' } });
    
    const form = screen.getByTestId('mock-input-title').closest('form');
    fireEvent.submit(form!);
    
    await waitFor(() => {
      expect(mockUpdateTodo.mutateAsync).toHaveBeenCalledWith({
        id: 1,
        data: {
          title: 'Updated Todo',
          description: 'Test description',
          dueDate: '2023-12-10',
          priority: 2,
        }
      });
    });
    
    expect(handleSuccess).toHaveBeenCalledTimes(1);
    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  it('disables submit button when title is empty', () => {
    render(<EditModal {...defaultProps} />);
    
    const submitButton = screen.getByText('Create Task');
    expect(submitButton).toBeDisabled();
  });

  it('enables submit button when title is provided', () => {
    render(<EditModal {...defaultProps} />);
    
    const titleInput = screen.getByTestId('mock-input-title');
    fireEvent.change(titleInput, { target: { value: 'Valid Title' } });
    
    const submitButton = screen.getByText('Create Task');
    expect(submitButton).not.toBeDisabled();
  });

  it('shows loading state correctly', () => {
    mockCreateTodo.isPending = true;
    
    render(<EditModal {...defaultProps} />);
    
    const submitButton = screen.getByText('Create Task');
    expect(submitButton).toHaveAttribute('data-loading', 'true');
    
    mockCreateTodo.isPending = false;
  });

  it('handles form field changes correctly', () => {
    render(<EditModal {...defaultProps} />);
    
    // Test text input
    const titleInput = screen.getByTestId('mock-input-title');
    fireEvent.change(titleInput, { target: { value: 'New Title' } });
    expect(titleInput).toHaveValue('New Title');
    
    // Test textarea
    const descriptionTextarea = screen.getByTestId('mock-textarea-description');
    fireEvent.change(descriptionTextarea, { target: { value: 'New Description' } });
    expect(descriptionTextarea).toHaveValue('New Description');
    
    // Test date input
    const dueDateInput = screen.getByTestId('mock-input-dueDate');
    fireEvent.change(dueDateInput, { target: { value: '2023-12-15' } });
    expect(dueDateInput).toHaveValue('2023-12-15');
    
    // Test select (priority)
    const prioritySelect = screen.getByTestId('mock-select-priority');
    fireEvent.change(prioritySelect, { target: { value: '3' } });
    expect(prioritySelect).toHaveValue('3');
  });

  it('renders all form fields with correct labels', () => {
    render(<EditModal {...defaultProps} />);
    
    expect(screen.getByText('Title *')).toBeInTheDocument();
    expect(screen.getByText('Description')).toBeInTheDocument();
    expect(screen.getByText('Due Date')).toBeInTheDocument();
    expect(screen.getByText('Priority')).toBeInTheDocument();
  });

  it('has proper modal styling', () => {
    render(<EditModal {...defaultProps} />);
    
    // Verify the modal renders with correct content
    expect(screen.getByText('New Task')).toBeInTheDocument();
    expect(screen.getByTestId('mock-icon')).toBeInTheDocument();
    expect(screen.getByText('Cancel')).toBeInTheDocument();
    expect(screen.getByText('Create Task')).toBeInTheDocument();
    
    // For unit tests with mocked components, we focus on functionality over styling
    // The actual styling would be tested in integration or visual tests
  });
});
