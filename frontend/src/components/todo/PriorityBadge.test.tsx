import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import PriorityBadge from './PriorityBadge';

describe('PriorityBadge', () => {
  it('renders low priority correctly', () => {
    render(<PriorityBadge priority={1} />);
    
    const badge = screen.getByText('Low');
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveClass(
      'bg-green-100',
      'text-green-700', 
      'border-green-200'
    );
  });

  it('renders medium priority correctly', () => {
    render(<PriorityBadge priority={2} />);
    
    const badge = screen.getByText('Medium');
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveClass(
      'bg-yellow-100',
      'text-yellow-700',
      'border-yellow-200'
    );
  });

  it('renders high priority correctly', () => {
    render(<PriorityBadge priority={3} />);
    
    const badge = screen.getByText('High');
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveClass(
      'bg-red-100',
      'text-red-700',
      'border-red-200'
    );
  });

  it('applies base styling classes', () => {
    render(<PriorityBadge priority={1} />);
    
    const badge = screen.getByText('Low');
    expect(badge).toHaveClass(
      'px-2',
      'py-1',
      'text-xs',
      'font-medium',
      'rounded',
      'border'
    );
  });

  it('applies custom className', () => {
    render(<PriorityBadge priority={1} className="custom-class" />);
    
    const badge = screen.getByText('Low');
    expect(badge).toHaveClass('custom-class');
  });

  it('renders as span element', () => {
    render(<PriorityBadge priority={1} />);
    
    const badge = screen.getByText('Low');
    expect(badge.tagName).toBe('SPAN');
  });

  it('handles all priority levels correctly', () => {
    const priorities: Array<{ value: 1 | 2 | 3; label: string; bgClass: string }> = [
      { value: 1, label: 'Low', bgClass: 'bg-green-100' },
      { value: 2, label: 'Medium', bgClass: 'bg-yellow-100' },
      { value: 3, label: 'High', bgClass: 'bg-red-100' },
    ];

    priorities.forEach(({ value, label, bgClass }) => {
      const { unmount } = render(<PriorityBadge priority={value} />);
      
      const badge = screen.getByText(label);
      expect(badge).toBeInTheDocument();
      expect(badge).toHaveClass(bgClass);
      
      unmount();
    });
  });
});
