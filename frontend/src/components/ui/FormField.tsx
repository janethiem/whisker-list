import type { InputHTMLAttributes, TextareaHTMLAttributes, SelectHTMLAttributes, ReactNode } from 'react';

// Base theme colors matching your app's design
const THEME = {
  colors: {
    border: '#d4b8a3',
    borderFocus: '#c4a484',
    text: '#3a3a3a',
    label: '#6b6b6b',
    background: '#ffffff'
  }
};

// Common input props
interface BaseFieldProps {
  label?: string;
  error?: string;
  required?: boolean;
  className?: string;
}

// Input component
interface InputProps extends BaseFieldProps, Omit<InputHTMLAttributes<HTMLInputElement>, 'className'> {}

export const Input = ({ 
  label, 
  error, 
  required, 
  className = '', 
  id,
  ...props 
}: InputProps) => {
  const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;

  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    e.target.style.borderColor = THEME.colors.borderFocus;
    e.target.style.boxShadow = `0 0 0 1px ${THEME.colors.borderFocus}`;
    props.onFocus?.(e);
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    e.target.style.borderColor = THEME.colors.border;
    e.target.style.boxShadow = 'none';
    props.onBlur?.(e);
  };

  return (
    <div className={`space-y-2 ${className}`}>
      {label && (
        <label 
          htmlFor={inputId} 
          className="block text-sm font-medium"
          style={{ color: THEME.colors.label }}
        >
          {label} {required && '*'}
        </label>
      )}
      <input
        id={inputId}
        className="w-full px-3 py-2 border rounded focus:ring-1 outline-none"
        style={{
          borderColor: THEME.colors.border,
          color: THEME.colors.text,
          backgroundColor: THEME.colors.background
        }}
        onFocus={handleFocus}
        onBlur={handleBlur}
        {...props}
      />
      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}
    </div>
  );
};

// Textarea component
interface TextareaProps extends BaseFieldProps, Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, 'className'> {}

export const Textarea = ({ 
  label, 
  error, 
  required, 
  className = '', 
  id,
  ...props 
}: TextareaProps) => {
  const textareaId = id || `textarea-${Math.random().toString(36).substr(2, 9)}`;

  const handleFocus = (e: React.FocusEvent<HTMLTextAreaElement>) => {
    e.target.style.borderColor = THEME.colors.borderFocus;
    e.target.style.boxShadow = `0 0 0 1px ${THEME.colors.borderFocus}`;
    props.onFocus?.(e);
  };

  const handleBlur = (e: React.FocusEvent<HTMLTextAreaElement>) => {
    e.target.style.borderColor = THEME.colors.border;
    e.target.style.boxShadow = 'none';
    props.onBlur?.(e);
  };

  return (
    <div className={`space-y-2 ${className}`}>
      {label && (
        <label 
          htmlFor={textareaId} 
          className="block text-sm font-medium"
          style={{ color: THEME.colors.label }}
        >
          {label} {required && '*'}
        </label>
      )}
      <textarea
        id={textareaId}
        className="w-full px-3 py-2 border rounded focus:ring-1 outline-none resize-none"
        style={{
          borderColor: THEME.colors.border,
          color: THEME.colors.text,
          backgroundColor: THEME.colors.background
        }}
        onFocus={handleFocus}
        onBlur={handleBlur}
        {...props}
      />
      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}
    </div>
  );
};

// Select component
interface SelectProps extends BaseFieldProps, Omit<SelectHTMLAttributes<HTMLSelectElement>, 'className'> {
  children: ReactNode;
}

export const Select = ({ 
  label, 
  error, 
  required, 
  className = '', 
  id,
  children,
  ...props 
}: SelectProps) => {
  const selectId = id || `select-${Math.random().toString(36).substr(2, 9)}`;

  const handleFocus = (e: React.FocusEvent<HTMLSelectElement>) => {
    e.target.style.borderColor = THEME.colors.borderFocus;
    e.target.style.boxShadow = `0 0 0 1px ${THEME.colors.borderFocus}`;
    props.onFocus?.(e);
  };

  const handleBlur = (e: React.FocusEvent<HTMLSelectElement>) => {
    e.target.style.borderColor = THEME.colors.border;
    e.target.style.boxShadow = 'none';
    props.onBlur?.(e);
  };

  return (
    <div className={`space-y-2 ${className}`}>
      {label && (
        <label 
          htmlFor={selectId} 
          className="block text-sm font-medium"
          style={{ color: THEME.colors.label }}
        >
          {label} {required && '*'}
        </label>
      )}
      <select
        id={selectId}
        className="w-full px-3 py-2 border rounded focus:ring-1 outline-none"
        style={{
          borderColor: THEME.colors.border,
          color: THEME.colors.text,
          backgroundColor: THEME.colors.background
        }}
        onFocus={handleFocus}
        onBlur={handleBlur}
        {...props}
      >
        {children}
      </select>
      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}
    </div>
  );
};

// Compound FormField component
interface FormFieldProps extends BaseFieldProps {
  type?: 'input' | 'textarea' | 'select';
  children?: ReactNode;
  [key: string]: any; // Allow passing through any other props
}

const FormField = ({ 
  type = 'input', 
  children,
  ...props 
}: FormFieldProps) => {
  switch (type) {
    case 'textarea':
      return <Textarea {...props} />;
    case 'select':
      return <Select {...props}>{children}</Select>;
    case 'input':
    default:
      return <Input {...props} />;
  }
};

export default FormField;
