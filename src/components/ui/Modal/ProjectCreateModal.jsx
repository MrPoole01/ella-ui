import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import './ProjectCreateModal.scss';

const ProjectCreateModal = ({
  isOpen,
  onClose,
  onSubmit,
  existingProjects = []
}) => {
  const [projectName, setProjectName] = useState('');
  const [projectDescription, setProjectDescription] = useState('');
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isOpen) {
      setProjectName('');
      setProjectDescription('');
      setErrors({});
    }
  }, [isOpen]);

  const validate = () => {
    const next = {};
    
    // Project name is required
    if (!projectName.trim()) {
      next.projectName = 'Project name is required';
    }
    
    // Check for duplicate names (case-insensitive)
    const isDuplicate = existingProjects.some(
      project => project.name.toLowerCase() === projectName.trim().toLowerCase()
    );
    if (isDuplicate) {
      next.projectName = 'A project with this name already exists';
    }
    
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;
    onSubmit({
      name: projectName.trim(),
      description: projectDescription.trim() || '',
      createdAt: new Date().toISOString(),
      id: Date.now() // Simple ID generation for demo
    });
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && e.ctrlKey) {
      handleSubmit();
    }
  };

  if (!isOpen) return null;

  return createPortal(
    <>
      <div className="project-create__backdrop" onClick={onClose} />
      <div className="project-create">
        <div className="project-create__header">
          <h2 className="project-create__title">Create New Project</h2>
          <button className="project-create__close" onClick={onClose}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M12 4L4 12M4 4L12 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>

        <div className="project-create__content">
          <div className="project-create__field">
            <label>Project Name<span className="required">*</span></label>
            <input
              className={`project-create__input ${errors.projectName ? 'has-error' : ''}`}
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Enter project name"
              autoFocus
            />
            {errors.projectName && <div className="project-create__error">{errors.projectName}</div>}
          </div>

          <div className="project-create__field">
            <label>Project Description<span className="optional">(optional)</span></label>
            <textarea
              className="project-create__textarea"
              value={projectDescription}
              onChange={(e) => setProjectDescription(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Describe your project (optional)"
              rows={3}
            />
          </div>
        </div>

        <div className="project-create__footer">
          <button className="project-create__cancel" onClick={onClose}>
            Cancel
          </button>
          <button 
            className={`project-create__submit ${!projectName.trim() ? 'project-create__submit--disabled' : ''}`}
            onClick={handleSubmit}
            disabled={!projectName.trim()}
          >
            Create Project
          </button>
        </div>
      </div>
    </>,
    document.body
  );
};

export default ProjectCreateModal;
