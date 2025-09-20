import React from 'react';
import { calculateEllaProgress } from '../../utils/ellaProgress';

const EllaProgressRing = ({ coreCompleted = 0, secondaryCompleted = 0 }) => {
  const { percent, isCoreComplete, isAllComplete, coreTotal, secondaryTotal } = calculateEllaProgress(coreCompleted, secondaryCompleted);

  const ringColor = isCoreComplete ? '#22C55E' : '#FFC700'; // green at 90% else brand yellow
  const tooltip = `${coreCompleted} of ${coreTotal} Core Ella-ments complete\n${secondaryCompleted} of ${secondaryTotal} Secondary Ella-ments complete`;

  return (
    <div className="ella-progress" title={tooltip} aria-label={tooltip} role="progressbar" aria-valuenow={percent}>
      <div className="ella-progress-ring" style={{ ['--CircularProgress-percent']: percent + '%', color: ringColor }}>
        <svg className="ella-progress-svg" viewBox="22 22 44 44">
          <circle className="ella-progress-track" cx="44" cy="44" r="20.2" fill="none" strokeWidth="3.6" />
          <circle className="ella-progress-bar" cx="44" cy="44" r="20.2" fill="none" strokeWidth="3.6" strokeLinecap="round"
            style={{ strokeDasharray: `${percent} 100` }}
          />
        </svg>
        <div className="ella-progress-label">{percent}%</div>
      </div>
      <div className="ella-progress-actions">
        <button className="admin-btn admin-btn--primary" disabled={!isCoreComplete} title={!isCoreComplete ? 'Complete all 9 Core Ella-ments to unlock' : 'Submit to Ella Team'}>
          {isAllComplete ? 'Submitted' : 'Submit to Ella Team'}
        </button>
      </div>
    </div>
  );
};

export default EllaProgressRing;


