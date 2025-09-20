import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Log the error
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    
    this.setState({
      error: error,
      errorInfo: errorInfo
    });

    // Log telemetry event
    this.logErrorTelemetry(error, errorInfo);
  }

  logErrorTelemetry = (error, errorInfo) => {
    try {
      const events = JSON.parse(localStorage.getItem('ella-telemetry') || '[]');
      events.push({
        event: 'react_error_boundary_triggered',
        data: {
          error_name: error.name,
          error_message: error.message,
          error_stack: error.stack,
          component_stack: errorInfo.componentStack,
          error_boundary: this.props.name || 'unnamed'
        },
        timestamp: new Date().toISOString(),
        user_id: 'current_user_id'
      });
      localStorage.setItem('ella-telemetry', JSON.stringify(events));
    } catch (e) {
      console.error('Failed to log error telemetry:', e);
    }
  };

  handleRetry = () => {
    this.setState({ 
      hasError: false, 
      error: null, 
      errorInfo: null 
    });
  };

  render() {
    if (this.state.hasError) {
      // Fallback UI
      return (
        <div className="error-boundary">
          <div className="error-boundary-content">
            <div className="error-boundary-icon">⚠️</div>
            <h3 className="error-boundary-title">Something went wrong</h3>
            <p className="error-boundary-message">
              {this.props.fallbackMessage || 'We encountered an unexpected error. Please try again.'}
            </p>
            <div className="error-boundary-actions">
              <button 
                className="error-boundary-retry"
                onClick={this.handleRetry}
              >
                Try Again
              </button>
              {this.props.onError && (
                <button 
                  className="error-boundary-close"
                  onClick={this.props.onError}
                >
                  Close
                </button>
              )}
            </div>
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details className="error-boundary-details">
                <summary>Error Details (Development)</summary>
                <pre className="error-boundary-stack">
                  {this.state.error.toString()}
                  {this.state.errorInfo.componentStack}
                </pre>
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
