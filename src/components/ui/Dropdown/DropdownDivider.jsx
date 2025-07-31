import React from 'react';
import './Dropdown.scss';

/**
 * DropdownDivider component for separating dropdown sections
 */
const DropdownDivider = ({ className = '' }) => {
  return (
    <div className={`dropdown-divider ${className}`}>
      <hr />
    </div>
  );
};

export default DropdownDivider;