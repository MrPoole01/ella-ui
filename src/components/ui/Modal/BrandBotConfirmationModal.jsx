import React from 'react';
import { createPortal } from 'react-dom';
import './BrandBotConfirmationModal.scss';

const BrandBotConfirmationModal = ({
  isOpen,
  onClose,
  onConfirm,
  selectedBrandBot
}) => {
  if (!isOpen || !selectedBrandBot) return null;

  const handleConfirm = () => {
    onConfirm(selectedBrandBot);
    onClose();
  };

  return createPortal(
    <>
      <div className="brandbot-confirm__backdrop" onClick={onClose} />
      <div className="brandbot-confirm">
        <div className="brandbot-confirm__header">
          <h2 className="brandbot-confirm__title">Confirm Brand Bot Selection</h2>
          <button className="brandbot-confirm__close" onClick={onClose}>×</button>
        </div>

        <div className="brandbot-confirm__content">
          <div className="brandbot-confirm__message">
            <div className="brandbot-confirm__icon">
              <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
                <circle cx="24" cy="24" r="24" fill="var(--theme-interactive-primary)" fillOpacity="0.1"/>
                <path d="M24 16v8m0 4h.01" stroke="var(--theme-interactive-primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <p>
              Are you sure you want to switch to <strong>"{selectedBrandBot.name}"</strong>?
            </p>
            <p className="brandbot-confirm__description">
              This will change the Brand Bot context for your current session and may affect the available Ellaments and content generation.
            </p>
          </div>
        </div>

        <div className="brandbot-confirm__footer">
          <button className="brandbot-confirm__cancel" onClick={onClose}>
            Cancel
          </button>
          <button className="brandbot-confirm__confirm" onClick={handleConfirm}>
            Confirm Selection
          </button>
        </div>
      </div>
    </>,
    document.body
  );
};

export default BrandBotConfirmationModal;
