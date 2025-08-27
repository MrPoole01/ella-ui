import React, { useEffect, useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import './WorkspaceCreateModal.scss';

const WorkspaceCreateModal = ({
  isOpen,
  onClose,
  onSubmit,
  orgBrandBots = []
}) => {
  const [workspaceName, setWorkspaceName] = useState('');
  const [workspaceType, setWorkspaceType] = useState('organization'); // 'organization' | 'personal'
  const [setupPath, setSetupPath] = useState('fresh'); // 'fresh' | 'connect' | 'clone'
  const [selectedBrandBotId, setSelectedBrandBotId] = useState('');
  const [errors, setErrors] = useState({});

  const hasOrgBrandBots = useMemo(() => Array.isArray(orgBrandBots) && orgBrandBots.length > 0, [orgBrandBots]);

  useEffect(() => {
    if (isOpen) {
      setWorkspaceName('');
      setWorkspaceType('organization');
      setSetupPath('fresh');
      setSelectedBrandBotId('');
      setErrors({});
    }
  }, [isOpen]);

  const validate = () => {
    const next = {};
    if (!workspaceName.trim()) next.workspaceName = 'Workspace name is required';
    if ((setupPath === 'connect' || setupPath === 'clone') && hasOrgBrandBots && !selectedBrandBotId) {
      next.selectedBrandBotId = 'Please select a Brand Bot';
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;
    onSubmit({
      name: workspaceName.trim(),
      type: workspaceType,
      setupPath,
      brandBotId: selectedBrandBotId || null
    });
  };

  if (!isOpen) return null;

  return createPortal(
    <>
      <div className="workspace-create__backdrop" onClick={onClose} />
      <div className="workspace-create">
        <div className="workspace-create__header">
          <h2 className="workspace-create__title">Create New Workspace</h2>
          <button className="workspace-create__close" onClick={onClose}>×</button>
        </div>

        <div className="workspace-create__content">
          <div className="workspace-create__field">
            <label>Workspace Name<span className="required">*</span></label>
            <input
              className={`workspace-create__input ${errors.workspaceName ? 'has-error' : ''}`}
              value={workspaceName}
              onChange={(e) => setWorkspaceName(e.target.value)}
              placeholder="Name your workspace"
            />
            {errors.workspaceName && <div className="workspace-create__error">{errors.workspaceName}</div>}
          </div>

          <div className="workspace-create__field">
            <label>Workspace Type</label>
            <div className="workspace-create__toggle-group">
              <label className={`workspace-create__toggle-option ${workspaceType === 'organization' ? 'workspace-create__toggle-option--selected' : ''}`}>
                <input
                  type="radio"
                  name="workspaceType"
                  value="organization"
                  checked={workspaceType === 'organization'}
                  onChange={(e) => setWorkspaceType(e.target.value)}
                />
                <span>Workspace for my Organization</span>
              </label>
              <label className={`workspace-create__toggle-option ${workspaceType === 'personal' ? 'workspace-create__toggle-option--selected' : ''}`}>
                <input
                  type="radio"
                  name="workspaceType"
                  value="personal"
                  checked={workspaceType === 'personal'}
                  onChange={(e) => setWorkspaceType(e.target.value)}
                />
                <span>Workspace just for me (personal)</span>
              </label>
            </div>
          </div>

          <div className="workspace-create__section">
            <div className="workspace-create__section-title">Brand Bot Setup</div>
            <div className="workspace-create__options">
              <label className={`workspace-create__option ${setupPath === 'fresh' ? 'workspace-create__option--selected' : ''}`}>
                <input
                  type="radio"
                  name="setupPath"
                  value="fresh"
                  checked={setupPath === 'fresh'}
                  onChange={() => setSetupPath('fresh')}
                />
                <div className="workspace-create__option-content">
                  <div className="workspace-create__option-title">Start building my Brand Bot Ellaments</div>
                  <div className="workspace-create__option-desc">Create a new Brand Bot from scratch for this workspace.</div>
                </div>
              </label>

              {hasOrgBrandBots && (
                <label className={`workspace-create__option ${setupPath === 'connect' ? 'workspace-create__option--selected' : ''}`}>
                  <input
                    type="radio"
                    name="setupPath"
                    value="connect"
                    checked={setupPath === 'connect'}
                    onChange={() => setSetupPath('connect')}
                  />
                  <div className="workspace-create__option-content">
                    <div className="workspace-create__option-title">Connect a Brand Bot</div>
                    <div className="workspace-create__option-desc">Connect an existing Brand Bot to this workspace.</div>
                  </div>
                </label>
              )}

              {hasOrgBrandBots && (
                <label className={`workspace-create__option ${setupPath === 'clone' ? 'workspace-create__option--selected' : ''}`}>
                  <input
                    type="radio"
                    name="setupPath"
                    value="clone"
                    checked={setupPath === 'clone'}
                    onChange={() => setSetupPath('clone')}
                  />
                  <div className="workspace-create__option-content">
                    <div className="workspace-create__option-title">Clone a Brand Bot</div>
                    <div className="workspace-create__option-desc">Clone an existing Brand Bot to use as a starting point.</div>
                  </div>
                </label>
              )}
            </div>

            {(setupPath === 'connect' || setupPath === 'clone') && hasOrgBrandBots && (
              <div className="workspace-create__field">
                <label>Select Brand Bot<span className="required">*</span></label>
                <select
                  className={`workspace-create__select ${errors.selectedBrandBotId ? 'has-error' : ''}`}
                  value={selectedBrandBotId}
                  onChange={(e) => setSelectedBrandBotId(e.target.value)}
                >
                  <option value="">Choose a Brand Bot…</option>
                  {orgBrandBots.map(bb => (
                    <option key={bb.id} value={bb.id}>{bb.name}</option>
                  ))}
                </select>
                {errors.selectedBrandBotId && <div className="workspace-create__error">{errors.selectedBrandBotId}</div>}
              </div>
            )}
          </div>
        </div>

        <div className="workspace-create__footer">
          <button className="workspace-create__cancel" onClick={onClose}>Cancel</button>
          <button className="workspace-create__submit" onClick={handleSubmit}>Create Workspace</button>
        </div>
      </div>
    </>,
    document.body
  );
};

export default WorkspaceCreateModal;


