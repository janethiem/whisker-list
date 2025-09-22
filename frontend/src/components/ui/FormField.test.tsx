import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import FormField, { Input, Textarea, Select } from './FormField';

describe('Input', () => {
  it('renders with label', () => {
    render(<Input label="Test Label" />);
    
    expect(screen.getByLabelText('Test Label')).toBeInTheDocument();
    expect(screen.getByText('Test Label')).toBeInTheDocument();
  });

  it('renders with required indicator', () => {
    render(<Input label="Required Field" required />);
    
    expect(screen.getByText('Required Field *')).toBeInTheDocument();
  });

  it('renders without label', () => {
    render(<Input placeholder="No label" />);
    
    expect(screen.getByPlaceholderText('No label')).toBeInTheDocument();
    expect(screen.queryByText('No label')).not.toBeInTheDocument();
  });

  it('shows error message', () => {
    render(<Input label="Test" error="This field is required" />);
    
    expect(screen.getByText('This field is required')).toBeInTheDocument();
    expect(screen.getByText('This field is required')).toHaveClass('text-red-600');
  });

  it('handles focus and blur events', () => {
    const handleFocus = vi.fn();
    const handleBlur = vi.fn();
    
    render(
      <Input 
        label="Test" 
        onFocus={handleFocus} 
        onBlur={handleBlur} 
      />
    );
    
    const input = screen.getByLabelText('Test');
    
    fireEvent.focus(input);
    expect(handleFocus).toHaveBeenCalledTimes(1);
    
    fireEvent.blur(input);
    expect(handleBlur).toHaveBeenCalledTimes(1);
  });

  it('passes through input props', () => {
    render(
      <Input 
        label="Test" 
        type="email" 
        placeholder="Enter email"
        value="test@example.com"
        readOnly
      />
    );
    
    const input = screen.getByLabelText('Test');
    expect(input).toHaveAttribute('type', 'email');
    expect(input).toHaveAttribute('placeholder', 'Enter email');
    expect(input).toHaveValue('test@example.com');
    expect(input).toHaveAttribute('readonly');
  });

  it('generates unique id when not provided', () => {
    render(<Input label="Test 1" />);
    render(<Input label="Test 2" />);
    
    const input1 = screen.getByLabelText('Test 1');
    const input2 = screen.getByLabelText('Test 2');
    
    expect(input1.id).not.toBe(input2.id);
    expect(input1.id).toMatch(/^input-/);
    expect(input2.id).toMatch(/^input-/);
  });

  it('uses provided id', () => {
    render(<Input label="Test" id="custom-id" />);
    
    const input = screen.getByLabelText('Test');
    expect(input.id).toBe('custom-id');
  });
});

describe('Textarea', () => {
  it('renders with label', () => {
    render(<Textarea label="Description" />);
    
    expect(screen.getByLabelText('Description')).toBeInTheDocument();
    expect(screen.getByText('Description')).toBeInTheDocument();
  });

  it('renders with required indicator', () => {
    render(<Textarea label="Required Field" required />);
    
    expect(screen.getByText('Required Field *')).toBeInTheDocument();
  });

  it('shows error message', () => {
    render(<Textarea label="Test" error="Field is too long" />);
    
    expect(screen.getByText('Field is too long')).toBeInTheDocument();
  });

  it('handles focus and blur events', () => {
    const handleFocus = vi.fn();
    const handleBlur = vi.fn();
    
    render(
      <Textarea 
        label="Test" 
        onFocus={handleFocus} 
        onBlur={handleBlur} 
      />
    );
    
    const textarea = screen.getByLabelText('Test');
    
    fireEvent.focus(textarea);
    expect(handleFocus).toHaveBeenCalledTimes(1);
    
    fireEvent.blur(textarea);
    expect(handleBlur).toHaveBeenCalledTimes(1);
  });

  it('passes through textarea props', () => {
    render(
      <Textarea 
        label="Test" 
        placeholder="Enter description"
        rows={5}
        maxLength={100}
      />
    );
    
    const textarea = screen.getByLabelText('Test');
    expect(textarea).toHaveAttribute('placeholder', 'Enter description');
    expect(textarea).toHaveAttribute('rows', '5');
    expect(textarea).toHaveAttribute('maxlength', '100');
  });
});

describe('Select', () => {
  it('renders with label and options', () => {
    render(
      <Select label="Priority">
        <option value="1">Low</option>
        <option value="2">Medium</option>
        <option value="3">High</option>
      </Select>
    );
    
    expect(screen.getByLabelText('Priority')).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'Low' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'Medium' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'High' })).toBeInTheDocument();
  });

  it('renders with required indicator', () => {
    render(
      <Select label="Required Field" required>
        <option value="1">Option 1</option>
      </Select>
    );
    
    expect(screen.getByText('Required Field *')).toBeInTheDocument();
  });

  it('shows error message', () => {
    render(
      <Select label="Test" error="Please select an option">
        <option value="">Select...</option>
      </Select>
    );
    
    expect(screen.getByText('Please select an option')).toBeInTheDocument();
  });

  it('handles focus and blur events', () => {
    const handleFocus = vi.fn();
    const handleBlur = vi.fn();
    
    render(
      <Select 
        label="Test" 
        onFocus={handleFocus} 
        onBlur={handleBlur}
      >
        <option value="1">Option 1</option>
      </Select>
    );
    
    const select = screen.getByLabelText('Test');
    
    fireEvent.focus(select);
    expect(handleFocus).toHaveBeenCalledTimes(1);
    
    fireEvent.blur(select);
    expect(handleBlur).toHaveBeenCalledTimes(1);
  });

  it('handles selection changes', () => {
    const handleChange = vi.fn();
    
    render(
      <Select label="Test" onChange={handleChange}>
        <option value="">Select...</option>
        <option value="1">Option 1</option>
        <option value="2">Option 2</option>
      </Select>
    );
    
    const select = screen.getByLabelText('Test');
    fireEvent.change(select, { target: { value: '2' } });
    
    expect(handleChange).toHaveBeenCalledTimes(1);
    expect(select).toHaveValue('2');
  });
});

describe('FormField', () => {
  it('renders as Input by default', () => {
    render(<FormField label="Default Field" />);
    
    const input = screen.getByLabelText('Default Field');
    expect(input.tagName).toBe('INPUT');
  });

  it('renders as Textarea when type is textarea', () => {
    render(<FormField type="textarea" label="Text Area" />);
    
    const textarea = screen.getByLabelText('Text Area');
    expect(textarea.tagName).toBe('TEXTAREA');
  });

  it('renders as Select when type is select', () => {
    render(
      <FormField type="select" label="Select Field">
        <option value="1">Option 1</option>
      </FormField>
    );
    
    const select = screen.getByLabelText('Select Field');
    expect(select.tagName).toBe('SELECT');
  });

  it('passes through props correctly', () => {
    render(
      <FormField 
        label="Test Field" 
        placeholder="Enter text"
        required
        error="Error message"
      />
    );
    
    expect(screen.getByLabelText('Test Field *')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Enter text')).toBeInTheDocument();
    expect(screen.getByText('Error message')).toBeInTheDocument();
  });
});
