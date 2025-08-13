import React, { useEffect, useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import './CustomTemplateModal.scss';

const predefinedTags = [
  { value: 'email', label: 'Email' },
  { value: 'social_post', label: 'Social Post' },
  { value: 'campaign', label: 'Campaign' },
  { value: 'press_release', label: 'Press Release' },
  { value: 'onboarding', label: 'Onboarding' },
  { value: 'launch', label: 'Launch' },
  { value: 'holiday', label: 'Holiday' },
  { value: 'linkedin', label: 'LinkedIn' },
  { value: 'facebook', label: 'Facebook' },
  { value: 'twitter', label: 'Twitter' },
  { value: 'newsletter', label: 'Newsletter' },
  { value: 'other', label: 'Other' }
];

const CustomTemplateModal = ({ isOpen, onClose, onSave, initialValues }) => {
  const [title, setTitle] = useState('');
  const [preview, setPreview] = useState('');
  const [prompt, setPrompt] = useState('');
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [tags, setTags] = useState([]);
  const [errors, setErrors] = useState({});
  const [customTagName, setCustomTagName] = useState('');
  const [showCustomTagInput, setShowCustomTagInput] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setTitle(initialValues?.title || '');
      setPreview(initialValues?.preview || '');
      setPrompt(initialValues?.prompt || '');
      setUploadedFiles(initialValues?.files || []);
      setTags(initialValues?.tags || []);
      setErrors({});
      setCustomTagName('');
      setShowCustomTagInput(false);
    }
  }, [isOpen, initialValues]);

  const availableTags = useMemo(
    () => predefinedTags.map(t => ({ ...t, selected: tags.includes(t.value) })),
    [tags]
  );

  const customTags = useMemo(
    () => tags.filter(tag => !predefinedTags.some(pt => pt.value === tag))
      .map(tag => ({ value: tag, label: tag.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()), selected: true })),
    [tags]
  );

  const removeCustomTag = (tagValue) => {
    setTags(prev => prev.filter(t => t !== tagValue));
  };

  const toggleTag = (tagValue) => {
    if (tagValue === 'other') {
      setShowCustomTagInput(true);
      return;
    }
    
    setTags(prev => prev.includes(tagValue)
      ? prev.filter(t => t !== tagValue)
      : [...prev, tagValue]
    );
  };

  const handleCustomTagAdd = () => {
    if (customTagName.trim()) {
      const customTag = customTagName.trim().toLowerCase().replace(/\s+/g, '_');
      setTags(prev => [...prev, customTag]);
      setCustomTagName('');
      setShowCustomTagInput(false);
    }
  };

  const handleCustomTagCancel = () => {
    setCustomTagName('');
    setShowCustomTagInput(false);
  };

  const handleFileUpload = (event) => {
    const files = Array.from(event.target.files);
    const newFiles = files.map(file => ({
      id: Date.now() + Math.random(),
      name: file.name,
      size: file.size,
      type: file.type,
      file: file
    }));
    setUploadedFiles(prev => [...prev, ...newFiles]);
  };

  const removeFile = (fileId) => {
    setUploadedFiles(prev => prev.filter(file => file.id !== fileId));
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleSave = () => {
    const nextErrors = {};
    if (!title.trim()) nextErrors.title = 'Title is required';
    if (!prompt.trim()) nextErrors.prompt = 'Prompt is required';
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    onSave({ 
      title: title.trim(), 
      preview: preview.trim(), 
      prompt: prompt.trim(), 
      files: uploadedFiles,
      tags 
    });
  };

  const handleCancel = () => {
    onClose();
  };

  if (!isOpen) return null;

  return createPortal(
    <>
      <div className="custom-template-modal__backdrop" onClick={handleCancel} />
      <div className="custom-template-modal">
        <div className="custom-template-modal__header">
          <h3 className="custom-template-modal__title">
            {initialValues ? 'Edit Custom Template' : 'New Custom Template'}
          </h3>
          <button className="custom-template-modal__close" onClick={handleCancel}>×</button>
        </div>
        <div className="custom-template-modal__content">
          <div className="custom-template-modal__field">
            <label>Title<span className="required">*</span></label>
            <input
              className={`custom-template-modal__input ${errors.title ? 'has-error' : ''}`}
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter template name"
            />
            {errors.title && <div className="custom-template-modal__error">{errors.title}</div>}
          </div>

          <div className="custom-template-modal__field">
            <label>Preview</label>
            <input
              className="custom-template-modal__input"
              type="text"
              value={preview}
              onChange={(e) => setPreview(e.target.value)}
              placeholder="Short summary or description (optional)"
            />
          </div>

          <div className="custom-template-modal__field">
            <label>Prompt<span className="required">*</span></label>
            <textarea
              className={`custom-template-modal__textarea ${errors.prompt ? 'has-error' : ''}`}
              rows={6}
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Enter the instruction or base prompt"
            />
            {errors.prompt && <div className="custom-template-modal__error">{errors.prompt}</div>}
          </div>

          {/* File Upload Area */}
          <div className="custom-template-modal__field">
            <label>Files (Optional)</label>
            <div className="custom-template-modal__file-upload">
              <div className="custom-template-modal__upload-area">
                <input
                  type="file"
                  id="file-upload"
                  className="custom-template-modal__file-input"
                  multiple
                  onChange={handleFileUpload}
                  accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png,.gif"
                />
                <label htmlFor="file-upload" className="custom-template-modal__upload-label">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path d="M21 15V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M7 10L12 15L17 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M12 15V3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <span>Click to upload files or drag and drop</span>
                  <span className="custom-template-modal__upload-hint">PDF, DOC, TXT, Images up to 10MB each</span>
                </label>
              </div>
              
              {uploadedFiles.length > 0 && (
                <div className="custom-template-modal__uploaded-files">
                  {uploadedFiles.map(file => (
                    <div key={file.id} className="custom-template-modal__file-item">
                      <div className="custom-template-modal__file-info">
                        <span className="custom-template-modal__file-name">{file.name}</span>
                        <span className="custom-template-modal__file-size">{formatFileSize(file.size)}</span>
                      </div>
                      <button
                        type="button"
                        className="custom-template-modal__remove-file"
                        onClick={() => removeFile(file.id)}
                        title="Remove file"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="custom-template-modal__field">
            <label>Tags</label>
            <div className="custom-template-modal__tags-grid">
              {availableTags.map(tag => (
                <button
                  key={tag.value}
                  className={`custom-template-modal__tag ${tag.selected ? 'custom-template-modal__tag--selected' : ''}`}
                  type="button"
                  onClick={() => toggleTag(tag.value)}
                >
                  {tag.label}
                </button>
              ))}
            </div>
            
            {customTags.length > 0 && (
              <div className="custom-template-modal__custom-tags">
                <div className="custom-template-modal__custom-tags-label">Custom Tags:</div>
                <div className="custom-template-modal__tags-grid">
                  {customTags.map(tag => (
                    <div key={tag.value} className="custom-template-modal__custom-tag">
                      <span>{tag.label}</span>
                      <button
                        type="button"
                        className="custom-template-modal__remove-tag"
                        onClick={() => removeCustomTag(tag.value)}
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {showCustomTagInput && (
              <div className="custom-template-modal__custom-tag-input">
                <input
                  type="text"
                  className="custom-template-modal__input"
                  value={customTagName}
                  onChange={(e) => setCustomTagName(e.target.value)}
                  placeholder="Enter custom tag name"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleCustomTagAdd();
                    } else if (e.key === 'Escape') {
                      handleCustomTagCancel();
                    }
                  }}
                  autoFocus
                />
                <div className="custom-template-modal__custom-tag-buttons">
                  <button
                    type="button"
                    className="custom-template-modal__custom-tag-add"
                    onClick={handleCustomTagAdd}
                  >
                    Add
                  </button>
                  <button
                    type="button"
                    className="custom-template-modal__custom-tag-cancel"
                    onClick={handleCustomTagCancel}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="custom-template-modal__footer">
          <button className="custom-template-modal__cancel" onClick={handleCancel}>Cancel</button>
          <button className="custom-template-modal__save" onClick={handleSave}>Save Template</button>
        </div>
      </div>
    </>,
    document.body
  );
};

export default CustomTemplateModal;


