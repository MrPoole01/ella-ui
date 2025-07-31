import React from 'react';
import Dropdown from './Dropdown';
import './Dropdown.scss';

/**
 * ContextMenu component - specialized dropdown for context menus (ellipsis menus)
 * Extracted from various ellipsis menu patterns in Sidebar and other components
 */
const ContextMenu = ({
  children,
  trigger,
  placement = 'bottom-end',
  ...props
}) => {
  const defaultTrigger = trigger || (
    <button className="context-menu__trigger" aria-label="More options">
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <circle cx="8" cy="3" r="1.5" fill="currentColor"/>
        <circle cx="8" cy="8" r="1.5" fill="currentColor"/>
        <circle cx="8" cy="13" r="1.5" fill="currentColor"/>
      </svg>
    </button>
  );

  return (
    <Dropdown
      trigger={defaultTrigger}
      placement={placement}
      className="context-menu"
      contentClassName="context-menu__content"
      {...props}
    >
      {children}
    </Dropdown>
  );
};

export default ContextMenu;