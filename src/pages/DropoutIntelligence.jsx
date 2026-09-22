import AnalyticsTabs from '../components/AnalyticsTabs'
import DropoutInsights from '../components/DropoutInsights'
import HeadlineMetrics from '../components/HeadlineMetrics'
import { DateFilter, ExportMenu } from '../components/HeaderControls'
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

      <AnalyticsTabs />

      <div className="mx-auto flex max-w-[1320px] flex-wrap items-center gap-2 px-4 pt-4 sm:px-6">
        <DateFilter />
        <ExportMenu />
      </div>


      <main id="main" className="mx-auto max-w-[1320px] px-4 py-5 sm:px-6">
        <HeadlineMetrics campaign={campaign} />

        <DropoutInsights campaign={campaign} />
      </main>
    </div>
  )
}
