"use client";

import * as React from "react";
import { AlertCircle, RefreshCw } from "lucide-react";

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ComponentType<{ error: Error; reset: () => void }>;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

/**
 * Production-ready Error Boundary component.
 * Catches React component errors and displays a fallback UI.
 *
 * Usage:
 * ```tsx
 * <ErrorBoundary>
 *   <YourComponent />
 * </ErrorBoundary>
 * ```
 *
 * With custom fallback:
 * ```tsx
 * <ErrorBoundary fallback={CustomErrorComponent}>
 *   <YourComponent />
 * </ErrorBoundary>
 * ```
 */
export class ErrorBoundary extends React.Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Log error to console in development
    console.error("ErrorBoundary caught an error:", error, errorInfo);

    // Call optional error handler (for error tracking services like Sentry)
    this.props.onError?.(error, errorInfo);
  }

  reset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError && this.state.error) {
      const FallbackComponent = this.props.fallback;

      if (FallbackComponent) {
        return (
          <FallbackComponent error={this.state.error} reset={this.reset} />
        );
      }

      return (
        <DefaultErrorFallback error={this.state.error} reset={this.reset} />
      );
    }

    return this.props.children;
  }
}

interface ErrorFallbackProps {
  error: Error;
  reset: () => void;
}

/**
 * Default error fallback UI
 */
function DefaultErrorFallback({ error, reset }: ErrorFallbackProps) {
  return (
    <div className="flex min-h-100 w-full items-center justify-center p-6">
      <div className="w-full max-w-md space-y-6 rounded-xl border border-red-200 bg-red-50 p-8 text-center dark:border-red-800 dark:bg-red-900/20">
        <div className="flex justify-center">
          <div className="rounded-full bg-red-100 p-3 dark:bg-red-900/50">
            <AlertCircle className="h-8 w-8 text-red-600 dark:text-red-400" />
          </div>
        </div>

        <div className="space-y-2">
          <h2 className="text-xl font-semibold text-red-900 dark:text-red-100">
            Something went wrong
          </h2>
          <p className="text-sm text-red-700 dark:text-red-300">
            We encountered an unexpected error. Please try refreshing the page.
          </p>
        </div>

        {process.env.NODE_ENV === "development" && (
          <details className="mt-4 rounded-lg bg-red-100 p-4 text-left text-xs dark:bg-red-900/30">
            <summary className="cursor-pointer font-semibold text-red-900 dark:text-red-100">
              Error Details (Development Only)
            </summary>
            <pre className="mt-2 overflow-auto whitespace-pre-wrap wrap-break-word text-red-800 dark:text-red-200">
              {error.message}
              {"\n\n"}
              {error.stack}
            </pre>
          </details>
        )}

        <button
          onClick={reset}
          className="inline-flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 dark:bg-red-700 dark:hover:bg-red-600"
        >
          <RefreshCw className="h-4 w-4" />
          Try Again
        </button>
      </div>
    </div>
  );
}

/**
 * Compact error fallback for smaller UI components
 */
export function CompactErrorFallback({ error, reset }: ErrorFallbackProps) {
  return (
    <div className="flex w-full items-center gap-3 rounded-lg border border-red-200 bg-red-50 p-4 dark:border-red-800 dark:bg-red-900/20">
      <AlertCircle className="h-5 w-5 shrink-0 text-red-600 dark:text-red-400" />
      <div className="flex-1 space-y-1">
        <p className="text-sm font-medium text-red-900 dark:text-red-100">
          Error loading component
        </p>
        <p className="text-xs text-red-700 dark:text-red-300">
          {error.message}
        </p>
      </div>
      <button
        onClick={reset}
        className="shrink-0 rounded px-3 py-1 text-xs font-medium text-red-600 transition-colors hover:bg-red-100 dark:text-red-400 dark:hover:bg-red-900/50"
      >
        Retry
      </button>
    </div>
  );
}
