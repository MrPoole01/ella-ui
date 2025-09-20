import React, { useEffect, useMemo, useState } from 'react';
import '../ui/Modal/CreateDrawer.scss';

const PlaybookRunnerDrawer = ({ isOpen, onClose, playbook, mode = 'step_by_step' }) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [stepInputs, setStepInputs] = useState({});
  const [outputs, setOutputs] = useState([]); // { stepIndex, content }
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    // Restore from localStorage if exists
    try {
      const saved = JSON.parse(localStorage.getItem(`ella-runner-${playbook?.id}`) || 'null');
      if (saved && saved.playbookId === playbook?.id) {
        setCurrentStepIndex(saved.currentStepIndex || 0);
        setStepInputs(saved.stepInputs || {});
        setOutputs(saved.outputs || []);
      }
    } catch {}
  }, [isOpen, playbook?.id]);

  useEffect(() => {
    if (!isOpen) return;
    const snapshot = { playbookId: playbook?.id, currentStepIndex, stepInputs, outputs, mode };
    localStorage.setItem(`ella-runner-${playbook?.id}`, JSON.stringify(snapshot));
  }, [isOpen, playbook?.id, currentStepIndex, stepInputs, outputs, mode]);

  const steps = playbook?.steps || [];

  const consolidatedSchema = useMemo(() => {
    if (mode !== 'auto_run') return [];
    const schema = [];
    const keySet = new Set();
    steps.forEach((s, idx) => {
      (s.inputs || []).forEach(inp => {
        let key = inp.key;
        if (keySet.has(key)) key = `${key}_${idx + 1}`;
        keySet.add(key);
        schema.push({ ...inp, key, stepIndex: idx + 1 });
      });
    });
    return schema;
  }, [mode, steps]);

  const runStep = async (index) => {
    const step = steps[index];
    if (!step) return;
    setIsRunning(true);
    // Simulate prompt generation and output
    await new Promise(r => setTimeout(r, 600));
    const fake = `Output for "${step.title}" using inputs: ${JSON.stringify(stepInputs[index] || {})}`;
    setOutputs(prev => {
      const copy = prev.filter(o => o.stepIndex !== index);
      copy.push({ stepIndex: index, content: fake });
      return copy;
    });
    setIsRunning(false);
  };

  const handleSubmitStep = async () => {
    await runStep(currentStepIndex);
    if (currentStepIndex < steps.length - 1) setCurrentStepIndex(currentStepIndex + 1);
  };

  const handleSubmitAutoRun = async () => {
    setIsRunning(true);
    const runAll = async () => {
      for (let i = 0; i < steps.length; i++) {
        // Simulate using merged inputs; here we just reuse consolidated
        await new Promise(r => setTimeout(r, 350));
        const out = `Output for "${steps[i].title}" (auto-run)`;
        setOutputs(prev => [...prev, { stepIndex: i, content: out }]);
      }
    };
    await runAll();
    setIsRunning(false);
  };

  if (!isOpen || !playbook) return null;

  return (
    <div className="create-drawer-overlay">
      <div className="create-drawer">
        <div className="create-drawer-header">
          <div className="create-drawer-title-section">
            <div className="create-drawer-icon"><span className="create-drawer-type-icon">▶️</span></div>
            <div className="create-drawer-title-content">
              <h2 className="create-drawer-title">Run: {playbook.name}</h2>
              <p className="create-drawer-description">Execute steps to generate outputs</p>
            </div>
          </div>
          <button className="create-drawer-close" onClick={onClose} aria-label="Close runner"><span className="create-drawer-close-icon">✕</span></button>
        </div>

        <div className="create-drawer-content">
          {/* Progress */}
          <div className="create-drawer-progress">
            <div className="create-drawer-progress-steps">
              {steps.map((s, idx) => {
                const done = outputs.some(o => o.stepIndex === idx);
                const current = idx === currentStepIndex;
                return (
                  <div key={idx} className={`create-drawer-progress-step ${done ? 'create-drawer-progress-step--completed' : current ? 'create-drawer-progress-step--current' : ''}`}>
                    <span className="create-drawer-progress-icon">{done ? '✓' : current ? '▶️' : idx + 1}</span>
                    <span>{s.title}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Body */}
          {mode === 'step_by_step' ? (
            <div className="runner-body">
              <div className="template-form-section">
                <h3 className="template-form-section-title">Step {currentStepIndex + 1}: {steps[currentStepIndex]?.title}</h3>
                <p className="template-form-section-description">{steps[currentStepIndex]?.preview || ''}</p>
                <div className="create-drawer-field">
                  <label className="create-drawer-label">Inputs</label>
                  <div className="preview-intake">
                    {(steps[currentStepIndex]?.inputs || []).map((inp, i) => (
                      <div key={i} className="preview-intake-field">
                        <div className="preview-label">{inp.label}{inp.required && <span className="create-drawer-required">*</span>}</div>
                        {inp.type === 'single_select' ? (
                          <select value={(stepInputs[currentStepIndex]?.[inp.key]) || ''} onChange={(e) => setStepInputs(prev => ({ ...prev, [currentStepIndex]: { ...(prev[currentStepIndex]||{}), [inp.key]: e.target.value } }))}>
                            <option value="">—</option>
                            {(inp.options||[]).map((opt, oi) => <option key={oi} value={opt.value}>{opt.label}</option>)}
                          </select>
                        ) : inp.type === 'long_text' ? (
                          <textarea rows={3} value={(stepInputs[currentStepIndex]?.[inp.key]) || ''} onChange={(e) => setStepInputs(prev => ({ ...prev, [currentStepIndex]: { ...(prev[currentStepIndex]||{}), [inp.key]: e.target.value } }))} />
                        ) : (
                          <input type="text" value={(stepInputs[currentStepIndex]?.[inp.key]) || ''} onChange={(e) => setStepInputs(prev => ({ ...prev, [currentStepIndex]: { ...(prev[currentStepIndex]||{}), [inp.key]: e.target.value } }))} />
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {outputs.find(o => o.stepIndex === currentStepIndex) && (
                  <div className="template-form-section" style={{ marginTop: 12 }}>
                    <h4 className="template-form-section-title">Output</h4>
                    <div className="preview-step-content">{outputs.find(o => o.stepIndex === currentStepIndex)?.content}</div>
                  </div>
                )}

                <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
                  <button className="create-drawer-btn create-drawer-btn--primary" disabled={isRunning} onClick={handleSubmitStep}>{currentStepIndex === steps.length - 1 ? 'Finish' : 'Next Step'}</button>
                </div>
              </div>
            </div>
          ) : (
            <div className="runner-body">
              {!outputs.length ? (
                <div className="template-form-section">
                  <h3 className="template-form-section-title">Provide Inputs (Auto-Run)</h3>
                  <div className="create-drawer-field">
                    <label className="create-drawer-label">Consolidated Intake</label>
                    <div className="preview-intake">
                      {consolidatedSchema.map((f, i) => (
                        <div key={i} className="preview-intake-field">
                          <div className="preview-label">{f.label}{f.required && <span className="create-drawer-required">*</span>} <span style={{ color:'#737373', marginLeft:6 }}>(key: {f.key})</span></div>
                          {f.type === 'single_select' ? <select disabled><option>—</option></select> : f.type === 'long_text' ? <textarea disabled rows={2}/> : <input disabled type="text" />}
                        </div>
                      ))}
                    </div>
                  </div>
                  <button className="create-drawer-btn create-drawer-btn--primary" disabled={isRunning} onClick={handleSubmitAutoRun}>Run All Steps</button>
                </div>
              ) : (
                <div className="template-form-section">
                  <h3 className="template-form-section-title">Results</h3>
                  <div className="preview-playbook-seq">
                    {outputs.sort((a,b) => a.stepIndex - b.stepIndex).map((o, i) => (
                      <div key={i} className="preview-step">
                        <div className="preview-step-head">
                          <div className="preview-step-index">{o.stepIndex + 1}</div>
                          <div className="preview-step-title">{steps[o.stepIndex]?.title}</div>
                        </div>
                        <div className="preview-step-content">{o.content}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="create-drawer-footer">
          <div className="create-drawer-footer-left" />
          <div className="create-drawer-footer-right">
            <button className="create-drawer-btn create-drawer-btn--secondary" onClick={onClose}>Close</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlaybookRunnerDrawer;


