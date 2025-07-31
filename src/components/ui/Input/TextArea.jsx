import React, { useState, forwardRef } from 'react';
import './Input.scss';

/**
 * TextArea component - for multi-line text input
 * Extracted from ChatInterface and other form patterns
 */
const TextArea = forwardRef(({
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
  rows = 3,
  autoResize = false,
  maxRows = 10,
  className = '',
  containerClassName = '',
  autoFocus = false,
  ...props
}, ref) => {
  const [isFocused, setIsFocused] = useState(false);

  const textareaClasses = [
    'textarea',
    `textarea--${variant}`,
    `textarea--${size}`,
    {
      'textarea--focused': isFocused,
      'textarea--error': error,
      'textarea--disabled': disabled,
      'textarea--auto-resize': autoResize
    },
    className
  ]
    .filter(Boolean)
    .map(cls => typeof cls === 'object' ? Object.keys(cls).filter(key => cls[key]) : cls)
    .flat()
    .join(' ');

  const containerClasses = [
    'textarea-container',
    `textarea-container--${variant}`,
    {
      'textarea-container--focused': isFocused,
      'textarea-container--error': error,
      'textarea-container--disabled': disabled
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

  const handleChange = (e) => {
    if (autoResize) {
      const textarea = e.target;
      textarea.style.height = 'auto';
      const scrollHeight = textarea.scrollHeight;
      const maxHeight = maxRows * 24; // Approximate line height
      textarea.style.height = Math.min(scrollHeight, maxHeight) + 'px';
    }
    onChange?.(e);
  };

  return (
    <div className={containerClasses}>
      {label && (
        <label className="textarea-label">
          {label}
          {required && <span className="textarea-label__required">*</span>}
        </label>
      )}
      
      <div className="textarea-wrapper">
        <textarea
          ref={ref}
          value={value}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholder={placeholder}
          disabled={disabled}
          required={required}
          rows={rows}
          className={textareaClasses}
          autoFocus={autoFocus}
          {...props}
        />
      </div>
      
      {error && (
        <div className="textarea-error">
          {error}
        </div>
      )}
      
      {helpText && !error && (
        <div className="textarea-help">
          {helpText}
        </div>
      )}
    </div>
  );
});

TextArea.displayName = 'TextArea';

export default TextArea;