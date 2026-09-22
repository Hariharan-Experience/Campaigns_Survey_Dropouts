import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useId,
  useRef,
  useState,
} from 'react'
import { CheckIcon, ChevronDown } from './Icons'

const MenuContext = createContext(null)

/**
 * Dropdown menu with the keyboard contract a production app owes:
 * arrows move, Home/End jump, Escape and Tab close, focus opens on the
 * selected item and returns to the trigger on close.
 */
export function Menu({
  label,
  trigger,
  triggerClassName = 'btn btn-secondary',
  align = 'start',
  widthClass = '',
  heading,
  children,
}) {
  const [open, setOpen] = useState(false)
  const rootRef = useRef(null)
  const triggerRef = useRef(null)
  const listRef = useRef(null)
  const id = useId()

  const close = useCallback((refocus = true) => {
    setOpen(false)
    if (refocus) triggerRef.current?.focus()
  }, [])

  const items = useCallback(
    () =>
      Array.from(
        listRef.current?.querySelectorAll(
          '[role="menuitem"]:not(:disabled), [role="menuitemradio"]:not(:disabled)',
        ) ?? [],
      ),
    [],
  )

  useEffect(() => {
    if (!open) return

    const onPointerDown = (e) => {
      if (!rootRef.current?.contains(e.target)) setOpen(false)
    }
    const onKeyDown = (e) => {
      if (e.key === 'Escape') {
        e.stopPropagation()
        close()
      }
    }
    document.addEventListener('mousedown', onPointerDown)
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('mousedown', onPointerDown)
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [open, close])

  useEffect(() => {
    if (!open) return
    const list = items()
    const selected = list.find((el) => el.dataset.selected === 'true')
    ;(selected ?? list[0])?.focus()
  }, [open, items])

  const onListKeyDown = (e) => {
    const list = items()
    if (!list.length) return
    const i = list.indexOf(document.activeElement)

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault()
        list[(i + 1) % list.length].focus()
        break
      case 'ArrowUp':
        e.preventDefault()
        list[(i - 1 + list.length) % list.length].focus()
        break
      case 'Home':
        e.preventDefault()
        list[0].focus()
        break
      case 'End':
        e.preventDefault()
        list[list.length - 1].focus()
        break
      case 'Tab':
        close(false)
        break
      default:
    }
  }

  return (
    <div className="relative" ref={rootRef}>
      <button
        ref={triggerRef}
        type="button"
        id={`${id}-trigger`}
        className={triggerClassName}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label={label}
        onClick={() => setOpen((o) => !o)}
        onKeyDown={(e) => {
          if (e.key === 'ArrowDown') {
            e.preventDefault()
            setOpen(true)
          }
        }}
      >
        {typeof trigger === 'function' ? trigger({ open }) : trigger}
        <ChevronDown
          width={13}
          height={13}
          className={`-mr-0.5 shrink-0 text-ink-muted transition-transform duration-150 ${
            open ? 'rotate-180' : ''
          }`}
        />
      </button>

      {open && (
        <MenuContext.Provider value={{ close }}>
          <div
            ref={listRef}
            role="menu"
            aria-labelledby={`${id}-trigger`}
            onKeyDown={onListKeyDown}
            className={`menu ${align === 'end' ? 'right-0' : 'left-0'} ${widthClass}`}
          >
            {heading && (
              <div className="eyebrow px-2.5 pt-1.5 pb-1" role="presentation">
                {heading}
              </div>
            )}
            {children}
          </div>
        </MenuContext.Provider>
      )}
    </div>
  )
}

export function MenuItem({ children, hint, selected, disabled = false, onSelect }) {
  const ctx = useContext(MenuContext)
  // A menu that tracks a current value exposes radios; a menu of actions
  // exposes plain items, which may not carry aria-checked.
  const choosable = typeof selected === 'boolean'

  return (
    <button
      type="button"
      role={choosable ? 'menuitemradio' : 'menuitem'}
      tabIndex={-1}
      disabled={disabled}
      data-selected={selected ? 'true' : undefined}
      aria-checked={choosable ? selected : undefined}
      className={`menu-item ${selected ? 'menu-item-on' : ''}`}
      onClick={() => {
        onSelect?.()
        ctx?.close()
      }}
    >
      <span className="flex items-center justify-between gap-2 font-medium">
        <span className={selected ? '' : 'text-ink'}>{children}</span>
        {selected && (
          <CheckIcon width={13} height={13} className="shrink-0 text-brand" />
        )}
      </span>
      {hint && <span className="text-[11px] text-ink-muted">{hint}</span>}
    </button>
  )
}
