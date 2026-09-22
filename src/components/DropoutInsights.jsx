import { useMemo, useState } from 'react'
import {
  averageDropoutRate,
  buildDropoutRows,
  worstRow,
  formatDuration,
  typeLabel,
  typesIn,
} from '../utils/dropout'
import { ArrowDownIcon, ArrowUpIcon, SearchIcon, SortIcon } from './Icons'

/** Shown on every surface that marks the worst question, so the red tint is
 *  never the only thing saying so. */
function WorstBadge() {
  return (
    <span className="inline-flex items-center gap-1 rounded-full border border-crit/25 bg-crit-tint px-1.5 py-0.5 text-[10px] font-semibold whitespace-nowrap text-crit-ink">
      <span className="size-1.5 rounded-full bg-crit" aria-hidden="true" />
      Biggest drop-off
    </span>
  )
}

function Field({ label, value }) {
  return (
    <div>
      <dt className="eyebrow">{label}</dt>
      <dd className="mt-0.5 text-[13px] font-medium tabnum">{value}</dd>
    </div>
  )
}

const n = (v) => v.toLocaleString('en-US')
const pctText = (v) => `${v.toFixed(1)}%`

/**
 * Columns are declared once: header text, alignment, and the value each one
 * sorts on. Numeric columns open descending — the interesting end first.
 */
const COLUMNS = [
  { id: 'question', label: 'Survey question', sort: (r) => r.order },
  { id: 'type', label: 'Type', sort: (r) => r.typeLabel },
  { id: 'reached', label: 'Reached', align: 'right', numeric: true, sort: (r) => r.reached },
  { id: 'dropped', label: 'Dropped', align: 'right', numeric: true, sort: (r) => r.dropped },
  { id: 'rate', label: 'Dropout rate', align: 'right', numeric: true, sort: (r) => r.dropoutRate },
  {
    id: 'completion',
    label: 'Completion rate',
    align: 'right',
    numeric: true,
    sort: (r) => r.completionRate,
  },
  {
    id: 'gain',
    label: 'Potential completion gain',
    align: 'right',
    numeric: true,
    sort: (r) => r.completionGainPts,
  },
  { id: 'time', label: 'Avg. time', align: 'right', numeric: true, sort: (r) => r.avgSeconds },
]

function SortableHeader({ column, sort, onSort }) {
  const active = sort.id === column.id
  const Icon = !active ? SortIcon : sort.dir === 'asc' ? ArrowUpIcon : ArrowDownIcon

  return (
    <button
      type="button"
      onClick={() => onSort(column)}
      className={`group/sort inline-flex max-w-full cursor-pointer items-center gap-1 rounded-[4px] tracking-[0.06em] uppercase transition-colors hover:text-ink ${
        column.align === 'right' ? 'flex-row-reverse' : ''
      } ${active ? 'text-ink' : ''}`}
    >
      <span className="text-left">
        {column.label}
        {column.note && (
          <span className="block text-[9.5px] font-medium tracking-normal normal-case opacity-80">
            {column.note}
          </span>
        )}
      </span>
      <Icon
        width={11}
        height={11}
        className={`shrink-0 transition-opacity ${
          active ? 'opacity-100' : 'opacity-0 group-hover/sort:opacity-60'
        }`}
      />
    </button>
  )
}

export default function DropoutInsights({ campaign }) {
  const [sort, setSort] = useState({ id: 'question', dir: 'asc' })
  const [query, setQuery] = useState('')
  const [type, setType] = useState('all')

  const rows = useMemo(() => buildDropoutRows(campaign), [campaign])
  const worst = worstRow(rows)
  const m = campaign.metrics.current
  const maxRate = Math.max(...rows.map((r) => r.dropoutRate))
  const average = averageDropoutRate(rows)
  const types = useMemo(() => typesIn(rows), [rows])

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase()
    const filtered = rows.filter(
      (r) =>
        (type === 'all' || r.type === type) &&
        (!q || r.text.toLowerCase().includes(q) || `q${r.order}`.includes(q)),
    )

    const column = COLUMNS.find((c) => c.id === sort.id)
    if (!column?.sort) return filtered

    const dir = sort.dir === 'asc' ? 1 : -1
    return [...filtered].sort((a, b) => {
      const av = column.sort(a)
      const bv = column.sort(b)
      if (av === bv) return a.order - b.order
      return (av > bv ? 1 : -1) * dir
    })
  }, [rows, query, sort, type])

  const onSort = (column) => {
    setSort((cur) =>
      cur.id === column.id
        ? { id: column.id, dir: cur.dir === 'asc' ? 'desc' : 'asc' }
        : { id: column.id, dir: column.numeric ? 'desc' : 'asc' },
    )
  }

  const isFiltered = query.trim() !== '' || type !== 'all'
  const reset = () => {
    setQuery('')
    setType('all')
  }

  return (
    <section className="card mb-4 overflow-hidden">
      <div className="card-head">
        <div>
          <div className="eyebrow">Survey dropout</div>
          <h2 className="mt-1 text-[15px] font-semibold tracking-tight">
            Dropout by question
          </h2>
          <p className="mt-0.5 text-[12px] text-ink-muted">
            {n(m.incomplete)} of {n(m.respondents)} respondents left before
            finishing. Survey average {average.toFixed(1)}% per question, marked
            on each bar.
          </p>
        </div>
      </div>

      {/* Filters sit in one row directly above the data they scope */}
      <div className="flex flex-wrap items-center gap-2 border-b border-line bg-surface-2/60 px-4 py-2.5 sm:px-5">
        <div className="relative w-full sm:w-60">
          <SearchIcon
            width={14}
            height={14}
            className="pointer-events-none absolute top-1/2 left-2.5 -translate-y-1/2 text-ink-muted"
          />
          <input
            type="search"
            className="input"
            placeholder="Filter questions…"
            aria-label="Filter questions by text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-1.5">
          <label htmlFor="filter-type" className="eyebrow">
            Type
          </label>
          <select
            id="filter-type"
            className="rounded-control border border-line bg-surface px-2 py-1.5 text-[12.5px] text-ink focus:border-brand focus:outline-none"
            value={type}
            onChange={(e) => setType(e.target.value)}
          >
            <option value="all">All types</option>
            {types.map((t) => (
              <option key={t} value={t}>
                {typeLabel(t)}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-1.5 xl:hidden">
          <label htmlFor="sort-questions" className="eyebrow">
            Sort
          </label>
          <select
            id="sort-questions"
            className="rounded-control border border-line bg-surface px-2 py-1.5 text-[12.5px] text-ink focus:border-brand focus:outline-none"
            value={sort.id}
            onChange={(e) => {
              const column = COLUMNS.find((c) => c.id === e.target.value)
              setSort({ id: column.id, dir: column.numeric ? 'desc' : 'asc' })
            }}
          >
            {COLUMNS.map((c) => (
              <option key={c.id} value={c.id}>
                {c.label}
              </option>
            ))}
          </select>
          <button
            type="button"
            className="btn btn-secondary btn-icon"
            aria-label={`Sorted ${sort.dir === 'asc' ? 'ascending' : 'descending'}. Reverse the order.`}
            onClick={() =>
              setSort((c) => ({ ...c, dir: c.dir === 'asc' ? 'desc' : 'asc' }))
            }
          >
            {sort.dir === 'asc' ? (
              <ArrowUpIcon width={13} height={13} />
            ) : (
              <ArrowDownIcon width={13} height={13} />
            )}
          </button>
        </div>

        <div className="ml-auto flex items-center gap-2 text-[11.5px] text-ink-muted">
          <span aria-live="polite" className="tabnum">
            {visible.length} of {rows.length} questions
          </span>
          {isFiltered && (
            <button type="button" className="btn btn-ghost px-2 py-1" onClick={reset}>
              Reset
            </button>
          )}
        </div>
      </div>

      <div className="hidden overflow-x-auto xl:block">
        <table className="w-full min-w-[1010px] border-collapse text-[12.5px]">
          <caption className="sr-only">
            Dropout by question for {campaign.name}, sorted by{' '}
            {COLUMNS.find((c) => c.id === sort.id)?.label} {sort.dir}ending
          </caption>

          <thead>
            <tr className="border-b border-line bg-surface-2">
              {COLUMNS.map((column) => {
                const active = sort.id === column.id
                return (
                  <th
                    key={column.id}
                    scope="col"
                    aria-sort={
                      active
                        ? sort.dir === 'asc'
                          ? 'ascending'
                          : 'descending'
                        : column.sort
                          ? 'none'
                          : undefined
                    }
                    className={`px-3 py-2 align-bottom text-[10px] leading-tight font-semibold tracking-[0.06em] text-ink-muted uppercase ${
                      column.align === 'right' ? 'text-right' : 'text-left'
                    } ${
                      column.id === 'question'
                        ? 'sticky left-0 z-20 min-w-[270px] bg-surface-2'
                        : ''
                    } ${column.id === 'rate' ? 'min-w-[120px]' : ''} ${
                      column.id === 'gain' ? 'min-w-[124px]' : ''
                    }`}
                  >
                    <SortableHeader column={column} sort={sort} onSort={onSort} />
                  </th>
                )
              })}
            </tr>
          </thead>

          <tbody>
            {visible.length === 0 && (
              <tr>
                <td colSpan={COLUMNS.length} className="px-4 py-10 text-center">
                  <p className="text-[13px] font-semibold">No questions match</p>
                  <p className="mt-1 text-[12px] text-ink-muted">
                    No question in this campaign matches that search.
                  </p>
                  <button type="button" className="btn btn-secondary mt-3" onClick={reset}>
                    Clear search
                  </button>
                </td>
              </tr>
            )}

            {visible.map((r) => {
              const isWorst = r.id === worst.id

              // The sticky first cell carries the row's own background, or it
              // would go transparent over the scrolled content beneath it.
              const rowBg = isWorst
                ? 'bg-crit-tint/60 group-hover:bg-crit-tint'
                : 'bg-surface group-hover:bg-surface-2'

              return (
                <tr
                  key={r.id}
                  className={`group border-b border-line-soft transition-colors ${
                    isWorst ? 'bg-crit-tint/60 hover:bg-crit-tint' : 'hover:bg-surface-2'
                  }`}
                >
                  <th
                    scope="row"
                    className={`sticky left-0 z-10 px-3 py-2.5 text-left align-middle font-normal transition-colors after:absolute after:inset-y-0 after:right-0 after:w-px after:bg-line ${rowBg}`}
                  >
                    <div className="flex max-w-[330px] items-baseline gap-2">
                      <span className="text-[10.5px] font-semibold text-ink-muted tabnum">
                        Q{r.order}
                      </span>
                      <span className="leading-snug">{r.text}</span>
                    </div>
                    {isWorst && (
                      <div className="mt-1.5 pl-[26px]">
                        <WorstBadge />
                      </div>
                    )}
                  </th>

                  <td className="px-3 py-2.5 align-middle">
                    <span className="inline-block rounded-[5px] border border-line bg-surface-2 px-1.5 py-0.5 text-[10.5px] whitespace-nowrap text-ink-soft">
                      {r.typeLabel}
                    </span>
                  </td>

                  <td className="px-3 py-2.5 text-right align-middle tabnum">
                    {n(r.reached)}
                  </td>
                  <td className="px-3 py-2.5 text-right align-middle tabnum">
                    {n(r.dropped)}
                  </td>

                  <td className="px-3 py-2.5 text-right align-middle">
                    <div className="font-semibold tabnum">{pctText(r.dropoutRate)}</div>
                    {/* Magnitude bar — one hue, a lighter step of it as track */}
                    <div
                      className="relative mt-1 ml-auto h-1 w-20 overflow-hidden rounded-sm bg-track"
                      aria-hidden="true"
                    >
                      <div
                        className="h-1 rounded-sm bg-series-1"
                        style={{ width: `${(r.dropoutRate / maxRate) * 100}%` }}
                      />
                      {/* Survey average, so every row reads against the baseline */}
                      <span
                        className="absolute inset-y-0 w-px bg-ink-faint"
                        style={{ left: `${(average / maxRate) * 100}%` }}
                      />
                    </div>
                  </td>

                  <td className="px-3 py-2.5 text-right align-middle tabnum">
                    {pctText(r.completionRate)}
                  </td>
                  <td className="px-3 py-2.5 text-right align-middle">
                    <div className="font-semibold text-brand-ink tabnum">
                      +{r.completionGainPts.toFixed(1)}%
                    </div>
                    <div className="text-[10.5px] text-ink-muted tabnum">
                      → {r.projectedCompletionRate.toFixed(1)}%
                    </div>
                  </td>

                  <td className="px-3 py-2.5 text-right align-middle tabnum">
                    {formatDuration(r.avgSeconds)}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {/* Below lg the table's 1010px minimum would force a horizontal scroll
          that pushes every metric off a phone screen, so the same rows are
          dealt out as cards. Identical data, one column. */}
      <ul className="divide-y divide-line-soft xl:hidden">
        {visible.length === 0 && (
          <li className="px-4 py-10 text-center">
            <p className="text-[13px] font-semibold">No questions match</p>
            <p className="mt-1 text-[12px] text-ink-muted">
              No question in this campaign matches that search.
            </p>
            <button type="button" className="btn btn-secondary mt-3" onClick={reset}>
              Clear search
            </button>
          </li>
        )}

        {visible.map((r) => {
          const isWorst = r.id === worst.id
          return (
            <li
              key={r.id}
              className={`px-4 py-3.5 ${isWorst ? 'bg-crit-tint/50' : ''}`}
            >
              <div className="flex items-start gap-2">
                <span className="mt-px shrink-0 text-[10.5px] font-semibold text-ink-muted tabnum">
                  Q{r.order}
                </span>
                <p className="flex-1 text-[13px] leading-snug">{r.text}</p>
              </div>

              <div className="mt-2 flex flex-wrap items-center gap-1.5 pl-[26px]">
                <span className="inline-block rounded-[5px] border border-line bg-surface-2 px-1.5 py-0.5 text-[10.5px] whitespace-nowrap text-ink-soft">
                  {r.typeLabel}
                </span>
                {isWorst && <WorstBadge />}
              </div>

              {/* Dropout rate leads the card — it is what the panel is about */}
              <div className="mt-3">
                <div className="flex items-baseline justify-between gap-2">
                  <span className="eyebrow">Dropout rate</span>
                  <span className="text-[15px] leading-none font-semibold tabnum">
                    {pctText(r.dropoutRate)}
                  </span>
                </div>
                <div
                  className="relative mt-1.5 h-1.5 w-full overflow-hidden rounded-sm bg-track"
                  aria-hidden="true"
                >
                  <div
                    className="h-1.5 rounded-sm bg-series-1"
                    style={{ width: `${(r.dropoutRate / maxRate) * 100}%` }}
                  />
                  <span
                    className="absolute inset-y-0 w-px bg-ink-faint"
                    style={{ left: `${(average / maxRate) * 100}%` }}
                  />
                </div>
              </div>

              <dl className="mt-3 grid grid-cols-2 gap-x-4 gap-y-2.5">
                <Field label="Reached" value={n(r.reached)} />
                <Field label="Dropped" value={n(r.dropped)} />
                <Field label="Completion rate" value={pctText(r.completionRate)} />
                <Field label="Avg. time" value={formatDuration(r.avgSeconds)} />
                <div className="col-span-2">
                  <dt className="eyebrow">Potential completion gain</dt>
                  <dd className="mt-0.5 flex flex-wrap items-baseline gap-1.5">
                    <span className="text-[13px] font-semibold text-brand-ink tabnum">
                      +{r.completionGainPts.toFixed(1)}%
                    </span>
                    <span className="text-[11px] text-ink-muted tabnum">
                      → {r.projectedCompletionRate.toFixed(1)}% completion
                    </span>
                  </dd>
                </div>
              </dl>
            </li>
          )
        })}
      </ul>

      <p className="border-t border-line px-4 py-2.5 text-[11px] text-ink-muted sm:px-5">
        Potential completion gain is a theoretical upper bound: it assumes
        nobody drops at that question and every other question behaves exactly
        as it does today. It is a ceiling on the opportunity, not a forecast.
      </p>
    </section>
  )
}
