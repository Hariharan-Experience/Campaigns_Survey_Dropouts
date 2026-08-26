import { useCallback, useState } from 'react'

/**
 * Run a one-shot async action and track its state.
 * Keeps the previous result visible while a re-run is in flight.
 */
export function useAsyncAction(fn) {
  const [state, setState] = useState({
    status: 'idle',
    data: null,
    error: null,
  })

  const run = useCallback(
    async (...args) => {
      setState((s) => ({ ...s, status: 'loading', error: null }))
      try {
        const data = await fn(...args)
        setState({ status: 'done', data, error: null })
        return data
      } catch (error) {
        setState((s) => ({ ...s, status: 'error', error: error.message }))
        return null
      }
    },
    [fn],
  )

  const reset = useCallback(
    () => setState({ status: 'idle', data: null, error: null }),
    [],
  )

  return { ...state, run, reset, isLoading: state.status === 'loading' }
}
