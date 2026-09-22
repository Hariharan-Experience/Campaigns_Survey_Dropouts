import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import { AlertIcon, CheckCircleIcon, CloseIcon, InfoIcon } from './Icons'

const ToastContext = createContext(null)

export function useToast() {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast must be used inside <ToastProvider>')
  return ctx
}

const TONES = {
  success: { Icon: CheckCircleIcon, className: 'text-good-ink' },
  error: { Icon: AlertIcon, className: 'text-crit-ink' },
  info: { Icon: InfoIcon, className: 'text-brand-ink' },
}

function Toast({ toast, onDismiss }) {
  const { Icon, className } = TONES[toast.tone] ?? TONES.info
  const timer = useRef(null)

  useEffect(() => {
    if (toast.duration === 0) return undefined
    timer.current = setTimeout(() => onDismiss(toast.id), toast.duration)
    return () => clearTimeout(timer.current)
  }, [toast.id, toast.duration, onDismiss])

  return (
    <div
      role={toast.tone === 'error' ? 'alert' : 'status'}
      className="animate-toast pointer-events-auto flex w-[min(92vw,380px)] items-start gap-2.5 rounded-card border border-line bg-surface p-3 shadow-e3"
      onMouseEnter={() => clearTimeout(timer.current)}
      onMouseLeave={() => {
        if (toast.duration !== 0)
          timer.current = setTimeout(() => onDismiss(toast.id), toast.duration)
      }}
    >
      <Icon width={16} height={16} className={`mt-px shrink-0 ${className}`} />
      <div className="min-w-0 flex-1">
        <p className="text-[12.5px] font-semibold text-ink">{toast.title}</p>
        {toast.description && (
          <p className="mt-0.5 text-[12px] text-ink-muted">
            {toast.description}
          </p>
        )}
      </div>
      <button
        type="button"
        className="btn btn-ghost btn-icon -my-0.5 -mr-1"
        aria-label="Dismiss notification"
        onClick={() => onDismiss(toast.id)}
      >
        <CloseIcon width={13} height={13} />
      </button>
    </div>
  )
}

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])
  const nextId = useRef(0)

  const dismiss = useCallback((id) => {
    setToasts((list) => list.filter((t) => t.id !== id))
  }, [])

  const toast = useCallback((input) => {
    const id = ++nextId.current
    setToasts((list) => [
      // Three at a time is plenty; older ones drop off the top.
      ...list.slice(-2),
      { id, tone: 'info', duration: 5000, ...input },
    ])
    return id
  }, [])

  const value = useMemo(() => ({ toast, dismiss }), [toast, dismiss])

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div
        className="pointer-events-none fixed inset-x-0 bottom-0 z-[100] flex flex-col items-center gap-2 p-4 sm:items-end"
        aria-live="polite"
        aria-label="Notifications"
      >
        {toasts.map((t) => (
          <Toast key={t.id} toast={t} onDismiss={dismiss} />
        ))}
      </div>
    </ToastContext.Provider>
  )
}
