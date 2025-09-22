import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import CompletionCheckbox from './CompletionCheckbox';

// Mock the Icon component
vi.mock('../ui/Icon', () => ({
  default: ({ name, size, className }: any) => (
    <div data-testid="mock-icon" data-name={name} data-size={size} className={className}>
      {name}
    </div>
  )
}));

describe('CompletionCheckbox', () => {
  const defaultProps = {
    isCompleted: false,
    onToggle: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders uncompleted state correctly', () => {
    render(<CompletionCheckbox {...defaultProps} />);
    
    const button = screen.getByRole('button');
    expect(button).toBeInTheDocument();
    expect(button).toHaveClass('border-gray-300');
    expect(button).not.toHaveClass('bg-green-500');
    
    // Icon should not be present when uncompleted
    expect(screen.queryByTestId('mock-icon')).not.toBeInTheDocument();
  });

  it('renders completed state correctly', () => {
    render(<CompletionCheckbox {...defaultProps} isCompleted={true} />);
    
    const button = screen.getByRole('button');
    expect(button).toHaveClass('bg-green-500', 'border-green-500');
    
    // Icon should be present when completed
    const icon = screen.getByTestId('mock-icon');
    expect(icon).toBeInTheDocument();
    expect(icon).toHaveAttribute('data-name', 'complete');
    expect(icon).toHaveAttribute('data-size', '20');
    expect(icon).toHaveClass('text-white');
  });

  it('calls onToggle when clicked', () => {
    const handleToggle = vi.fn();
    render(<CompletionCheckbox {...defaultProps} onToggle={handleToggle} />);
    
    const button = screen.getByRole('button');
    fireEvent.click(button);
    
    expect(handleToggle).toHaveBeenCalledTimes(1);
  });

  it('shows loading state correctly', () => {
    render(<CompletionCheckbox {...defaultProps} isLoading={true} />);
    
    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
    expect(button).toHaveClass('opacity-50', 'cursor-not-allowed');
  });

  it('does not call onToggle when loading', () => {
    const handleToggle = vi.fn();
    render(
      <CompletionCheckbox 
        {...defaultProps} 
        onToggle={handleToggle} 
        isLoading={true} 
      />
    );
    
    const button = screen.getByRole('button');
    fireEvent.click(button);
    
    expect(handleToggle).not.toHaveBeenCalled();
  });

  it('has proper accessibility attributes', () => {
    render(<CompletionCheckbox {...defaultProps} />);
    
    const button = screen.getByRole('button');
    expect(button).toHaveClass('focus:outline-none', 'focus:ring-2', 'focus:ring-blue-500');
  });

  it('applies hover styles for uncompleted state', () => {
    render(<CompletionCheckbox {...defaultProps} />);
    
    const button = screen.getByRole('button');
    expect(button).toHaveClass('hover:border-green-400');
  });

  it('has proper dimensions and styling', () => {
    render(<CompletionCheckbox {...defaultProps} />);
    
    const button = screen.getByRole('button');
    expect(button).toHaveClass(
      'flex-shrink-0',
      'w-8',
      'h-8', 
      'rounded-full',
      'border-2',
      'flex',
      'items-center',
      'justify-center',
      'transition-colors'
    );
  });
});
