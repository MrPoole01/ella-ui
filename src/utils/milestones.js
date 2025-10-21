// Milestone utilities for Playbooks
// Milestones act as section dividers between plays

export const CELEBRATION_TYPES = {
  NONE: 'none',
  CONFETTI: 'confetti',
  SPARKLE: 'sparkle',
  MAGIC_WAND: 'magic_wand'
};

/**
 * Create a new milestone object
 */
export const createMilestone = (overrides = {}) => ({
  id: `milestone-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
  type: 'milestone',
  title: overrides.title || 'New Milestone',
  summary: overrides.summary || '',
  outcomes: overrides.outcomes || [], // Array of strings
  celebration: overrides.celebration || CELEBRATION_TYPES.NONE,
  acknowledgementRequired: overrides.acknowledgementRequired !== undefined ? overrides.acknowledgementRequired : true,
  createdAt: new Date().toISOString(),
  ...overrides
});

/**
 * Validate milestone placement in timeline
 * Milestones cannot be first or last item
 */
export const canInsertMilestone = (timeline, insertIndex) => {
  if (insertIndex <= 0) return false; // Cannot be first
  if (insertIndex >= timeline.length) return false; // Cannot be last
  return true;
};

/**
 * Insert milestone at specified index
 */
export const insertMilestone = (timeline, milestone, insertIndex) => {
  if (!canInsertMilestone(timeline, insertIndex)) {
    console.warn('Cannot insert milestone at index', insertIndex);
    return timeline;
  }
  const updated = [...timeline];
  updated.splice(insertIndex, 0, milestone);
  return updated;
};

/**
 * Remove milestone from timeline
 */
export const removeMilestone = (timeline, milestoneId) => {
  return timeline.filter(item => !(item.type === 'milestone' && item.id === milestoneId));
};

/**
 * Update milestone in timeline
 */
export const updateMilestone = (timeline, milestoneId, updates) => {
  return timeline.map(item => {
    if (item.type === 'milestone' && item.id === milestoneId) {
      return { ...item, ...updates };
    }
    return item;
  });
};

/**
 * Get all milestones from timeline
 */
export const getMilestones = (timeline) => {
  return timeline.filter(item => item.type === 'milestone');
};

/**
 * Get milestone sections (groups of plays between milestones)
 */
export const getMilestoneSections = (timeline) => {
  const sections = [];
  let currentSection = { plays: [], milestone: null };

  timeline.forEach(item => {
    if (item.type === 'milestone') {
      if (currentSection.plays.length > 0) {
        sections.push(currentSection);
      }
      currentSection = { plays: [], milestone: item };
    } else {
      currentSection.plays.push(item);
    }
  });

  // Add final section if it has plays
  if (currentSection.plays.length > 0) {
    sections.push(currentSection);
  }

  return sections;
};

/**
 * Check if user has acknowledged a milestone
 */
export const isMilestoneAcknowledged = (milestoneId, userProgress = {}) => {
  return userProgress.acknowledgedMilestones?.includes(milestoneId) || false;
};

/**
 * Mark milestone as acknowledged
 */
export const acknowledgeMilestone = (milestoneId, userProgress = {}) => {
  const acknowledged = userProgress.acknowledgedMilestones || [];
  if (!acknowledged.includes(milestoneId)) {
    return {
      ...userProgress,
      acknowledgedMilestones: [...acknowledged, milestoneId]
    };
  }
  return userProgress;
};

/**
 * Get next item after milestone
 */
export const getNextAfterMilestone = (timeline, milestoneId) => {
  const index = timeline.findIndex(item => item.type === 'milestone' && item.id === milestoneId);
  if (index >= 0 && index < timeline.length - 1) {
    return timeline[index + 1];
  }
  return null;
};

/**
 * Validate timeline order (milestones cannot be first or last)
 */
export const validateTimeline = (timeline) => {
  if (timeline.length === 0) return { valid: true };
  
  if (timeline[0].type === 'milestone') {
    return { valid: false, error: 'Milestone cannot be the first item' };
  }
  
  if (timeline[timeline.length - 1].type === 'milestone') {
    return { valid: false, error: 'Milestone cannot be the last item' };
  }
  
  return { valid: true };
};

/**
 * Calculate progress including milestone sections
 */
export const calculateProgressWithMilestones = (timeline, completedItemIds = []) => {
  const totalPlays = timeline.filter(item => item.type !== 'milestone').length;
  const completedPlays = completedItemIds.filter(id => {
    const item = timeline.find(i => i.id === id);
    return item && item.type !== 'milestone';
  }).length;
  
  const sections = getMilestoneSections(timeline);
  const completedSections = sections.filter(section => {
    return section.plays.every(play => completedItemIds.includes(play.id));
  }).length;
  
  return {
    totalPlays,
    completedPlays,
    percentComplete: totalPlays > 0 ? (completedPlays / totalPlays) * 100 : 0,
    totalSections: sections.length,
    completedSections
  };
};

