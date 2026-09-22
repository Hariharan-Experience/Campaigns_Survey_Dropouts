import DropoutInsights from '../components/DropoutInsights'
import HeadlineMetrics from '../components/HeadlineMetrics'
import { DateFilter, ExportMenu } from '../components/HeaderControls'
import { FunnelIcon } from '../components/Icons'
import { useApp } from '../context/AppContext'

export default function DropoutIntelligence() {
  const { campaign } = useApp()

  return (
    <div className="min-h-screen">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:rounded-control focus:bg-surface focus:px-3 focus:py-2 focus:shadow-e3"
      >
        Skip to content
      </a>

      <header className="sticky top-0 z-40 border-b border-line bg-surface/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-[1560px] flex-wrap items-center justify-between gap-x-4 gap-y-2.5 px-4 py-2.5 sm:px-6">
          <div className="flex min-w-0 items-center gap-2.5">
            <span className="grid size-7 shrink-0 place-items-center rounded-[7px] bg-brand text-on-brand">
              <FunnelIcon width={15} height={15} />
            </span>
            <div className="min-w-0">
              <h1 className="truncate text-[13.5px] leading-tight font-semibold">
                Survey Dropout Intelligence
              </h1>
              <p className="truncate text-[11.5px] text-ink-muted">
                {campaign.owner} · {campaign.industry}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <DateFilter />
            <ExportMenu />
          </div>
        </div>
      </header>

      <main id="main" className="mx-auto max-w-[1560px] px-4 py-5 sm:px-6">
        <HeadlineMetrics campaign={campaign} />

        <DropoutInsights campaign={campaign} />
      </main>
    </div>
  )
}
