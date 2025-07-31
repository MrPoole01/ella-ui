import React from 'react';
import Input from './Input';

/**
 * SearchInput component - specialized input for search functionality
 * Extracted from Header, WorkspaceDropdown, and various menu search patterns
 */
const SearchInput = ({
  placeholder = "Search...",
  onSearch,
  onClear,
  showClearButton = true,
  variant = 'search',
  ...props
}) => {
  const searchIcon = (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path 
        d="M7.25 12.25C10.1495 12.25 12.5 9.8995 12.5 7C12.5 4.1005 10.1495 1.75 7.25 1.75C4.3505 1.75 2 4.1005 2 7C2 9.8995 4.3505 12.25 7.25 12.25Z" 
        stroke="currentColor" 
        strokeWidth="1.5" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      />
      <path 
        d="M13.25 13.25L11.25 11.25" 
        stroke="currentColor" 
        strokeWidth="1.5" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      />
    </svg>
  );

  const clearIcon = showClearButton && props.value ? (
    <button
      type="button"
      className="search-input__clear"
      onClick={onClear}
      tabIndex={-1}
    >
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <path 
          d="M12 4L4 12M4 4l8 8" 
          stroke="currentColor" 
          strokeWidth="1.5" 
          strokeLinecap="round" 
          strokeLinejoin="round"
        />
      </svg>
    </button>
  ) : null;

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && onSearch) {
      onSearch(props.value);
    }
    props.onKeyPress?.(e);
  };

  return (
    <Input
      type="text"
      variant={variant}
      placeholder={placeholder}
      leftIcon={searchIcon}
      rightIcon={clearIcon}
      onKeyPress={handleKeyPress}
      {...props}
    />
  );
};

export default SearchInput;