import React, { useState, useEffect } from 'react';
import { BrandBotConfirmationModal } from '../ui/Modal';
import './BrandBotSelector.scss';

// Mock Brand Bot data - in a real app this would come from props or API
const mockBrandBots = [
  { id: 1, name: 'Primary Brand Bot', isActive: true },
  { id: 2, name: 'Marketing Bot', isActive: false },
  { id: 3, name: 'Sales Bot', isActive: false },
  { id: 4, name: 'Support Bot', isActive: false },
  { id: 5, name: 'Product Bot', isActive: false }
];

const BrandBotSelector = ({ 
  brandBots = mockBrandBots, 
  selectedBrandBotId, 
  onBrandBotChange,
  className = '' 
}) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [confirmationModal, setConfirmationModal] = useState({ isOpen: false, brandBot: null });

  // Find the currently selected brand bot
  const selectedBrandBot = brandBots.find(bot => 
    selectedBrandBotId ? bot.id === selectedBrandBotId : bot.isActive
  ) || brandBots[0];

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showDropdown && !event.target.closest('.brandbot-selector')) {
        setShowDropdown(false);
      }
    };

    if (showDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [showDropdown]);

  const handleBrandBotSelect = (brandBot) => {
    setShowDropdown(false);
    
    // Don't show confirmation if selecting the same brand bot
    if (brandBot.id === selectedBrandBot.id) {
      return;
    }
    
    // Show confirmation modal
    setConfirmationModal({ isOpen: true, brandBot });
  };

  const handleConfirmSelection = (brandBot) => {
    if (onBrandBotChange) {
      onBrandBotChange(brandBot.id, brandBot);
    }
    setConfirmationModal({ isOpen: false, brandBot: null });
  };

  const handleCloseConfirmation = () => {
    setConfirmationModal({ isOpen: false, brandBot: null });
  };

  return (
    <>
      <div className={`brandbot-selector ${className}`}>
        <button 
          className="brandbot-selector__button"
          onClick={() => setShowDropdown(!showDropdown)}
          aria-expanded={showDropdown}
          aria-haspopup="listbox"
        >
          <span className="brandbot-selector__current">
            {selectedBrandBot.name}
          </span>
          <svg 
            className={`brandbot-selector__arrow ${showDropdown ? 'brandbot-selector__arrow--open' : ''}`}
            width="20" 
            height="20" 
            viewBox="0 0 20 20" 
            fill="none"
          >
            <path d="M5 7.5L10 12.5L15 7.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>

        {/* Dropdown Panel */}
        {showDropdown && (
          <div className="brandbot-selector__dropdown">
            <div className="brandbot-selector__dropdown-header">
              Select Brand Bot
            </div>
            {brandBots.map((brandBot) => (
              <div 
                key={brandBot.id}
                className={`brandbot-selector__item ${brandBot.id === selectedBrandBot.id ? 'brandbot-selector__item--active' : ''}`}
                onClick={() => handleBrandBotSelect(brandBot)}
                role="option"
                aria-selected={brandBot.id === selectedBrandBot.id}
              >
                <div className="brandbot-selector__item-info">
                  <div className="brandbot-selector__item-name">
                    {brandBot.name}
                  </div>
                  {brandBot.id === selectedBrandBot.id && (
                    <div className="brandbot-selector__item-status">
                      Current
                    </div>
                  )}
                </div>
                {brandBot.id === selectedBrandBot.id && (
                  <div className="brandbot-selector__item-indicator">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path d="M13 4L6 11L3 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Confirmation Modal */}
      <BrandBotConfirmationModal
        isOpen={confirmationModal.isOpen}
        onClose={handleCloseConfirmation}
        onConfirm={handleConfirmSelection}
        selectedBrandBot={confirmationModal.brandBot}
      />
    </>
  );
};

export default BrandBotSelector;
