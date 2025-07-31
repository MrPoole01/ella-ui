import React from 'react';
import './Button.scss';

/**
 * Reusable Button component with multiple variants
 * Extracted from patterns found in Login, Header, Sidebar, and other components
 */
const Button = ({
  children,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  onClick,
  type = 'button',
  className = '',
  icon,
  iconPosition = 'left',
  fullWidth = false,
  ...props
}) => {
  const buttonClasses = [
    'button',
    `button--${variant}`,
    `button--${size}`,
    {
      'button--loading': loading,
      'button--disabled': disabled,
      'button--full-width': fullWidth,
      'button--icon-only': !children && icon,
      'button--icon-right': iconPosition === 'right' && icon
    },
    className
  ]
    .filter(Boolean)
    .map(cls => typeof cls === 'object' ? Object.keys(cls).filter(key => cls[key]) : cls)
    .flat()
    .join(' ');

  const handleClick = (e) => {
    if (disabled || loading) {
      e.preventDefault();
      return;
    }
    onClick?.(e);
  };

  return (
    <button
      type={type}
      className={buttonClasses}
      onClick={handleClick}
      disabled={disabled || loading}
      {...props}
    >
      {loading && (
        <span className="button__loading-spinner">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeDasharray="31.416" strokeDashoffset="31.416">
              <animate attributeName="stroke-dasharray" dur="2s" values="0 31.416;15.708 15.708;0 31.416" repeatCount="indefinite"/>
              <animate attributeName="stroke-dashoffset" dur="2s" values="0;-15.708;-31.416" repeatCount="indefinite"/>
            </circle>
          </svg>
        </span>
      )}
      
      {icon && iconPosition === 'left' && !loading && (
        <span className="button__icon button__icon--left">
          {icon}
        </span>
      )}
      
      {children && (
        <span className="button__text">
          {children}
        </span>
      )}
      
      {icon && iconPosition === 'right' && !loading && (
        <span className="button__icon button__icon--right">
          {icon}
        </span>
      )}
    </button>
  );
};

// Convenience components for common patterns
export const PrimaryButton = (props) => <Button variant="primary" {...props} />;
export const SecondaryButton = (props) => <Button variant="secondary" {...props} />;
export const GhostButton = (props) => <Button variant="ghost" {...props} />;
export const IconButton = (props) => <Button variant="icon" {...props} />;
export const LinkButton = (props) => <Button variant="link" {...props} />;

export default Button;