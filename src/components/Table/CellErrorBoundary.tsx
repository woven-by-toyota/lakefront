import { Component, ReactNode } from 'react';

interface CellErrorBoundaryProps {
  children: ReactNode;
  onError?: () => void;
}

interface CellErrorBoundaryState {
  hasError: boolean;
}

/**
 * Error Boundary for table cells.
 * Note: Error Boundaries must be class components as there are no hook equivalents
 * for getDerivedStateFromError and componentDidCatch lifecycle methods.
 *
 * @see https://react.dev/reference/react/Component#catching-rendering-errors-with-an-error-boundary
 */
class CellErrorBoundary extends Component<CellErrorBoundaryProps, CellErrorBoundaryState> {
  state: CellErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError(): CellErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    // Log error details for debugging
    console.error('Cell rendering error:', error, errorInfo);
    // Notify parent component
    this.props.onError?.();
  }

  render(): ReactNode {
    if (this.state.hasError) {
      return null;
    }

    return this.props.children;
  }
}

export default CellErrorBoundary;
