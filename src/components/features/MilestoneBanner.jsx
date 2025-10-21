import React, { useEffect, useState } from 'react';
import '../../styles/MilestoneBanner.scss';

/**
 * MilestoneBanner - Displays milestone completion screen between playbook sections
 * Shows title, summary, outcomes, and optional celebration animations
 */
const MilestoneBanner = ({
  milestone,
  onContinue,
  onAcknowledge,
  autoAdvanceDelay = 3000 // milliseconds before auto-advance if acknowledgement not required
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);

  useEffect(() => {
    // Fade in animation
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    // Trigger celebration animation
    if (milestone.celebration && milestone.celebration !== 'none') {
      setShowCelebration(true);
      const timer = setTimeout(() => setShowCelebration(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [milestone.celebration]);

  useEffect(() => {
    // Auto-advance if acknowledgement not required
    if (!milestone.acknowledgementRequired) {
      const timer = setTimeout(() => {
        if (onContinue) onContinue();
      }, autoAdvanceDelay);
      return () => clearTimeout(timer);
    }
  }, [milestone.acknowledgementRequired, autoAdvanceDelay, onContinue]);

  const handleContinue = () => {
    if (onAcknowledge) onAcknowledge(milestone.id);
    if (onContinue) onContinue();
  };

  const renderCelebration = () => {
    if (!showCelebration) return null;

    switch (milestone.celebration) {
      case 'confetti':
        return <ConfettiAnimation />;
      case 'sparkle':
        return <SparkleAnimation />;
      case 'magic_wand':
        return <MagicWandAnimation />;
      default:
        return null;
    }
  };

  return (
    <div className={`milestone-banner ${isVisible ? 'milestone-banner--visible' : ''}`}>
      {renderCelebration()}
      
      <div className="milestone-banner__content">
        <div className="milestone-banner__icon">
          <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
            <circle cx="32" cy="32" r="30" stroke="currentColor" strokeWidth="2" fill="none" opacity="0.2"/>
            <path d="M20 32L28 40L44 24" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>

        <h2 className="milestone-banner__title">{milestone.title}</h2>

        {milestone.summary && (
          <p className="milestone-banner__summary">{milestone.summary}</p>
        )}

        {milestone.outcomes && milestone.outcomes.length > 0 && (
          <div className="milestone-banner__outcomes">
            <h3 className="milestone-banner__outcomes-title">What you've accomplished:</h3>
            <ul className="milestone-banner__outcomes-list">
              {milestone.outcomes.map((outcome, index) => (
                <li key={index} className="milestone-banner__outcome-item">
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <circle cx="10" cy="10" r="9" fill="var(--theme-success-bg)" />
                    <path d="M6 10L9 13L14 7" stroke="var(--theme-success-text)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <span>{outcome}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {milestone.acknowledgementRequired && (
          <button
            className="milestone-banner__continue-btn"
            onClick={handleContinue}
          >
            Continue
          </button>
        )}

        {!milestone.acknowledgementRequired && (
          <div className="milestone-banner__auto-advance">
            Continuing automatically...
          </div>
        )}
      </div>
    </div>
  );
};

// Celebration animations
const ConfettiAnimation = () => {
  const confettiPieces = Array.from({ length: 50 }, (_, i) => ({
    id: i,
    left: `${Math.random() * 100}%`,
    animationDelay: `${Math.random() * 2}s`,
    backgroundColor: ['#ff6b6b', '#4ecdc4', '#45b7d1', '#f9ca24', '#6c5ce7'][Math.floor(Math.random() * 5)]
  }));

  return (
    <div className="milestone-banner__confetti">
      {confettiPieces.map(piece => (
        <div
          key={piece.id}
          className="milestone-banner__confetti-piece"
          style={{
            left: piece.left,
            animationDelay: piece.animationDelay,
            backgroundColor: piece.backgroundColor
          }}
        />
      ))}
    </div>
  );
};

const SparkleAnimation = () => {
  const sparkles = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    top: `${Math.random() * 100}%`,
    left: `${Math.random() * 100}%`,
    animationDelay: `${Math.random() * 2}s`
  }));

  return (
    <div className="milestone-banner__sparkles">
      {sparkles.map(sparkle => (
        <div
          key={sparkle.id}
          className="milestone-banner__sparkle"
          style={{
            top: sparkle.top,
            left: sparkle.left,
            animationDelay: sparkle.animationDelay
          }}
        >
          ✨
        </div>
      ))}
    </div>
  );
};

const MagicWandAnimation = () => {
  return (
    <div className="milestone-banner__magic-wand">
      <div className="milestone-banner__wand">
        🪄
      </div>
      <div className="milestone-banner__magic-trail" />
    </div>
  );
};

export default MilestoneBanner;

