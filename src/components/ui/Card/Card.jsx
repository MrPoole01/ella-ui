import React from 'react';
import './Card.scss';

/**
 * Reusable Card component
 * Extracted from ChatItem, TemplateDrawer cards, and various project/document cards
 */
const Card = ({
  children,
  variant = 'default',
  size = 'medium',
  padding = 'default',
  hover = false,
  clickable = false,
  onClick,
  className = '',
  ...props
}) => {
  const cardClasses = [
    'card',
    `card--${variant}`,
    `card--${size}`,
    `card--padding-${padding}`,
    {
      'card--hover': hover,
      'card--clickable': clickable || onClick
    },
    className
  ]
    .filter(Boolean)
    .map(cls => typeof cls === 'object' ? Object.keys(cls).filter(key => cls[key]) : cls)
    .flat()
    .join(' ');

  const handleClick = (e) => {
    if (onClick) {
      onClick(e);
    }
  };

  const handleKeyDown = (e) => {
    if ((e.key === 'Enter' || e.key === ' ') && onClick) {
      e.preventDefault();
      onClick(e);
    }
  };

  return (
    <div
      className={cardClasses}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      tabIndex={onClick ? 0 : undefined}
      role={onClick ? 'button' : undefined}
      {...props}
    >
      {children}
    </div>
  );
};

export default Card;