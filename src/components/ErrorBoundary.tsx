import { Component, ErrorInfo, ReactNode } from 'react';
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

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null,
  };

  public static getDerivedStateFromError(error: Error): Partial<State> {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    this.setState({ errorInfo });
  }

  private handleReload = () => {
    window.location.reload();
  };

  private handleGoHome = () => {
    window.location.href = '/';
  };

  private handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
  };

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen bg-background flex items-center justify-center p-6">
          <div className="max-w-md w-full text-center space-y-6">
            {/* Icon */}
            <div className="w-20 h-20 mx-auto rounded-3xl bg-destructive/10 flex items-center justify-center">
              <AlertTriangle className="w-10 h-10 text-destructive" />
            </div>

            {/* Message */}
            <div className="space-y-2">
              <h1 className="text-2xl font-bold text-foreground">
                Oops! Something went wrong
              </h1>
              <p className="text-muted-foreground">
                Don't worry, this happens sometimes. Let's get you back on track.
              </p>
            </div>

            {/* Error details (collapsed by default in production) */}
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details className="text-left bg-muted/50 rounded-xl p-4">
                <summary className="cursor-pointer text-sm font-medium text-muted-foreground">
                  Technical details
                </summary>
                <pre className="mt-2 text-xs text-destructive overflow-auto max-h-32">
                  {this.state.error.toString()}
                  {this.state.errorInfo?.componentStack}
                </pre>
              </details>
            )}

            {/* Actions */}
            <div className="flex flex-col gap-3">
              <button
                onClick={this.handleReset}
                className="w-full py-4 px-6 rounded-2xl bg-primary text-primary-foreground font-semibold flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
              >
                <RefreshCw className="w-5 h-5" />
                Try Again
              </button>

              <button
                onClick={this.handleGoHome}
                className="w-full py-3 px-6 rounded-xl bg-secondary text-secondary-foreground font-medium flex items-center justify-center gap-2 hover:bg-secondary/80 transition-colors"
              >
                <Home className="w-4 h-4" />
                Go Home
              </button>

              <button
                onClick={this.handleReload}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Reload page
              </button>
            </div>

            {/* Friendly message for kids */}
            <div className="pt-4 border-t border-border">
              <p className="text-sm text-muted-foreground">
                🌟 It's okay! Even apps need a little help sometimes.
              </p>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
