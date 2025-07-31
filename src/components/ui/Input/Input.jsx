import React, { useState, forwardRef } from 'react';
import './Input.scss';

/**
 * Reusable Input component with multiple variants
 * Extracted from patterns found in Login, Header, WorkspaceDropdown, and other components
 */
const Input = forwardRef(({
  type = 'text',
  variant = 'default',
  size = 'medium',
  label,
  placeholder,
  value,
  onChange,
  onFocus,
  onBlur,
  disabled = false,
  required = false,
  error,
  helpText,
  leftIcon,
  rightIcon,
  onRightIconClick,
  className = '',
  containerClassName = '',
  autoFocus = false,
  ...props
}, ref) => {
  const [isFocused, setIsFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const inputClasses = [
    'input',
    `input--${variant}`,
    `input--${size}`,
    {
      'input--focused': isFocused,
      'input--error': error,
      'input--disabled': disabled,
      'input--has-left-icon': leftIcon,
      'input--has-right-icon': rightIcon,
      'input--password': type === 'password'
    },
    className
  ]
    .filter(Boolean)
    .map(cls => typeof cls === 'object' ? Object.keys(cls).filter(key => cls[key]) : cls)
    .flat()
    .join(' ');

  const containerClasses = [
    'input-container',
    `input-container--${variant}`,
    {
      'input-container--focused': isFocused,
      'input-container--error': error,
      'input-container--disabled': disabled
    },
    containerClassName
  ]
    .filter(Boolean)
    .map(cls => typeof cls === 'object' ? Object.keys(cls).filter(key => cls[key]) : cls)
    .flat()
    .join(' ');

  const handleFocus = (e) => {
    setIsFocused(true);
    onFocus?.(e);
  };

  const handleBlur = (e) => {
    setIsFocused(false);
    onBlur?.(e);
  };

  const handlePasswordToggle = () => {
    setShowPassword(!showPassword);
  };

  const handleRightIconClick = (e) => {
    if (type === 'password') {
      handlePasswordToggle();
    } else {
      onRightIconClick?.(e);
    }
  };

  // Auto-add password toggle icon for password inputs
  const finalRightIcon = type === 'password' ? (
    <button
      type="button"
      className="input__password-toggle"
      onClick={handlePasswordToggle}
      tabIndex={-1}
    >
      {showPassword ? (
        // Eye slash icon (hide password)
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <path
            d="M10.94 6.08C11.29 6.03 11.64 6 12 6C16.41 6 20 9.69 20 12C20 12.24 19.97 12.47 19.93 12.69"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M9.47 14.53C10.25 15.31 11.1 15.7 12 15.7C14.76 15.7 17 13.31 17 12C17 11.64 16.93 11.29 16.82 10.97"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M3 3L21 21"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M4.22 4.22C2.86 5.69 2 8.69 2 12C2 17.52 6.48 22 12 22C15.31 22 18.31 20.14 19.78 18.78"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ) : (
        // Eye icon (show password)
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <path
            d="M1 12S5 4 12 4s11 8 11 8-4 8-11 8S1 12 1 12z"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <circle
            cx="12"
            cy="12"
            r="3"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      )}
    </button>
  ) : rightIcon;

  const inputType = type === 'password' ? (showPassword ? 'text' : 'password') : type;

  return (
    <div className={containerClasses}>
      {label && (
        <label className="input-label">
          {label}
          {required && <span className="input-label__required">*</span>}
        </label>
      )}
      
      <div className="input-wrapper">
        {leftIcon && (
          <div className="input__icon input__icon--left">
            {leftIcon}
          </div>
        )}
        
        <input
          ref={ref}
          type={inputType}
          value={value}
          onChange={onChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholder={placeholder}
          disabled={disabled}
          required={required}
          className={inputClasses}
          autoFocus={autoFocus}
          {...props}
        />
        
        {finalRightIcon && (
          <div 
            className="input__icon input__icon--right"
            onClick={onRightIconClick || (type === 'password' ? handleRightIconClick : undefined)}
            style={{ cursor: onRightIconClick || type === 'password' ? 'pointer' : 'default' }}
          >
            {finalRightIcon}
          </div>
        )}
      </div>
      
      {error && (
        <div className="input-error">
          {error}
        </div>
      )}
      
      {helpText && !error && (
        <div className="input-help">
          {helpText}
        </div>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;