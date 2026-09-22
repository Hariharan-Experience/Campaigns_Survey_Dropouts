import { useApp } from '../context/AppContext'
import { campaigns } from '../data/mockData'
import { DATE_FILTERS, formatRange } from '../utils/dateFilter'
import { exportDropoutData, exportFullAnalysis } from '../utils/csv'
import { Menu, MenuItem } from './Menu'
import { useToast } from './Toast'
import { CalendarIcon, DownloadIcon, MegaphoneIcon } from './Icons'

const n = (v) => v.toLocaleString('en-US')

export function CampaignSelector() {
  const { campaignId, selectCampaign, campaign } = useApp()

  return (
    <Menu
      label="Select campaign"
      widthClass="w-[19rem]"
      heading="Campaign"
      triggerClassName="btn btn-secondary max-w-[15rem] sm:max-w-[17rem]"
      trigger={
        <>
          <MegaphoneIcon width={14} height={14} className="shrink-0 text-brand" />
          <span className="truncate font-semibold">{campaign.name}</span>
        </>
      }
    >
      {campaigns.map((c) => (
        <MenuItem
          key={c.id}
          selected={c.id === campaignId}
          hint={`${n(c.metrics.current.respondents)} respondents · ${c.period.current.label}`}
          onSelect={() => selectCampaign(c.id)}
        >
          {c.name}
        </MenuItem>
      ))}
    </Menu>
  )
}

export function DateFilter() {
  const { filterId, setFilterId, range } = useApp()
  const active = DATE_FILTERS.find((f) => f.id === filterId)

  return (
    <Menu
      label="Date range"
      heading="Date range"
      trigger={
        <>
          <CalendarIcon width={14} height={14} className="shrink-0 text-ink-muted" />
          <span className="font-semibold">{active?.label}</span>
          <span className="ml-1 hidden border-l border-line pl-2 font-normal text-ink-muted xl:inline">
            {formatRange(range)}
          </span>
        </>
      }
    >
      {DATE_FILTERS.map((f) => (
        <MenuItem
          key={f.id}
          selected={f.id === filterId}
          onSelect={() => setFilterId(f.id)}
        >
          {f.label}
        </MenuItem>
      ))}
    </Menu>
  )
}

export function ExportMenu() {
  const { campaign, rows, range } = useApp()
  const { toast } = useToast()

  const items = [
    {
      id: 'dropout',
      label: 'Dropout data',
      hint: `${rows.length} questions`,
      enabled: true,
      done: `${rows.length} question rows for ${campaign.name}.`,
      run: () => exportDropoutData(campaign, rows, range),
    },
    {
      id: 'full',
      label: 'Full analysis',
      hint: 'Dropout metrics with period comparison',
      enabled: true,
      done: 'Every question with its rates, change and answer time.',
      run: () => exportFullAnalysis(campaign, { rows, themes: null, range }),
    },
  ]

  const download = (item) => {
    try {
      item.run()
      toast({
        tone: 'success',
        title: `${item.label} exported`,
        description: item.done,
      })
    } catch (error) {
      toast({
        tone: 'error',
        title: 'Export failed',
        description: error.message,
        duration: 0,
      })
    }
  }

  return (
    <Menu
      label="Export data"
      align="end"
      widthClass="w-[17rem]"
      heading="Download CSV"
      trigger={
        <>
          <DownloadIcon width={14} height={14} className="shrink-0 text-ink-muted" />
          <span className="font-semibold">Export</span>
        </>
      }
    >
      {items.map((item) => (
        <MenuItem
          key={item.id}
          hint={item.hint}
          disabled={!item.enabled}
          onSelect={() => download(item)}
        >
          {item.label}
        </MenuItem>
      ))}
    </Menu>
  )
}
