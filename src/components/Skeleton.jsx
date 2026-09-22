export function Skeleton({ className = '' }) {
  return <div className={`skeleton ${className}`} aria-hidden="true" />
}

/** Ragged last line, so a block of loading text reads as text. */
export function SkeletonText({ lines = 3, className = '' }) {
  return (
    <div className={`space-y-1.5 ${className}`} aria-hidden="true">
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          className={`h-3 ${i === lines - 1 ? 'w-[62%]' : 'w-full'}`}
        />
      ))}
    </div>
  )
}
