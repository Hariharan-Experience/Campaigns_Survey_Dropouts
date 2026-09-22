import { useTheme } from '../utils/useTheme'
import { MonitorIcon, MoonIcon, SunIcon } from './Icons'

const OPTIONS = [
  { id: 'light', label: 'Light', Icon: SunIcon },
  { id: 'system', label: 'System', Icon: MonitorIcon },
  { id: 'dark', label: 'Dark', Icon: MoonIcon },
]

/** Three-way segmented control — explicit beats OS, and 'system' follows it. */
export default function ThemeToggle() {
  const { theme, setTheme } = useTheme()

  return (
    <div
      role="radiogroup"
      aria-label="Colour theme"
      className="inline-flex items-center gap-0.5 rounded-control border border-line bg-surface p-0.5 shadow-e1"
    >
      {OPTIONS.map(({ id, label, Icon }) => {
        const on = theme === id
        return (
          <button
            key={id}
            type="button"
            role="radio"
            aria-checked={on}
            aria-label={label}
            title={`${label} theme`}
            onClick={() => setTheme(id)}
            className={`grid size-6 place-items-center rounded-[5px] transition-colors ${
              on
                ? 'bg-brand-tint text-brand-ink'
                : 'text-ink-muted hover:bg-surface-2 hover:text-ink'
            }`}
          >
            <Icon width={14} height={14} />
          </button>
        )
      })}
    </div>
  )
}
