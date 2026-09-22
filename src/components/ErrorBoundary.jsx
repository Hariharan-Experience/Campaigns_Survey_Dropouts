import { Component } from 'react'
import { AlertIcon } from './Icons'

/**
 * Last line of defence: a render error shows a recoverable panel instead of
 * a blank page.
 */
export default class ErrorBoundary extends Component {
  state = { error: null }

  static getDerivedStateFromError(error) {
    return { error }
  }

  componentDidCatch(error, info) {
    console.error('Unhandled UI error', error, info)
  }

  render() {
    if (!this.state.error) return this.props.children

    return (
      <div className="flex min-h-screen items-center justify-center p-6">
        <div className="card max-w-lg p-6 text-center">
          <span className="mx-auto mb-3 grid size-10 place-items-center rounded-full bg-crit-tint text-crit-ink">
            <AlertIcon width={18} height={18} />
          </span>
          <h1 className="text-[15px] font-semibold">Something went wrong</h1>
          <p className="mt-1 text-[12.5px] text-ink-muted">
            This screen failed to render. Reloading usually clears it — if it
            does not, the detail below helps whoever picks up the ticket.
          </p>
          <pre className="mt-4 max-h-40 overflow-auto rounded-control border border-line bg-surface-2 p-3 text-left text-[11px] text-ink-soft">
            {String(this.state.error?.stack ?? this.state.error)}
          </pre>
          <button
            type="button"
            className="btn btn-primary mt-4"
            onClick={() => window.location.reload()}
          >
            Reload the page
          </button>
        </div>
      </div>
    )
  }
}
