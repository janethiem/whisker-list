import type { ButtonHTMLAttributes, ReactNode } from 'react';
import Icon from './Icon';

// Import the icon types from Icon component
type IconName = Parameters<typeof Icon>[0]['name'];

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  icon?: IconName;
  iconSize?: number;
  children: ReactNode;
}

const Button = ({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  icon,
  iconSize,
  children,
  className = '',
  disabled,
  style,
  onMouseEnter,
  onMouseLeave,
  ...props
}: ButtonProps) => {
  // Base styles
  const baseStyles = 'inline-flex items-center justify-center gap-2 font-medium rounded transition-colors focus:outline-none focus:ring-2 focus:ring-offset-1 disabled:cursor-not-allowed';
  
  // Size styles
  const sizeStyles = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg'
  };

  // Variant styles with theme colors
  const variantStyles = {
    primary: {
      base: {
        backgroundColor: '#c4a484',
        color: '#ffffff',
        border: 'none'
      },
      hover: '#b8956e',
      focus: '#c4a484'
    },
    secondary: {
      base: {
        backgroundColor: '#f0ebe5',
        color: '#6b6b6b',
        border: '1px solid #d4b8a3'
      },
      hover: '#e8e3df',
      focus: '#d4b8a3'
    },
    danger: {
      base: {
        backgroundColor: '#ef4444',
        color: '#ffffff',
        border: 'none'
      },
      hover: '#dc2626',
      focus: '#ef4444'
    },
    ghost: {
      base: {
        backgroundColor: 'transparent',
        color: '#6b6b6b',
        border: '1px solid #d4b8a3'
      },
      hover: '#f5f0ea',
      focus: '#d4b8a3'
    }
  };

  const currentVariant = variantStyles[variant];
  const isDisabled = disabled || isLoading;

  // Determine icon size based on button size if not specified
  const getIconSize = () => {
    if (iconSize) return iconSize;
    switch (size) {
      case 'sm': return 16;
      case 'md': return 20;
      case 'lg': return 24;
      default: return 20;
    }
  };

  const handleMouseEnter = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!isDisabled) {
      const element = e.target as HTMLButtonElement;
      element.style.backgroundColor = currentVariant.hover;
    }
    onMouseEnter?.(e);
  };

  const handleMouseLeave = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!isDisabled) {
      const element = e.target as HTMLButtonElement;
      element.style.backgroundColor = currentVariant.base.backgroundColor;
    }
    onMouseLeave?.(e);
  };

  const buttonStyle = {
    ...currentVariant.base,
    ...(isDisabled && {
      opacity: isLoading ? 0.7 : 0.5,
      backgroundColor: currentVariant.base.backgroundColor
    }),
    ...style
  };

  return (
    <button
      className={`${baseStyles} ${sizeStyles[size]} ${className}`}
      style={buttonStyle}
      disabled={isDisabled}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      {...props}
    >
      {isLoading && (
        <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
      )}
      {icon && !isLoading && (
        <Icon name={icon} size={getIconSize()} />
      )}
      {children}
    </button>
  );
};

export default Button;
