import React from 'react';
import './Card.scss';

/**
 * CardFooter component for card footers with actions, metadata, etc.
 */
const CardFooter = ({
  children,
  actions,
  meta,
  className = '',
  ...props
}) => {
  const footerClasses = [
    'card-footer',
    className
  ].filter(Boolean).join(' ');

  return (
    <div className={footerClasses} {...props}>
      <div className="card-footer__content">
        {meta && (
          <div className="card-footer__meta">
            {meta}
          </div>
        )}
        {children}
      </div>
      
      {actions && (
        <div className="card-footer__actions">
          {actions}
        </div>
      )}
    </div>
  );
};

export default CardFooter;