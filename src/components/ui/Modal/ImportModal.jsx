import React, { useState, useRef, useEffect } from 'react';
import './ImportModal.scss';

const ImportModal = ({ isOpen, onClose, onImport, selectedType }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [errors, setErrors] = useState([]);
  const [importResults, setImportResults] = useState(null);
  const fileInputRef = useRef(null);
  const modalRef = useRef(null);

  // Reset state when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      setSelectedFile(null);
      setErrors([]);
      setImportResults(null);
      setIsProcessing(false);
    }
  }, [isOpen]);

  // Focus management
  useEffect(() => {
    if (isOpen && modalRef.current) {
      const firstFocusable = modalRef.current.querySelector('button, input, select, textarea, [tabindex]:not([tabindex="-1"])');
      if (firstFocusable) {
        firstFocusable.focus();
      }
    }
  }, [isOpen]);

  // Keyboard handling
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isOpen) return;
      
      if (e.key === 'Escape') {
        handleCancel();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  const getTypeInstructions = () => {
    switch (selectedType) {
      case 'template':
        return {
          title: 'Import Templates from Excel',
          description: 'Upload an Excel or CSV file with template data. Each row will create a new template.',
          requiredColumns: [
            'Name (required) - Template name',
            'Section (optional) - Template category',
            'Tags (optional) - Comma-separated tags',
            'Description/Preview (required) - Template description',
            'Input Fields (optional) - JSON array of input field definitions',
            'Instruction/Prompt Text (required) - The template prompt'
          ],
          example: 'template-import-example.xlsx'
        };
      case 'playbook':
        return {
          title: 'Import Playbooks from Excel',
          description: 'Upload an Excel or CSV file with playbook data. Rows with the same Playbook ID will be grouped into one playbook.',
          requiredColumns: [
            'Playbook ID (optional) - Groups plays into playbooks. If empty, creates single-play playbook',
            'Play Title (required) - Individual play name',
            'Play Instructions/Prompt (required) - Play content',
            'Tags (optional) - Comma-separated tags',
            'Description (optional) - Playbook description',
            'Order (optional) - Play order within playbook'
          ],
          example: 'playbook-import-example.xlsx'
        };
      case 'group':
        return {
          title: 'Import Playbook Series from Excel',
          description: 'Upload an Excel or CSV file with playbook series data. Supports full hierarchy: Series → Playbooks → Plays.',
          requiredColumns: [
            'Series ID (optional) - Groups playbooks into series. If empty, creates standalone playbooks',
            'Series Title (required if Series ID provided) - Series name',
            'Playbook ID (required) - Individual playbook identifier',
            'Play Title (required) - Individual play name',
            'Play Instructions/Prompt (required) - Play content',
            'Series Order (optional) - Playbook order within series',
            'Play Order (optional) - Play order within playbook'
          ],
          example: 'playbook-series-import-example.xlsx'
        };
      default:
        return {
          title: 'Import from Excel',
          description: 'Upload an Excel or CSV file.',
          requiredColumns: [],
          example: 'import-example.xlsx'
        };
    }
  };

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Validate file type
      const validTypes = [
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // .xlsx
        'application/vnd.ms-excel', // .xls
        'text/csv', // .csv
        'application/csv'
      ];
      
      if (!validTypes.includes(file.type) && !file.name.match(/\.(xlsx|xls|csv)$/i)) {
        setErrors(['Please select a valid Excel (.xlsx, .xls) or CSV (.csv) file.']);
        setSelectedFile(null);
        return;
      }

      if (file.size > 10 * 1024 * 1024) { // 10MB limit
        setErrors(['File size must be less than 10MB.']);
        setSelectedFile(null);
        return;
      }

      setSelectedFile(file);
      setErrors([]);
    }
  };

  const handleImport = async () => {
    if (!selectedFile) return;

    setIsProcessing(true);
    setErrors([]);
    setImportResults(null);

    try {
      // Log telemetry
      logTelemetryEvent('import_started', { 
        type: selectedType, 
        filename: selectedFile.name,
        fileSize: selectedFile.size
      });

      // Process the file
      const results = await processImportFile(selectedFile, selectedType);
      
      if (results.errors.length > 0) {
        setErrors(results.errors);
      }
      
      if (results.success.length > 0) {
        setImportResults(results.summary);
        
        // Log success
        logTelemetryEvent('import_success', {
          type: selectedType,
          itemsCreated: results.success.length,
          errorsCount: results.errors.length
        });

        // Call parent handler to update the list
        if (onImport) {
          onImport(results.success, selectedType);
        }
      } else {
        // All rows failed
        logTelemetryEvent('import_failure', {
          type: selectedType,
          errorCount: results.errors.length
        });
      }
      
    } catch (error) {
      console.error('Import error:', error);
      setErrors([`Import failed: ${error.message}`]);
      
      logTelemetryEvent('import_error', {
        type: selectedType,
        error: error.message
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCancel = () => {
    if (isProcessing) return;
    onClose();
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      handleCancel();
    }
  };

  // Mock file processing function
  const processImportFile = async (file, type) => {
    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Mock processing results
    const mockResults = {
      success: [],
      errors: [],
      summary: { templates: 0, playbooks: 0, series: 0 }
    };

    // Simulate some successful imports and errors
    const itemCount = Math.floor(Math.random() * 10) + 3; // 3-12 items
    const errorCount = Math.floor(Math.random() * 3); // 0-2 errors

    // Generate mock successful items
    for (let i = 0; i < itemCount; i++) {
      mockResults.success.push({
        id: `imported_${type}_${Date.now()}_${i}`,
        name: `Imported ${type} ${i + 1}`,
        type: type,
        source: 'import'
      });
    }

    // Generate mock errors
    for (let i = 0; i < errorCount; i++) {
      mockResults.errors.push(`Row ${i + itemCount + 1}: Missing required field 'Name'`);
    }

    // Update summary based on type
    if (type === 'template') {
      mockResults.summary.templates = itemCount;
    } else if (type === 'playbook') {
      mockResults.summary.playbooks = Math.ceil(itemCount / 2); // Group plays into playbooks
    } else if (type === 'group') {
      mockResults.summary.series = 1;
      mockResults.summary.playbooks = Math.ceil(itemCount / 3);
    }

    return mockResults;
  };

  // Telemetry logging
  const logTelemetryEvent = (eventName, data = {}) => {
    console.log('Telemetry Event:', eventName, data);
    
    const events = JSON.parse(localStorage.getItem('ella-telemetry') || '[]');
    events.push({
      event: eventName,
      data,
      timestamp: new Date().toISOString(),
      user_id: 'current_user_id'
    });
    localStorage.setItem('ella-telemetry', JSON.stringify(events));
  };

  if (!isOpen) return null;

  const typeInfo = getTypeInstructions();

  return (
    <div className="import-modal-overlay" onClick={handleBackdropClick}>
      <div 
        className="import-modal" 
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="import-modal-title"
      >
        <div className="import-modal-header">
          <h2 id="import-modal-title" className="import-modal-title">
            {typeInfo.title}
          </h2>
          <button
            className="import-modal-close"
            onClick={handleCancel}
            aria-label="Close import modal"
            disabled={isProcessing}
          >
            <i className="fa-solid fa-times"></i>
          </button>
        </div>

        <div className="import-modal-content">
          <div className="import-modal-description">
            {typeInfo.description}
          </div>

          {/* File Upload */}
          <div className="import-file-section">
            <label className="import-file-label">
              <strong>Select File</strong>
            </label>
            <div className="import-file-upload">
              <input
                ref={fileInputRef}
                type="file"
                accept=".xlsx,.xls,.csv"
                onChange={handleFileSelect}
                disabled={isProcessing}
                className="import-file-input"
              />
              <div className="import-file-info">
                {selectedFile ? (
                  <div className="import-file-selected">
                    <i className="fa-solid fa-file-excel"></i>
                    <span>{selectedFile.name}</span>
                    <span className="import-file-size">
                      ({(selectedFile.size / 1024).toFixed(1)} KB)
                    </span>
                  </div>
                ) : (
                  <div className="import-file-placeholder">
                    <i className="fa-solid fa-cloud-upload-alt"></i>
                    <span>Choose Excel (.xlsx, .xls) or CSV file</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Required Columns */}
          <div className="import-columns-section">
            <h3 className="import-columns-title">Required Columns</h3>
            <ul className="import-columns-list">
              {typeInfo.requiredColumns.map((column, index) => (
                <li key={index} className="import-column-item">
                  {column}
                </li>
              ))}
            </ul>
          </div>

          {/* Errors */}
          {errors.length > 0 && (
            <div className="import-errors-section">
              <h3 className="import-errors-title">
                <i className="fa-solid fa-exclamation-triangle"></i>
                Import Errors
              </h3>
              <ul className="import-errors-list">
                {errors.map((error, index) => (
                  <li key={index} className="import-error-item">
                    {error}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Success Results */}
          {importResults && (
            <div className="import-success-section">
              <h3 className="import-success-title">
                <i className="fa-solid fa-check-circle"></i>
                Import Successful
              </h3>
              <div className="import-success-summary">
                {importResults.templates > 0 && (
                  <div className="import-success-item">
                    <strong>{importResults.templates}</strong> Templates created
                  </div>
                )}
                {importResults.playbooks > 0 && (
                  <div className="import-success-item">
                    <strong>{importResults.playbooks}</strong> Playbooks created
                  </div>
                )}
                {importResults.series > 0 && (
                  <div className="import-success-item">
                    <strong>{importResults.series}</strong> Playbook Series created
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="import-modal-footer">
          <button
            className="import-modal-btn import-modal-btn--secondary"
            onClick={handleCancel}
            disabled={isProcessing}
          >
            {importResults ? 'Close' : 'Cancel'}
          </button>
          
          {!importResults && (
            <button
              className="import-modal-btn import-modal-btn--primary"
              onClick={handleImport}
              disabled={!selectedFile || isProcessing}
            >
              {isProcessing ? (
                <>
                  <i className="fa-solid fa-spinner fa-spin"></i>
                  Processing...
                </>
              ) : (
                <>
                  <i className="fa-solid fa-upload"></i>
                  Import
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ImportModal;
