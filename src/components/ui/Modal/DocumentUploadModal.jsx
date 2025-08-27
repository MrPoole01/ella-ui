import React, { useState, useRef, useCallback } from 'react';
import './DocumentUploadModal.scss';

const DocumentUploadModal = ({ isOpen, onClose, onUpload }) => {
  const [dragActive, setDragActive] = useState(false);
  const [uploadingFiles, setUploadingFiles] = useState([]);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const fileInputRef = useRef(null);

  // Accepted file types and their MIME types
  const acceptedTypes = {
    'application/pdf': { ext: 'PDF', icon: '📄' },
    'application/msword': { ext: 'DOC', icon: '📝' },
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document': { ext: 'DOCX', icon: '📝' },
    'application/vnd.ms-excel': { ext: 'XLS', icon: '📊' },
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': { ext: 'XLSX', icon: '📊' },
    'application/vnd.ms-powerpoint': { ext: 'PPT', icon: '📺' },
    'application/vnd.openxmlformats-officedocument.presentationml.presentation': { ext: 'PPTX', icon: '📺' },
    'text/plain': { ext: 'TXT', icon: '📄' },
    'image/jpeg': { ext: 'JPG', icon: '🖼️' },
    'image/jpg': { ext: 'JPG', icon: '🖼️' },
    'image/png': { ext: 'PNG', icon: '🖼️' }
  };

  const acceptedExtensions = ['pdf', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'txt', 'jpg', 'jpeg', 'png'];

  const validateFile = (file) => {
    const fileExtension = file.name.split('.').pop().toLowerCase();
    const isValidType = acceptedTypes[file.type] || acceptedExtensions.includes(fileExtension);
    const isValidSize = file.size <= 50 * 1024 * 1024; // 50MB limit
    
    return {
      isValid: isValidType && isValidSize,
      error: !isValidType ? 'File type not supported' : !isValidSize ? 'File size too large (max 50MB)' : null
    };
  };

  const getFileInfo = (file) => {
    const fileExtension = file.name.split('.').pop().toLowerCase();
    const typeInfo = acceptedTypes[file.type];
    
    if (typeInfo) {
      return typeInfo;
    }
    
    // Fallback for extensions
    const extensionMap = {
      'pdf': { ext: 'PDF', icon: '📄' },
      'doc': { ext: 'DOC', icon: '📝' },
      'docx': { ext: 'DOCX', icon: '📝' },
      'xls': { ext: 'XLS', icon: '📊' },
      'xlsx': { ext: 'XLSX', icon: '📊' },
      'ppt': { ext: 'PPT', icon: '📺' },
      'pptx': { ext: 'PPTX', icon: '📺' },
      'txt': { ext: 'TXT', icon: '📄' },
      'jpg': { ext: 'JPG', icon: '🖼️' },
      'jpeg': { ext: 'JPG', icon: '🖼️' },
      'png': { ext: 'PNG', icon: '🖼️' }
    };
    
    return extensionMap[fileExtension] || { ext: fileExtension.toUpperCase(), icon: '📄' };
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleFiles = useCallback((files) => {
    const fileArray = Array.from(files);
    const newUploadingFiles = [];

    fileArray.forEach((file) => {
      const validation = validateFile(file);
      const fileInfo = getFileInfo(file);
      
      const fileData = {
        id: Date.now() + Math.random(),
        file,
        name: file.name,
        size: formatFileSize(file.size),
        type: fileInfo.ext,
        icon: fileInfo.icon,
        progress: 0,
        status: validation.isValid ? 'uploading' : 'error',
        error: validation.error
      };

      newUploadingFiles.push(fileData);
    });

    setUploadingFiles(prev => [...prev, ...newUploadingFiles]);

    // Simulate upload progress for valid files
    newUploadingFiles.forEach((fileData) => {
      if (fileData.status === 'uploading') {
        simulateUpload(fileData);
      }
    });
  }, []);

  const simulateUpload = (fileData) => {
    const interval = setInterval(() => {
      setUploadingFiles(prev => 
        prev.map(f => {
          if (f.id === fileData.id) {
            const newProgress = Math.min(f.progress + Math.random() * 15, 100);
            if (newProgress >= 100) {
              clearInterval(interval);
              // Move to uploaded files
              setTimeout(() => {
                setUploadingFiles(prev => prev.filter(f => f.id !== fileData.id));
                setUploadedFiles(prev => [...prev, { ...f, status: 'completed', progress: 100 }]);
              }, 500);
            }
            return { ...f, progress: newProgress };
          }
          return f;
        })
      );
    }, 200);
  };

  const handleDrag = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files);
    }
  }, [handleFiles]);

  const handleInputChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFiles(e.target.files);
    }
  };

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  const removeFile = (fileId, isUploaded = false) => {
    if (isUploaded) {
      setUploadedFiles(prev => prev.filter(f => f.id !== fileId));
    } else {
      setUploadingFiles(prev => prev.filter(f => f.id !== fileId));
    }
  };

  const handleClose = () => {
    setUploadingFiles([]);
    setUploadedFiles([]);
    setDragActive(false);
    onClose();
  };

  const handleUploadComplete = () => {
    // Call the onUpload callback with uploaded files
    if (onUpload) {
      onUpload(uploadedFiles.map(f => f.file));
    }
    handleClose();
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="document-upload-modal__backdrop" onClick={handleClose} />
      <div className="document-upload-modal">
        <div className="document-upload-modal__header">
          <h2 className="document-upload-modal__title">Supporting Documents</h2>
          <button 
            className="document-upload-modal__close"
            onClick={handleClose}
            aria-label="Close modal"
          >
            ×
          </button>
        </div>

        <div className="document-upload-modal__content">
          <p className="document-upload-modal__subtitle">
            Upload relevant materials to enhance your brief
          </p>

          {/* Upload Area */}
          <div 
            className={`document-upload-modal__upload-area ${dragActive ? 'drag-active' : ''}`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            onClick={openFileDialog}
          >
            <div className="document-upload-modal__upload-icon">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path 
                  d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                />
                <polyline 
                  points="14,2 14,8 20,8" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                />
                <line 
                  x1="16" 
                  y1="13" 
                  x2="8" 
                  y2="13" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                />
                <line 
                  x1="16" 
                  y1="17" 
                  x2="8" 
                  y2="17" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                />
                <polyline 
                  points="10,9 9,9 8,9" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <div className="document-upload-modal__upload-text">
              <p className="document-upload-modal__upload-primary">
                Drag and drop your files here, or click to browse
              </p>
              <p className="document-upload-modal__upload-secondary">
                Supported: PDF, DOC/DOCX, XLS/XLSX, PPT, TXT, JPG, PNG
              </p>
            </div>
            <button className="document-upload-modal__browse-btn">
              Add Files
            </button>
          </div>

          {/* File Type Buttons */}
          {/* <div className="document-upload-modal__file-types">
            <button className="document-upload-modal__file-type-btn">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.72" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.72-1.72" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Links
            </button>
            <button className="document-upload-modal__file-type-btn">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.72" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.72-1.72" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              URLs
            </button>
            <button className="document-upload-modal__file-type-btn document-upload-modal__file-type-btn--primary">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <polyline points="14,2 14,8 20,8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              + Training Files
            </button>
          </div> */}

          {/* Uploading Files */}
          {uploadingFiles.length > 0 && (
            <div className="document-upload-modal__uploading">
              <h3 className="document-upload-modal__section-title">Uploading Files</h3>
              <div className="document-upload-modal__file-list">
                {uploadingFiles.map((file) => (
                  <div key={file.id} className={`document-upload-modal__file-item ${file.status === 'error' ? 'error' : ''}`}>
                    <div className="document-upload-modal__file-info">
                      <span className="document-upload-modal__file-icon">{file.icon}</span>
                      <div className="document-upload-modal__file-details">
                        <span className="document-upload-modal__file-name">{file.name}</span>
                        <div className="document-upload-modal__file-meta">
                          <span className="document-upload-modal__file-type">{file.type}</span>
                          <span className="document-upload-modal__file-size">{file.size}</span>
                          {file.status === 'error' && (
                            <span className="document-upload-modal__file-error">{file.error}</span>
                          )}
                        </div>
                      </div>
                    </div>
                    {file.status === 'uploading' && (
                      <div className="document-upload-modal__progress">
                        <div className="document-upload-modal__progress-bar">
                          <div 
                            className="document-upload-modal__progress-fill"
                            style={{ width: `${file.progress}%` }}
                          />
                        </div>
                        <span className="document-upload-modal__progress-text">
                          {Math.round(file.progress)}%
                        </span>
                      </div>
                    )}
                    <button 
                      className="document-upload-modal__file-remove"
                      onClick={() => removeFile(file.id)}
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Uploaded Files */}
          {uploadedFiles.length > 0 && (
            <div className="document-upload-modal__uploaded">
              <h3 className="document-upload-modal__section-title">Uploaded Files</h3>
              <div className="document-upload-modal__file-list">
                {uploadedFiles.map((file) => (
                  <div key={file.id} className="document-upload-modal__file-item completed">
                    <div className="document-upload-modal__file-info">
                      <span className="document-upload-modal__file-icon">{file.icon}</span>
                      <div className="document-upload-modal__file-details">
                        <span className="document-upload-modal__file-name">{file.name}</span>
                        <div className="document-upload-modal__file-meta">
                          <span className="document-upload-modal__file-type">{file.type}</span>
                          <span className="document-upload-modal__file-size">{file.size}</span>
                        </div>
                      </div>
                    </div>
                    <div className="document-upload-modal__file-status">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                        <path d="M20 6L9 17l-5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                    <button 
                      className="document-upload-modal__file-remove"
                      onClick={() => removeFile(file.id, true)}
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        {uploadedFiles.length > 0 && (
          <div className="document-upload-modal__footer">
            <button 
              className="document-upload-modal__cancel-btn"
              onClick={handleClose}
            >
              Cancel
            </button>
            <button 
              className="document-upload-modal__upload-btn"
              onClick={handleUploadComplete}
            >
              Complete Upload ({uploadedFiles.length} files)
            </button>
          </div>
        )}

        {/* Hidden file input */}
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.jpg,.jpeg,.png"
          onChange={handleInputChange}
          style={{ display: 'none' }}
        />
      </div>
    </>
  );
};

export default DocumentUploadModal;
