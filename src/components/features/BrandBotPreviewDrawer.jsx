import React, { useEffect, useMemo, useRef, useState } from 'react';
import { createMilestone } from '../../utils/milestones';

// Brand Bot Preview Drawer (reuses playbook preview drawer styling)
// Lets users pick a mode (Established vs New), upload assets, enter URLs, then launch
const BrandBotPreviewDrawer = ({
  isOpen,
  onClose,
  onRun, // (mode: 'auto-run' | 'guided', data: { files, websiteUrl, competitorUrls })
  defaultMode = null,
  persistedStateKey = 'brandbot-preview-state'
}) => {
  const [mode, setMode] = useState(defaultMode);
  const [files, setFiles] = useState([]); // {id,name,sizeLabel,type,status,progress,error}
  const [websiteUrl, setWebsiteUrl] = useState('');
  const [competitorUrls, setCompetitorUrls] = useState(['']);
  const [isDragging, setIsDragging] = useState(false);
  const dropRef = useRef(null);

  // Load persisted data when opening
  useEffect(() => {
    if (isOpen) {
      try {
        const raw = localStorage.getItem(persistedStateKey);
        if (raw) {
          const saved = JSON.parse(raw);
          if (saved.mode) setMode(saved.mode);
          if (Array.isArray(saved.files)) setFiles(saved.files);
          if (saved.websiteUrl) setWebsiteUrl(saved.websiteUrl);
          if (Array.isArray(saved.competitorUrls)) setCompetitorUrls(saved.competitorUrls);
        }
      } catch (_) {}
    }
  }, [isOpen, persistedStateKey]);

  const persist = (next) => {
    try { localStorage.setItem(persistedStateKey, JSON.stringify(next)); } catch (_) {}
  };

  useEffect(() => {
    if (!isOpen) return;
    persist({ mode, files, websiteUrl, competitorUrls });
  }, [mode, files, websiteUrl, competitorUrls, isOpen]);

  const acceptedExts = ['pdf','doc','docx','ppt','pptx','xls','xlsx','txt','png','jpg','jpeg'];
  const formatSize = (bytes) => {
    if (!bytes && bytes !== 0) return '';
    const k=1024; const sizes=['Bytes','KB','MB','GB']; const i=Math.floor(Math.log(bytes)/Math.log(k));
    return `${parseFloat((bytes/Math.pow(k,i)).toFixed(2))} ${sizes[i]}`;
  };
  const validateFile = (file) => {
    const ext = file.name.split('.').pop().toLowerCase();
    const okType = acceptedExts.includes(ext);
    const okSize = file.size <= 50*1024*1024;
    return { isValid: okType && okSize, error: !okType ? 'Unsupported type' : !okSize ? 'File too large (max 50MB)' : null };
  };
  const simulateUpload = (fileData) => {
    const timer = setInterval(() => {
      setFiles(prev => prev.map(f => {
        if (f.id === fileData.id) {
          const p = Math.min(f.progress + Math.random()*20, 100);
          if (p >= 100) { clearInterval(timer); return { ...f, progress: 100, status: 'completed' }; }
          return { ...f, progress: p };
        }
        return f;
      }));
    }, 250);
  };
  const handleFiles = (list) => {
    const arr = Array.from(list).map(file => {
      const v = validateFile(file);
      return {
        id: `${file.name}-${Date.now()}-${Math.random()}`,
        name: file.name,
        sizeLabel: formatSize(file.size),
        type: file.name.split('.').pop().toUpperCase(),
        status: v.isValid ? 'uploading' : 'error',
        progress: 0,
        error: v.error
      };
    });
    setFiles(prev => [...prev, ...arr]);
    arr.forEach(f => { if (f.status === 'uploading') simulateUpload(f); });
  };

  const canRun = useMemo(() => !!mode, [mode]);

  if (!isOpen) return null;

  return (
    <>
      <div className="playbook-preview-drawer__backdrop" onClick={onClose} />
      <div className="playbook-preview-drawer playbook-preview-drawer--open">
        <div className="playbook-preview-drawer__header">
          <div className="playbook-preview-drawer__header-bar">
            <h2 className="playbook-preview-drawer__title">Build or Refine Your Brand Bot</h2>
            <button className="document-drawer__close" onClick={onClose}>×</button>
          </div>
        </div>

        <div className="playbook-preview-drawer__content">
          <div className="playbook-preview-drawer__summary">
            <div className="playbook-preview-drawer__summary-item">
              <div className="playbook-preview-drawer__summary-value">
                This Brand Bot Playbook guides you through three key milestones: <strong>Company</strong> → <strong>Customers</strong> → <strong>Brand</strong>. Each milestone represents a completed section with key outcomes before progressing to the next.
              </div>
            </div>
          </div>

          {/* Milestone preview */}
          <div className="playbook-preview-drawer__milestones">
            <div className="playbook-preview-drawer__summary-label">Milestones in this playbook:</div>
            <div className="playbook-preview-drawer__milestone-list">
              <div className="playbook-preview-drawer__milestone-badge">
                <span>Company</span>
              </div>
              <div className="playbook-preview-drawer__milestone-badge">
                <span>Customers</span>
              </div>
              <div className="playbook-preview-drawer__milestone-badge">
                <span>Brand</span>
              </div>
            </div>
          </div>

          {/* Mode selection cards */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <button
              className="playbook-preview-drawer__btn playbook-preview-drawer__btn--secondary"
              style={{ justifyContent: 'flex-start', padding: '12px', border: mode==='auto-run' ? '2px solid var(--theme-interactive-primary)' : undefined }}
              onClick={() => setMode('auto-run')}
              aria-pressed={mode==='auto-run'}
            >
              Established Brand — Auto-run (variables-based)
            </button>
            <button
              className="playbook-preview-drawer__btn playbook-preview-drawer__btn--secondary"
              style={{ justifyContent: 'flex-start', padding: '12px', border: mode==='guided' ? '2px solid var(--theme-interactive-primary)' : undefined }}
              onClick={() => setMode('guided')}
              aria-pressed={mode==='guided'}
            >
              New or Reimagining — Guided interview
            </button>
          </div>

          {/* Uploads */}
          <div className="playbook-preview-drawer__input" aria-live="polite" style={{ marginTop: 12 }}>
            <div className="playbook-preview-drawer__input-row">
              <label className="playbook-preview-drawer__field-label">Upload brand assets</label>
              <div
                ref={dropRef}
                className={`playbook-preview-drawer__upload ${isDragging ? 'playbook-preview-drawer__upload--drag' : ''}`}
                onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); setIsDragging(true); }}
                onDragLeave={(e) => { e.preventDefault(); e.stopPropagation(); setIsDragging(false); }}
                onDrop={(e) => { e.preventDefault(); e.stopPropagation(); setIsDragging(false); if (e.dataTransfer.files?.length) handleFiles(e.dataTransfer.files); }}
              >
                <input type="file" multiple onChange={(e) => e.target.files && handleFiles(e.target.files)} />
                <div className="playbook-preview-drawer__helper">Drop files that describe your business, brand, or customers.</div>
                {!!files.length && (
                  <div className="playbook-preview-drawer__file-list">
                    {files.map(f => (
                      <div key={f.id} className="playbook-preview-drawer__file-item">
                        <strong>{f.name}</strong> • {f.sizeLabel} • {f.type} {f.status==='error' && <span className="playbook-preview-drawer__error"> — {f.error}</span>}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="playbook-preview-drawer__input-row">
              <label className="playbook-preview-drawer__field-label">Company website</label>
              <input
                type="url"
                className="playbook-preview-drawer__select"
                placeholder="https://example.com"
                value={websiteUrl}
                onChange={(e) => setWebsiteUrl(e.target.value)}
              />
              <div className="playbook-preview-drawer__helper">Ella will auto-crawl your website in the background.</div>
            </div>

            <div className="playbook-preview-drawer__input-row">
              <label className="playbook-preview-drawer__field-label">Competitor URLs (optional)</label>
              <div style={{ display: 'grid', gap: 8 }}>
                {competitorUrls.map((url, idx) => (
                  <input
                    key={idx}
                    type="url"
                    className="playbook-preview-drawer__select"
                    placeholder={`https://competitor${idx+1}.com`}
                    value={url}
                    onChange={(e) => setCompetitorUrls(prev => prev.map((u,i)=> i===idx? e.target.value : u))}
                  />
                ))}
                {competitorUrls.length < 10 && (
                  <button className="playbook-preview-drawer__tiny-btn" onClick={() => setCompetitorUrls(prev => [...prev, ''])}>Add another</button>
                )}
              </div>
              <div className="playbook-preview-drawer__helper">Add up to 10 competitor URLs.</div>
            </div>
          </div>
        </div>

        <div className="playbook-preview-drawer__footer">
          <button className="playbook-preview-drawer__close" onClick={onClose}>Cancel</button>
          <div className="playbook-preview-drawer__actions">
            <button
              className="playbook-preview-drawer__btn playbook-preview-drawer__btn--primary"
              aria-disabled={!canRun}
              onClick={() => {
                if (!mode) return;
                onRun && onRun(mode, { files, websiteUrl, competitorUrls });
              }}
            >
              Run Playbook
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default BrandBotPreviewDrawer;


