import React from 'react';
import './Card.scss';

/**
 * CardBody component for main card content
 */
const CardBody = ({
  children,
  className = '',
  ...props
}) => {
  const bodyClasses = [
    'card-body',
    className
  ].filter(Boolean).join(' ');

  return (
    <div className={bodyClasses} {...props}>
      {children}
    </div>
  );
};

export default CardBody;