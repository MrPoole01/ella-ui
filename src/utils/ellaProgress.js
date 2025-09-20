// Utility to calculate Ella-ment completion percentage

export const ELLA_CORE_TOTAL = 9;
export const ELLA_SECONDARY_TOTAL = 13;

export function calculateEllaProgress(coreCompleted, secondaryCompleted) {
  const core = Math.max(0, Math.min(ELLA_CORE_TOTAL, Number(coreCompleted || 0)));
  const secondary = Math.max(0, Math.min(ELLA_SECONDARY_TOTAL, Number(secondaryCompleted || 0)));

  // 9 Core Ella-ments = 90% (10% each)
  const corePct = (core / ELLA_CORE_TOTAL) * 90; // each core ~10%

  // 13 Secondary Ella-ments together = 10%
  const secondaryPct = (secondary / ELLA_SECONDARY_TOTAL) * 10; // each secondary ~0.7692%

  const percent = Math.min(100, Math.round((corePct + secondaryPct) * 10) / 10); // 0.1 precision
  const isCoreComplete = core === ELLA_CORE_TOTAL;
  const isAllComplete = isCoreComplete && secondary === ELLA_SECONDARY_TOTAL;

  return {
    percent,
    isCoreComplete,
    isAllComplete,
    coreCompleted: core,
    secondaryCompleted: secondary,
    coreTotal: ELLA_CORE_TOTAL,
    secondaryTotal: ELLA_SECONDARY_TOTAL,
  };
}


