import DropoutInsights from '../components/DropoutInsights'
import ResponseIntelligence from '../components/ResponseIntelligence'
import {
  CampaignSelector,
  DateFilter,
  ExportMenu,
} from '../components/HeaderControls'
import { useApp } from '../context/AppContext'
import { formatRange } from '../utils/dateFilter'

const n = (v) => v.toLocaleString('en-US')

export default function DropoutIntelligence() {
  const { campaign, range, scopedResponses, selectedId, toggleSelected } =
    useApp()
  const m = campaign.metrics.current

  return (
    <div className="container-xxl py-4">
      <div className="d-flex flex-wrap justify-content-between align-items-start gap-3 mb-4">
        <div>
          <h1 className="h4 mb-1">Survey Dropout &amp; Response Intelligence</h1>
          <p className="text-muted small mb-0">
            {campaign.name} · {n(m.incomplete)} incomplete of{' '}
            {n(m.respondents)} · responses filtered to {formatRange(range)}
          </p>
        </div>
        <div className="d-flex flex-wrap align-items-center gap-2">
          <CampaignSelector />
          <DateFilter />
          <ExportMenu />
        </div>
      </div>

      <DropoutInsights
        campaign={campaign}
        selectedQuestionId={selectedId}
        onAnalyze={(row) => toggleSelected(row.id)}
      />

      <ResponseIntelligence
        campaign={campaign}
        responses={scopedResponses}
        range={range}
      />
    </div>
  )
}
