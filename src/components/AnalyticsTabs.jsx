import {
  ChartIcon,
  DocIcon,
  InboxIcon,
  MessageIcon,
  AlertIcon,
  FunnelIcon,
} from './Icons'

/**
 * The Campaign Analytics tab strip.
 *
 * Only "Dropout Analysis" is ours; the rest name the sibling views this
 * feature sits beside, so the pane reads as part of that page rather than a
 * standalone app. They carry no href — the host app owns that routing.
 */
const TABS = [
  { id: 'overview', label: 'Overview', Icon: InboxIcon },
  { id: 'questions', label: 'Question Summary', Icon: DocIcon },
  { id: 'reviews', label: 'Reviews', Icon: MessageIcon },
  { id: 'incomplete', label: 'Incomplete Survey', Icon: ChartIcon },
  { id: 'expired', label: 'Expired Survey', Icon: AlertIcon },
  { id: 'dropout', label: 'Dropout Analysis', Icon: FunnelIcon, current: true },
]

export default function AnalyticsTabs() {
  return (
    <div className="border-b border-line bg-surface">
      <div className="mx-auto flex max-w-[1320px] flex-wrap items-center gap-x-1 gap-y-2 px-4 sm:px-6">
        <nav aria-label="Campaign analytics sections" className="flex w-full min-w-0 overflow-x-auto sm:w-auto sm:flex-1">
          <ul className="flex items-stretch gap-x-1">
            {TABS.map(({ id, label, Icon, current }) => (
              <li key={id}>
                <span
                  aria-current={current ? 'page' : undefined}
                  className={`flex items-center gap-2 border-b-[3px] px-3 py-3.5 text-[14px] whitespace-nowrap transition-colors ${
                    current
                      ? 'border-brand font-semibold text-brand'
                      : 'border-transparent text-ink-muted'
                  }`}
                >
                  <Icon width={17} height={17} className="shrink-0" />
                  {label}
                </span>
              </li>
            ))}
          </ul>
        </nav>

        <button type="button" className="btn btn-on mb-3 px-3 py-2 text-[13.5px] sm:my-2 sm:mb-2">
          Survey Campaign
        </button>
      </div>
    </div>
  )
}
