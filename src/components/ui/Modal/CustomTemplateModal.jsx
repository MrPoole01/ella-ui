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
  const [tags, setTags] = useState([]);
  const [errors, setErrors] = useState({});
  const [customTagName, setCustomTagName] = useState('');
  const [showCustomTagInput, setShowCustomTagInput] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setTitle(initialValues?.title || '');
      setPreview(initialValues?.preview || '');
      setPrompt(initialValues?.prompt || '');
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

  const handleSave = () => {
    const nextErrors = {};
    if (!title.trim()) nextErrors.title = 'Title is required';
    if (!prompt.trim()) nextErrors.prompt = 'Prompt is required';
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    onSave({ title: title.trim(), preview: preview.trim(), prompt: prompt.trim(), tags });
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


