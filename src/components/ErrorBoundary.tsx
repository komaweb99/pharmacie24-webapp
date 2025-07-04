import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null
    };
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
      errorInfo: null
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({
      error,
      errorInfo
    });

    // Log error to monitoring service in production
    if (import.meta.env.PROD) {
      console.error('Error caught by boundary:', error, errorInfo);
      // TODO: Send to error monitoring service (Sentry, LogRocket, etc.)
    }
  }

  handleRetry = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null
    });
  };

  handleGoHome = () => {
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 text-center">
            <div className="bg-red-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
              <AlertTriangle className="h-8 w-8 text-red-600" />
            </div>
            
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              Oops! Une erreur s'est produite
            </h1>
            
            <p className="text-gray-600 mb-6">
              Nous nous excusons pour ce désagrément. Une erreur inattendue s'est produite.
            </p>

            {import.meta.env.DEV && this.state.error && (
              <div className="bg-gray-100 p-4 rounded-lg mb-6 text-left">
                <p className="text-sm font-mono text-red-600 break-all">
                  {this.state.error.message}
                </p>
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={this.handleRetry}
                className="flex-1 bg-emerald-600 text-white px-4 py-3 rounded-lg font-medium hover:bg-emerald-700 transition-colors flex items-center justify-center space-x-2"
              >
                <RefreshCw className="h-4 w-4" />
                <span>Réessayer</span>
              </button>
              
              <button
                onClick={this.handleGoHome}
                className="flex-1 bg-gray-600 text-white px-4 py-3 rounded-lg font-medium hover:bg-gray-700 transition-colors flex items-center justify-center space-x-2"
              >
                <Home className="h-4 w-4" />
                <span>Accueil</span>
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;