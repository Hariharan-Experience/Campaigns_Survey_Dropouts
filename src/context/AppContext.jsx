import { createContext, useCallback, useContext, useMemo, useState } from 'react'
import { getCampaign, DEFAULT_CAMPAIGN_ID } from '../data/mockData'
import { buildDropoutRows } from '../utils/dropout'
import {
  DEFAULT_FILTER,
  resolveRange,
  filterResponses,
} from '../utils/dateFilter'

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
  const [selectedId, setSelectedId] = useState(null)

  // Local, unsaved question rewrites from "Use suggested text".
  const [drafts, setDrafts] = useState({})

  // AI results are held here so the header's export menu can reach them.
  const [results, setResults] = useState({ themes: null })

  const range = useMemo(() => resolveRange(filterId), [filterId])
  const rows = useMemo(() => buildDropoutRows(campaign), [campaign])
  const scopedResponses = useMemo(
    () => filterResponses(campaign, range),
    [campaign, range],
  )

  const setDraft = useCallback((questionId, text) => {
    setDrafts((d) => ({ ...d, [questionId]: text }))
  }, [])

  const clearDraft = useCallback((questionId) => {
    setDrafts((d) => {
      const next = { ...d }
      delete next[questionId]
      return next
    })
  }, [])

  const draftText = useCallback(
    (question) => drafts[question.id] ?? question.text,
    [drafts],
  )

  const setResult = useCallback((key, value) => {
    setResults((r) => ({ ...r, [key]: value }))
  }, [])

  const toggleSelected = useCallback((id) => {
    setSelectedId((cur) => (cur === id ? null : id))
  }, [])

  // Switching campaign invalidates the selection, drafts and AI results —
  // they all belong to the campaign that produced them.
  const selectCampaign = useCallback((id) => {
    setCampaignId(id)
    setSelectedId(null)
    setDrafts({})
    setResults({ themes: null })
  }, [])

  const value = {
    campaign,
    campaignId,
    selectCampaign,
    rows,
    range,
    filterId,
    setFilterId,
    scopedResponses,
    selectedId,
    setSelectedId,
    toggleSelected,
    drafts,
    setDraft,
    clearDraft,
    draftText,
    results,
    setResult,
  }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}
