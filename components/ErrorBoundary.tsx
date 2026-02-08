'use client'

import { Component, ReactNode } from 'react'

interface Props {
  children: ReactNode
  fallback?: ReactNode
  onError?: (error: Error) => void
}

interface State {
  hasError: boolean
}

export default class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(): State {
    return { hasError: true }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Log detailed error information
    const errorDetails = {
      message: error?.message || 'Unknown error',
      name: error?.name || 'Error',
      stack: error?.stack || 'No stack trace',
      componentStack: errorInfo?.componentStack || 'No component stack',
      errorString: String(error),
      errorKeys: error ? Object.keys(error) : [],
    }
    console.error('ErrorBoundary caught an error:', errorDetails)
    
    // Call optional error callback
    if (this.props.onError) {
      this.props.onError(error)
    }
    
    // Don't re-throw, just log and show fallback
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || <div>Something went wrong.</div>
    }

    return this.props.children
  }
}
