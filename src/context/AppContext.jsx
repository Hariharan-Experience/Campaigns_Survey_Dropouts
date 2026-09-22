import { createContext, useCallback, useContext, useMemo, useState } from 'react'
import { getCampaign, DEFAULT_CAMPAIGN_ID } from '../data/mockData'
import { buildDropoutRows } from '../utils/dropout'
import { DEFAULT_FILTER, resolveRange } from '../utils/dateFilter'

const AppContext = createContext(null)

export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used inside <AppProvider>')
  return ctx
}

export function AppProvider({ children }) {
  const [campaignId, setCampaignId] = useState(DEFAULT_CAMPAIGN_ID)
  const campaign = getCampaign(campaignId)

  const [filterId, setFilterId] = useState(DEFAULT_FILTER)

  const range = useMemo(() => resolveRange(filterId), [filterId])
  const rows = useMemo(() => buildDropoutRows(campaign), [campaign])

  const selectCampaign = useCallback((id) => setCampaignId(id), [])

  const value = {
    campaign,
    campaignId,
    selectCampaign,
    rows,
    range,
    filterId,
    setFilterId,
  }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}
