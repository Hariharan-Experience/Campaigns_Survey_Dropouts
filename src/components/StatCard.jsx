import './StatCard.css'

/**
 * Stat tile: label · value · delta vs a named period.
 * Delta color = direction × whether up is good, so "incomplete rose 17%"
 * reads red even though the arrow points up.
 */
export default function StatCard({
  label,
  value,
  suffix,
  delta,
  deltaSuffix = '%',
  goodDirection = 'up',
  note,
  emphasis = false,
}) {
  const hasDelta = typeof delta === 'number'
  const rose = hasDelta && delta > 0
  const flat = hasDelta && delta === 0
  const isGood =
    goodDirection === 'none' || flat
      ? null
      : goodDirection === 'up'
        ? rose
        : !rose

  const tone = isGood === null ? 'neutral' : isGood ? 'good' : 'bad'

  return (
    <div className={emphasis ? 'stat-card is-emphasis' : 'stat-card'}>
      <p className="stat-label">{label}</p>
      <p className="stat-value">
        {value}
        {suffix && <span className="stat-suffix">{suffix}</span>}
      </p>
      <div className="stat-foot">
        {hasDelta && (
          <span className={`stat-delta tone-${tone}`}>
            <span aria-hidden="true">{flat ? '→' : rose ? '↑' : '↓'}</span>
            {Math.abs(delta)}
            {deltaSuffix}
          </span>
        )}
        {note && <span className="stat-note">{note}</span>}
      </div>
    </div>
  )
}
