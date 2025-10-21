import React, { useState } from 'react';
import '../../styles/MilestoneCard.scss';
import { CELEBRATION_TYPES } from '../../utils/milestones';

/**
 * MilestoneCard - Editable milestone card for Playbook Builder
 * Displays between plays as a section divider
 */
const MilestoneCard = ({
  milestone,
  onUpdate,
  onDelete,
  onDragStart,
  onDragEnd,
  onDragOver,
  onDrop,
  isDragging = false,
  isFirstItem = false,
  isLastItem = false
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [editingOutcome, setEditingOutcome] = useState('');

  const handleFieldChange = (field, value) => {
    if (onUpdate) {
      onUpdate(milestone.id, { [field]: value });
    }
  };

  const handleAddOutcome = () => {
    if (editingOutcome.trim()) {
      const updated = [...(milestone.outcomes || []), editingOutcome.trim()];
      handleFieldChange('outcomes', updated);
      setEditingOutcome('');
    }
  };

  const handleRemoveOutcome = (index) => {
    const updated = milestone.outcomes.filter((_, i) => i !== index);
    handleFieldChange('outcomes', updated);
  };

  // Show warning if milestone is in invalid position
  const showPositionWarning = isFirstItem || isLastItem;

  return (
    <div
      className={`milestone-card ${isDragging ? 'milestone-card--dragging' : ''} ${showPositionWarning ? 'milestone-card--invalid' : ''}`}
      draggable
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      onDragOver={onDragOver}
      onDrop={onDrop}
    >
      <div className="milestone-card__header">
        <div className="milestone-card__drag-handle" title="Drag to reorder">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <circle cx="4" cy="4" r="1.5" fill="currentColor" />
            <circle cx="4" cy="8" r="1.5" fill="currentColor" />
            <circle cx="4" cy="12" r="1.5" fill="currentColor" />
            <circle cx="12" cy="4" r="1.5" fill="currentColor" />
            <circle cx="12" cy="8" r="1.5" fill="currentColor" />
            <circle cx="12" cy="12" r="1.5" fill="currentColor" />
          </svg>
        </div>

        <div className="milestone-card__icon">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M12 2L3 7L12 12L21 7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/>
            <path d="M3 17L12 22L21 17" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/>
            <path d="M3 12L12 17L21 12" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/>
          </svg>
        </div>

        <input
          type="text"
          className="milestone-card__title-input"
          value={milestone.title}
          onChange={(e) => handleFieldChange('title', e.target.value)}
          placeholder="Milestone Title"
        />

        <button
          className="milestone-card__expand-btn"
          onClick={() => setIsExpanded(!isExpanded)}
          title={isExpanded ? 'Collapse' : 'Expand'}
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path
              d={isExpanded ? 'M4 10L8 6L12 10' : 'M4 6L8 10L12 6'}
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>

        <button
          className="milestone-card__delete-btn"
          onClick={onDelete}
          title="Delete milestone"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M12 4L4 12M4 4L12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </button>
      </div>

      {showPositionWarning && (
        <div className="milestone-card__warning">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M8 1L1 14H15L8 1Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
            <path d="M8 6V9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            <circle cx="8" cy="11.5" r="0.5" fill="currentColor"/>
          </svg>
          Milestones cannot be the first or last item
        </div>
      )}

      {isExpanded && (
        <div className="milestone-card__body">
          <div className="milestone-card__field">
            <label className="milestone-card__label">Summary (optional)</label>
            <textarea
              className="milestone-card__textarea"
              value={milestone.summary || ''}
              onChange={(e) => handleFieldChange('summary', e.target.value)}
              placeholder="Short description or outcome message"
              rows="2"
            />
          </div>

          <div className="milestone-card__field">
            <label className="milestone-card__label">Outcomes (optional)</label>
            <div className="milestone-card__outcomes">
              {milestone.outcomes && milestone.outcomes.length > 0 && (
                <ul className="milestone-card__outcomes-list">
                  {milestone.outcomes.map((outcome, index) => (
                    <li key={index} className="milestone-card__outcome-item">
                      <span>{outcome}</span>
                      <button
                        className="milestone-card__outcome-remove"
                        onClick={() => handleRemoveOutcome(index)}
                        title="Remove"
                      >
                        ×
                      </button>
                    </li>
                  ))}
                </ul>
              )}
              <div className="milestone-card__outcome-add">
                <input
                  type="text"
                  className="milestone-card__outcome-input"
                  value={editingOutcome}
                  onChange={(e) => setEditingOutcome(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleAddOutcome()}
                  placeholder="Add an outcome"
                />
                <button
                  className="milestone-card__outcome-add-btn"
                  onClick={handleAddOutcome}
                  disabled={!editingOutcome.trim()}
                >
                  Add
                </button>
              </div>
            </div>
          </div>

          <div className="milestone-card__field">
            <label className="milestone-card__label">Celebration</label>
            <select
              className="milestone-card__select"
              value={milestone.celebration || CELEBRATION_TYPES.NONE}
              onChange={(e) => handleFieldChange('celebration', e.target.value)}
            >
              <option value={CELEBRATION_TYPES.NONE}>None</option>
              <option value={CELEBRATION_TYPES.CONFETTI}>🎉 Confetti</option>
              <option value={CELEBRATION_TYPES.SPARKLE}>✨ Sparkle</option>
              <option value={CELEBRATION_TYPES.MAGIC_WAND}>🪄 Magic Wand</option>
            </select>
          </div>

          <div className="milestone-card__field">
            <label className="milestone-card__checkbox-label">
              <input
                type="checkbox"
                checked={milestone.acknowledgementRequired !== false}
                onChange={(e) => handleFieldChange('acknowledgementRequired', e.target.checked)}
              />
              <span>Require user to click Continue</span>
            </label>
            <div className="milestone-card__hint">
              If unchecked, the next play will begin automatically after a short delay
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MilestoneCard;

