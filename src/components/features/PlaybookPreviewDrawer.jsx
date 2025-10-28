import React, { useMemo, useRef, useState, useEffect } from 'react';
import '../../styles/PlaybookPreviewDrawer.scss';
import ProjectCreateModal from '../ui/Modal/ProjectCreateModal';
import { ReactComponent as DtmLogo } from '../icons/dtm_logo.svg';

const PlaybookPreviewDrawer = ({
  isOpen,
  onClose,
  workspaceName = 'Workspace',
  documentContext, // { project, title }
  playbook, // { id, title, preview, description, plays: [{ id, name, blurb }], estimatedTime, tags }
  onStart, // (mode: 'step-by-step'|'auto-run', context)
  showICPs = true,
  isSpecialEdition = false,
  templateData = null
}) => {
  const [isInputStep, setIsInputStep] = useState(false);
  const [runMode, setRunMode] = useState('step-by-step'); // 'step-by-step' | 'auto-run'
  const [workspace, setWorkspace] = useState(
    documentContext?.workspace ?? (workspaceName ? { id: 'ws-current', name: workspaceName } : null)
  );
  const [project, setProject] = useState(documentContext?.project ? { id: 'proj-current', name: documentContext.project, workspaceId: 'ws-current' } : null);
  const [selectedICPs, setSelectedICPs] = useState([]);
  const [allICPsSelected, setAllICPsSelected] = useState(false);
  const [specialInstructions, setSpecialInstructions] = useState('');
  const [files, setFiles] = useState([]); // {id, file, name, sizeLabel, type, progress, status, error}
  const [showProjectModal, setShowProjectModal] = useState(false);
  const [errors, setErrors] = useState({});

  // telemetry
  const logTelemetry = (event, data = {}) => {
    console.log('Telemetry:', event, { ...data, timestamp: new Date().toISOString(), playbookId: playbook?.id });
  };

  useEffect(() => {
    if (isInputStep) {
      logTelemetry('input_panel_opened', { playbookName: playbook?.title, hasWorkspace: !!workspace });
    }
  }, [isInputStep]);

  const plays = useMemo(() => Array.isArray(playbook?.plays) ? playbook.plays : [], [playbook?.plays]);

  // Mock data (replace with API sources when available)
  const [workspaces] = useState([
    { id: 'ws1', name: 'Marketing Team' },
    { id: 'ws2', name: 'Sales Team' },
    { id: 'ws3', name: 'Product Team' }
  ]);
  const [projects, setProjects] = useState([
    { id: 'proj1', name: 'Q4 Campaign', workspaceId: 'ws1', description: 'Marketing campaign' },
    { id: 'proj2', name: 'Product Launch', workspaceId: 'ws1', description: 'Launch activities' },
    { id: 'proj3', name: 'Sales Enablement', workspaceId: 'ws2', description: 'Sales content' },
    { id: 'proj4', name: 'Creative Studio – Web Refresh', workspaceId: 'ws-current', description: 'Website updates' },
    { id: 'proj5', name: 'Creative Studio – Collateral', workspaceId: 'ws-current', description: 'Sales collateral' }
  ]);
  const [availableICPs] = useState([
    { id: 'icp1', name: 'Enterprise CMOs', workspaceId: 'ws1' },
    { id: 'icp2', name: 'SMB Marketing Managers', workspaceId: 'ws1' },
    { id: 'icp3', name: 'Tech Startups', workspaceId: 'ws1' },
    { id: 'icp4', name: 'Sales Directors', workspaceId: 'ws2' }
  ]);

  // Projects filtered by workspace; if no matching projects for the current workspace id, show all to enable selection in demo
  const currentWorkspaceId = workspace ? (workspace.id || workspace.workspaceId || workspace) : null;
  const workspaceProjects = currentWorkspaceId ? projects.filter(p => p.workspaceId === currentWorkspaceId) : projects;
  const filteredProjects = workspaceProjects.length > 0 ? workspaceProjects : projects;
  const filteredICPs = workspace ? availableICPs.filter(icp => icp.workspaceId === (workspace.id || workspace.workspaceId || workspace)) : [];

  // Keep workspace name in sync with header and prop
  useEffect(() => {
    if (workspaceName && (!workspace || workspace.name !== workspaceName)) {
      setWorkspace(prev => ({ id: prev?.id || 'ws-current', name: workspaceName }));
    }
    // intentionally leaving deps minimal; we only react to workspaceName updates
    // to avoid overriding local workspace changes
    // eslint-disable-next-line
  }, [workspaceName]);

  useEffect(() => {
    if (typeof document === 'undefined') return undefined;
    const el = document.querySelector('.header__workspace-text');
    if (!el) return undefined;
    const applyHeaderName = () => {
      const headerName = el.textContent ? el.textContent.trim() : '';
      if (headerName && (!workspace || workspace.name !== headerName)) {
        setWorkspace(prev => ({ id: prev?.id || 'ws-current', name: headerName }));
      }
    };
    applyHeaderName();
    const observer = new MutationObserver(applyHeaderName);
    observer.observe(el, { childList: true, characterData: true, subtree: true });
    return () => observer.disconnect();
    // intentionally not depending on workspace to avoid infinite loops
    // eslint-disable-next-line
  }, [isOpen]);

  const estimatedTime = playbook?.estimatedTime || (plays.length ? `${plays.length * 2}–${plays.length * 4} min` : null);
  const numPlays = plays.length || null;
  const tags = playbook?.tags || [];

  const isStartEnabled = useMemo(() => {
    if (!workspace || !project) return false;
    if (showICPs) {
      const audienceOk = allICPsSelected || selectedICPs.length > 0;
      if (!audienceOk) return false;
    }
    const hasUploadingOrError = files.some(f => f.status === 'uploading' || f.status === 'error');
    if (hasUploadingOrError) return false;
    if (specialInstructions.length > 2000) return false;
    return true;
  }, [workspace, project, showICPs, allICPsSelected, selectedICPs.length, files, specialInstructions]);

  // Files handling
  const acceptedTypes = {
    'application/pdf': 'PDF',
    'application/msword': 'DOC',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'DOCX',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation': 'PPTX',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': 'XLSX',
    'text/plain': 'TXT',
    'image/png': 'PNG',
    'image/jpeg': 'JPG',
    'image/jpg': 'JPG'
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024; const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const validateFile = (file) => {
    const ext = file.name.split('.').pop().toLowerCase();
    const okType = acceptedTypes[file.type] || ['pdf','doc','docx','ppt','pptx','xls','xlsx','txt','png','jpg','jpeg'].includes(ext);
    const okSize = file.size <= 50 * 1024 * 1024;
    return { isValid: okType && okSize, error: !okType ? 'File type not supported' : !okSize ? 'File size too large (max 50MB)' : null };
  };

  const simulateUpload = (fileData) => {
    const interval = setInterval(() => {
      setFiles(prev => prev.map(f => {
        if (f.id === fileData.id) {
          const newProgress = Math.min(f.progress + Math.random() * 20, 100);
          if (newProgress >= 100) {
            clearInterval(interval);
            return { ...f, progress: 100, status: 'completed' };
          }
          return { ...f, progress: newProgress };
        }
        return f;
      }));
    }, 300);
  };

  const handleFileInput = (inputFiles) => {
    const items = Array.from(inputFiles).map(file => {
      const validation = validateFile(file);
      return {
        id: `${file.name}-${Date.now()}-${Math.random()}`,
        file,
        name: file.name,
        sizeLabel: formatFileSize(file.size),
        type: acceptedTypes[file.type] || file.name.split('.').pop().toUpperCase(),
        progress: 0,
        status: validation.isValid ? 'uploading' : 'error',
        error: validation.error
      };
    });
    setFiles(prev => [...prev, ...items]);
    items.forEach(f => { if (f.status === 'uploading') simulateUpload(f); });
  };

  const removeFile = (fileId) => { setFiles(prev => prev.filter(f => f.id !== fileId)); };
  const retryFile = (fileId) => {
    setFiles(prev => prev.map(f => {
      if (f.id === fileId && f.file) {
        const v = validateFile(f.file);
        if (v.isValid) { const updated = { ...f, status: 'uploading', progress: 0, error: null }; simulateUpload(updated); return updated; }
      }
      return f;
    }));
  };

  // Drag & drop
  const dropZoneRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const handleDragOver = (e) => { e.preventDefault(); e.stopPropagation(); setIsDragging(true); };
  const handleDragLeave = (e) => { e.preventDefault(); e.stopPropagation(); setIsDragging(false); };
  const handleDrop = (e) => { e.preventDefault(); e.stopPropagation(); setIsDragging(false); if (e.dataTransfer.files?.length) handleFileInput(e.dataTransfer.files); };

  // Validation
  const workspaceRef = useRef(null);
  const projectRef = useRef(null);
  const icpRef = useRef(null);

  const validate = () => {
    const newErrors = {};
    if (!workspace) newErrors.workspace = 'Please select a workspace';
    if (!project) newErrors.project = 'Please select or create a project';
    if (showICPs && !allICPsSelected && selectedICPs.length === 0) newErrors.icps = 'Please select at least one ICP or choose "All ICPs"';
    const hasUploadingOrError = files.some(f => f.status === 'uploading' || f.status === 'error');
    if (hasUploadingOrError) newErrors.files = 'Please wait for all files to finish uploading or remove failed files';
    if (specialInstructions.length > 2000) newErrors.specialInstructions = 'Too long (max 2000 characters)';
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) {
      const first = Object.keys(newErrors)[0];
      logTelemetry('input_panel_validation_failed', { first_error_field: first });
      if (first === 'workspace') workspaceRef.current?.focus();
      else if (first === 'project') projectRef.current?.focus();
      else if (first === 'icps') icpRef.current?.focus();
    }
    return Object.keys(newErrors).length === 0;
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="playbook-preview-drawer__backdrop" onClick={onClose} />
      <div className={`playbook-preview-drawer ${isOpen ? 'playbook-preview-drawer--open' : ''}`}>
        <div className="playbook-preview-drawer__header">
          <div className="playbook-preview-drawer__header-bar">
            <h2 className="playbook-preview-drawer__title">{playbook?.title || documentContext?.title || 'Playbook'}</h2>
            <button className="document-drawer__close" onClick={onClose}>×</button>
          </div>
        </div>

        <div className="playbook-preview-drawer__content">
          {isSpecialEdition && templateData && (
            <div className="playbook-preview-drawer__special-edition-header">
              <div className="playbook-preview-drawer__special-edition-icon">
                <DtmLogo style={{ height: '50px' }} />
              </div>
              <div className="playbook-preview-drawer__special-edition-info">
                <h3 className="playbook-preview-drawer__special-edition-title">{templateData?.title}</h3>
                <p className="playbook-preview-drawer__special-edition-description">{templateData?.description}</p>
              </div>
            </div>
          )}
          {!isInputStep ? (
            <div className="playbook-preview-drawer__preview">
              <div className="playbook-preview-drawer__summary">
                {playbook?.preview && (
                  <div className="playbook-preview-drawer__summary-item">
                    <div className="playbook-preview-drawer__summary-label">Preview</div>
                    <div className="playbook-preview-drawer__summary-value">{playbook.preview}</div>
                  </div>
                )}
                {playbook?.description && (
                  <div className="playbook-preview-drawer__summary-item">
                    <div className="playbook-preview-drawer__summary-label">Description</div>
                    <div className="playbook-preview-drawer__summary-value">{playbook.description}</div>
                  </div>
                )}
              </div>
              {(estimatedTime || numPlays || tags.length) && (
                <div className="playbook-preview-drawer__meta">
                  {estimatedTime && (
                    <div className="playbook-preview-drawer__meta-item">
                      <span className="playbook-preview-drawer__meta-label">Estimated time</span>
                      <span className="playbook-preview-drawer__meta-value">{estimatedTime}</span>
                    </div>
                  )}
                  {numPlays !== null && (
                    <div className="playbook-preview-drawer__meta-item">
                      <span className="playbook-preview-drawer__meta-label">Number of plays</span>
                      <span className="playbook-preview-drawer__meta-value">{numPlays}</span>
                    </div>
                  )}
                  {!!tags.length && (
                    <div className="playbook-preview-drawer__meta-item">
                      <span className="playbook-preview-drawer__meta-label">Tags</span>
                      <div className="playbook-preview-drawer__tags">
                        {tags.map((t, i) => (
                          <span key={i} className="playbook-preview-drawer__tag">{t}</span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              <div className="playbook-preview-drawer__plays">
                <div className="playbook-preview-drawer__plays-header">Plays</div>
                {plays.length === 0 ? (
                  <div className="playbook-preview-drawer__empty">
                    This playbook contains multiple plays that will be guided step-by-step.
                  </div>
                ) : (
                  <div className="playbook-preview-drawer__plays-list">
                    {plays.map((p) => (
                      <div key={p.id} className="playbook-preview-drawer__play-row">
                        <div className="playbook-preview-drawer__play-title">{p.name}</div>
                        <div className="playbook-preview-drawer__play-info" title={p.blurb || ''} aria-label="Play info">
                          <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
                            <circle cx="10" cy="10" r="8" stroke="currentColor" strokeWidth="1.5" fill="none"/>
                            <path d="M10 9V14M10 6V7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                          </svg>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="playbook-preview-drawer__input" aria-live="polite">
              <div className="playbook-preview-drawer__input-row">
                <label className="playbook-preview-drawer__field-label">Workspace</label>
                <div className="playbook-preview-drawer__field-group">
                  {workspace ? (
                    <div className="playbook-preview-drawer__value" aria-live="polite">{workspace.name}</div>
                  ) : (
                    <>
                      <select
                        ref={workspaceRef}
                        aria-invalid={!!errors.workspace}
                        className="playbook-preview-drawer__select"
                        value={workspace?.id || ''}
                        onChange={(e) => {
                          const ws = workspaces.find(w => w.id === e.target.value) || null;
                          setWorkspace(ws);
                          setProject(null);
                          setSelectedICPs([]);
                          setAllICPsSelected(false);
                          logTelemetry('input_panel_field_changed', { field: 'workspace' });
                        }}
                      >
                        <option value="">Select workspace</option>
                        {workspaces.map(ws => (<option key={ws.id} value={ws.id}>{ws.name}</option>))}
                      </select>
                      {errors.workspace && <div className="playbook-preview-drawer__error" role="alert">{errors.workspace}</div>}
                    </>
                  )}
                </div>
              </div>

              <div className="playbook-preview-drawer__input-row">
                <label className="playbook-preview-drawer__field-label">Project</label>
                <div className="playbook-preview-drawer__field-group">
                  <select
                    ref={projectRef}
                    aria-invalid={!!errors.project}
                    className="playbook-preview-drawer__select"
                    value={project?.id || ''}
                    onChange={(e) => {
                      const pr = filteredProjects.find(p => p.id === e.target.value) || null;
                      setProject(pr);
                      logTelemetry('input_panel_field_changed', { field: 'project' });
                    }}
                    disabled={!workspace}
                  >
                    <option value="">Select project</option>
                    {filteredProjects.map(p => (<option key={p.id} value={p.id}>{p.name}</option>))}
                  </select>
                  <button className="playbook-preview-drawer__tiny-btn" onClick={() => setShowProjectModal(true)}>Create New</button>
                </div>
                {errors.project && <div className="playbook-preview-drawer__error" role="alert">{errors.project}</div>}
              </div>

              {showICPs && (
                <div className="playbook-preview-drawer__input-row">
                  <label className="playbook-preview-drawer__field-label">ICPs</label>
                  <div ref={icpRef} className="playbook-preview-drawer__chips">
                    <button
                      className={`playbook-preview-drawer__chip ${allICPsSelected ? 'playbook-preview-drawer__chip--active' : ''}`}
                      onClick={() => { setAllICPsSelected(!allICPsSelected); if (!allICPsSelected) setSelectedICPs([]); }}
                    >All ICPs</button>
                    {!allICPsSelected && filteredICPs.map(icp => (
                      <button
                        key={icp.id}
                        className={`playbook-preview-drawer__chip ${selectedICPs.find(i => i.id === icp.id) ? 'playbook-preview-drawer__chip--active' : ''}`}
                        onClick={() => {
                          setSelectedICPs(prev => prev.find(i => i.id === icp.id) ? prev.filter(i => i.id !== icp.id) : [...prev, icp]);
                          logTelemetry('input_panel_field_changed', { field: 'icps' });
                        }}
                      >{icp.name}</button>
                    ))}
                  </div>
                  {errors.icps && <div className="playbook-preview-drawer__error" role="alert">{errors.icps}</div>}
                  {filteredICPs.length === 0 && !allICPsSelected && (
                    <div className="playbook-preview-drawer__helper">No ICPs found — choose All ICPs or add later in the run.</div>
                  )}
                </div>
              )}

              <div className="playbook-preview-drawer__input-row">
                <label className="playbook-preview-drawer__field-label">Share more information with Ella</label>
                <textarea
                  className="playbook-preview-drawer__textarea"
                  rows={4}
                  placeholder="Notes for Ella..."
                  maxLength={2000}
                  value={specialInstructions}
                  onChange={(e) => { setSpecialInstructions(e.target.value); }}
                  aria-describedby="special-instructions-counter"
                />
                <div id="special-instructions-counter" className="playbook-preview-drawer__helper">{specialInstructions.length}/2000</div>
                {errors.specialInstructions && <div className="playbook-preview-drawer__error" role="alert">{errors.specialInstructions}</div>}
              </div>

              <div className="playbook-preview-drawer__input-row">
                <label className="playbook-preview-drawer__field-label">Add Additional Files</label>
                <div className="playbook-preview-drawer__helper">Upload any other files that would help Ella give you the best responses like examples or files that provide more information.</div>
                <div
                  ref={dropZoneRef}
                  className={`playbook-preview-drawer__upload ${isDragging ? 'playbook-preview-drawer__upload--drag' : ''}`}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                >
                  <input type="file" multiple onChange={(e) => e.target.files && handleFileInput(e.target.files)} />
                  {!!files.length && (
                    <div className="playbook-preview-drawer__file-list">
                      {files.map(f => (
                        <div key={f.id} className="playbook-preview-drawer__file-item">
                          <div>
                            <strong>{f.name}</strong> <span>• {f.sizeLabel}</span> <span>• {f.type}</span>
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            {f.status === 'uploading' && (
                              <div style={{ width: 120, height: 6, background: 'var(--theme-bg-secondary)', borderRadius: 4 }}>
                                <div style={{ width: `${f.progress}%`, height: '100%', background: 'var(--theme-interactive-primary)', borderRadius: 4 }} />
                              </div>
                            )}
                            {f.status === 'error' && <span className="playbook-preview-drawer__error">{f.error}</span>}
                            {f.status === 'error' && (
                              <button className="playbook-preview-drawer__tiny-btn" onClick={() => retryFile(f.id)}>Retry</button>
                            )}
                            <button className="playbook-preview-drawer__tiny-btn" onClick={() => removeFile(f.id)}>Remove</button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                {errors.files && <div className="playbook-preview-drawer__error" role="alert">{errors.files}</div>}
              </div>
            </div>
          )}
        </div>

        <div className="playbook-preview-drawer__footer">
          {isInputStep ? (
            <button className="playbook-preview-drawer__close" onClick={() => setIsInputStep(false)}>Back to Preview</button>
          ) : (
            <span></span>
          )}
          {!isInputStep ? (
            <div className="playbook-preview-drawer__actions">
              <button
                className="playbook-preview-drawer__btn playbook-preview-drawer__btn--primary"
                title="Guide me step-by-step and chat per step."
                onClick={() => { setRunMode('step-by-step'); setIsInputStep(true); }}
              >
                Collaborate with Ella
              </button>
              <button
                className="playbook-preview-drawer__btn playbook-preview-drawer__btn--secondary"
                title="Fill variables once, generate each Play automatically."
                onClick={() => { setRunMode('auto-run'); setIsInputStep(true); }}
              >
                Auto-run Playbook
              </button>
            </div>
          ) : (
            <div className="playbook-preview-drawer__actions">
              <button className="playbook-preview-drawer__btn playbook-preview-drawer__btn--ghost" onClick={() => setIsInputStep(false)}>Cancel</button>
              <button
                className="playbook-preview-drawer__btn playbook-preview-drawer__btn--primary"
                aria-disabled={!isStartEnabled}
                onClick={() => {
                  if (!validate()) return;
                  const context = {
                    workspace,
                    project,
                    audience: allICPsSelected ? { type: 'all' } : { type: 'icps', icps: selectedICPs },
                    specialInstructions,
                    fileIds: files.filter(f => f.status === 'completed').map(f => f.id)
                  };
                  logTelemetry('input_panel_submitted', { mode: 'step_by_step', has_icps: !allICPsSelected, icp_count: selectedICPs.length, has_files: files.length > 0, file_count: files.filter(f => f.status === 'completed').length });
                  try {
                    onStart && onStart('step-by-step', context);
                  } catch (e) {
                    logTelemetry('input_panel_launch_failed', { mode: runMode, error_code: 'launch_error' });
                  }
                }}
              >
                Next
              </button>
            </div>
          )}
        </div>

        <ProjectCreateModal
          isOpen={showProjectModal}
          onClose={() => setShowProjectModal(false)}
          onSubmit={(newProject) => {
            if (!workspace) return;
            const enriched = { ...newProject, id: newProject.id || `proj-${Date.now()}`, workspaceId: workspace.id };
            setProjects(prev => [...prev, enriched]);
            setProject(enriched);
            setShowProjectModal(false);
          }}
        />
      </div>
    </>
  );
};

export default PlaybookPreviewDrawer;


