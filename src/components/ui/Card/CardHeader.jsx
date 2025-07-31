import React from 'react';
import './Card.scss';

/**
 * CardHeader component for card headers with title, subtitle, and actions
 */
const CardHeader = ({
  title,
  subtitle,
  actions,
  icon,
  className = '',
  children,
  ...props
}) => {
  const headerClasses = [
    'card-header',
    className
  ].filter(Boolean).join(' ');

  return (
    <div className={headerClasses} {...props}>
      {icon && (
        <div className="card-header__icon">
          {icon}
        </div>
      )}
      
      <div className="card-header__content">
        {title && (
          <div className="card-header__title">
            {title}
          </div>
        )}
        {subtitle && (
          <div className="card-header__subtitle">
            {subtitle}
          </div>
        )}
        {children}
      </div>
      
      {actions && (
        <div className="card-header__actions">
          {actions}
        </div>
      )}
    </div>
  );
};

export default CardHeader;