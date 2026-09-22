/**
 * The resting state of a panel: an icon, a sentence that says what will
 * appear here, and the action that fills it.
 */
export default function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  tone = 'neutral',
}) {
  const toneClass =
    tone === 'brand'
      ? 'bg-brand-tint text-brand-ink'
      : 'bg-surface-3 text-ink-muted'

  return (
    <div className="flex flex-col items-center gap-2 rounded-control border border-dashed border-line bg-surface-2 px-6 py-10 text-center">
      {Icon && (
        <span className={`mb-1 grid size-9 place-items-center rounded-full ${toneClass}`}>
          <Icon width={17} height={17} />
        </span>
      )}
      <p className="text-[13px] font-semibold text-ink">{title}</p>
      {description && (
        <p className="max-w-[56ch] text-[12.5px] text-ink-muted">{description}</p>
      )}
      {action && <div className="mt-2">{action}</div>}
    </div>
  )
}
