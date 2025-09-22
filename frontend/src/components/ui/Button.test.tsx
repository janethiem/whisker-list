import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import Button from './Button';

describe('Button', () => {
  it('renders with default props', () => {
    render(<Button>Click me</Button>);
    
    const button = screen.getByRole('button', { name: 'Click me' });
    expect(button).toBeInTheDocument();
    expect(button).toHaveStyle({ backgroundColor: '#c4a484' });
  });

  it('applies different variants correctly', () => {
    const { rerender } = render(<Button variant="secondary">Secondary</Button>);
    let button = screen.getByRole('button');
    expect(button.style.backgroundColor).toBe('rgb(240, 235, 229)');

    rerender(<Button variant="danger">Danger</Button>);
    button = screen.getByRole('button');
    expect(button.style.backgroundColor).toBe('rgb(239, 68, 68)');

    rerender(<Button variant="ghost">Ghost</Button>);
    button = screen.getByRole('button');
    expect(button.style.backgroundColor).toBe('transparent');
  });

  it('applies different sizes correctly', () => {
    const { rerender } = render(<Button size="sm">Small</Button>);
    let button = screen.getByRole('button');
    expect(button).toHaveClass('px-3 py-1.5 text-sm');

    rerender(<Button size="lg">Large</Button>);
    button = screen.getByRole('button');
    expect(button).toHaveClass('px-6 py-3 text-lg');
  });

  it('shows loading state correctly', () => {
    render(<Button isLoading>Loading</Button>);
    
    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
    expect(button).toHaveStyle({ opacity: '0.7' });
    
    const spinner = screen.getByRole('button').querySelector('.animate-spin');
    expect(spinner).toBeInTheDocument();
  });

  it('renders with icon', () => {
    render(<Button icon="add">With Icon</Button>);
    
    const icon = screen.getByAltText('add icon');
    expect(icon).toBeInTheDocument();
  });

  it('handles disabled state', () => {
    render(<Button disabled>Disabled</Button>);
    
    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
    expect(button).toHaveStyle({ opacity: '0.5' });
  });

  it('calls onClick handler', () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Click me</Button>);
    
    fireEvent.click(screen.getByRole('button'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('handles hover events', () => {
    const handleMouseEnter = vi.fn();
    const handleMouseLeave = vi.fn();
    
    render(
      <Button onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
        Hover me
      </Button>
    );
    
    const button = screen.getByRole('button');
    fireEvent.mouseEnter(button);
    expect(handleMouseEnter).toHaveBeenCalledTimes(1);
    
    fireEvent.mouseLeave(button);
    expect(handleMouseLeave).toHaveBeenCalledTimes(1);
  });

  it('applies custom className', () => {
    render(<Button className="custom-class">Custom</Button>);
    
    const button = screen.getByRole('button');
    expect(button).toHaveClass('custom-class');
  });

  it('passes through HTML button attributes', () => {
    render(<Button type="submit" form="test-form">Submit</Button>);
    
    const button = screen.getByRole('button');
    expect(button).toHaveAttribute('type', 'submit');
    expect(button).toHaveAttribute('form', 'test-form');
  });

  it('does not trigger hover effects when disabled', () => {
    render(<Button disabled>Disabled</Button>);
    
    const button = screen.getByRole('button');
    const initialBgColor = button.style.backgroundColor;
    
    fireEvent.mouseEnter(button);
    expect(button.style.backgroundColor).toBe(initialBgColor);
  });

  it('does not trigger hover effects when loading', () => {
    render(<Button isLoading>Loading</Button>);
    
    const button = screen.getByRole('button');
    const initialBgColor = button.style.backgroundColor;
    
    fireEvent.mouseEnter(button);
    expect(button.style.backgroundColor).toBe(initialBgColor);
  });
});
