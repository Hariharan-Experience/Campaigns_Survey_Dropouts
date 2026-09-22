const base = {
  width: 18,
  height: 18,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.7,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  'aria-hidden': true,
}

export const GridIcon = (p) => (
  <svg {...base} {...p}>
    <rect x="3" y="3" width="7" height="7" rx="1.5" />
    <rect x="14" y="3" width="7" height="7" rx="1.5" />
    <rect x="3" y="14" width="7" height="7" rx="1.5" />
    <rect x="14" y="14" width="7" height="7" rx="1.5" />
  </svg>
)

export const MegaphoneIcon = (p) => (
  <svg {...base} {...p}>
    <path d="M3 11v2a1 1 0 0 0 1 1h3l6 4V6L7 10H4a1 1 0 0 0-1 1Z" />
    <path d="M17 9a3.5 3.5 0 0 1 0 6" />
  </svg>
)

export const ChartIcon = (p) => (
  <svg {...base} {...p}>
    <path d="M3 21h18" />
    <rect x="5" y="11" width="4" height="7" rx="1" />
    <rect x="12" y="6" width="4" height="12" rx="1" />
    <rect x="19" y="14" width="1" height="4" rx="0.5" />
  </svg>
)

export const UsersIcon = (p) => (
  <svg {...base} {...p}>
    <circle cx="9" cy="8" r="3.2" />
    <path d="M3 20a6 6 0 0 1 12 0" />
    <path d="M16 5.5a3.2 3.2 0 0 1 0 6" />
    <path d="M18 20a6 6 0 0 0-3-5.2" />
  </svg>
)

export const DocIcon = (p) => (
  <svg {...base} {...p}>
    <path d="M6 3h8l5 5v13a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1Z" />
    <path d="M14 3v5h5" />
    <path d="M9 13h6M9 17h4" />
  </svg>
)

export const CogIcon = (p) => (
  <svg {...base} {...p}>
    <circle cx="12" cy="12" r="3" />
    <path d="M12 2v3M12 19v3M4.2 4.2l2.1 2.1M17.7 17.7l2.1 2.1M2 12h3M19 12h3M4.2 19.8l2.1-2.1M17.7 6.3l2.1-2.1" />
  </svg>
)

export const ChevronRight = (p) => (
  <svg {...base} {...p}>
    <path d="m9 6 6 6-6 6" />
  </svg>
)

export const ArrowLeft = (p) => (
  <svg {...base} {...p}>
    <path d="M19 12H5m0 0 6-6m-6 6 6 6" />
  </svg>
)

export const FunnelIcon = (p) => (
  <svg {...base} {...p}>
    <path d="M3 5h18l-7 8v6l-4 2v-8L3 5Z" />
  </svg>
)

export const SparkIcon = (p) => (
  <svg {...base} {...p}>
    <path d="M12 3v4M12 17v4M3 12h4M17 12h4" />
    <path d="M12 8.5 13.6 12 12 15.5 10.4 12 12 8.5Z" />
  </svg>
)

export const DownloadIcon = (p) => (
  <svg {...base} {...p}>
    <path d="M12 3v11m0 0 4-4m-4 4-4-4" />
    <path d="M4 19h16" />
  </svg>
)

export const CalendarIcon = (p) => (
  <svg {...base} {...p}>
    <rect x="3" y="5" width="18" height="16" rx="2" />
    <path d="M3 10h18M8 3v4M16 3v4" />
  </svg>
)

export const ChevronDown = (p) => (
  <svg {...base} {...p}>
    <path d="m6 9 6 6 6-6" />
  </svg>
)

export const CheckIcon = (p) => (
  <svg {...base} {...p}>
    <path d="m5 12.5 4.5 4.5L19 7" />
  </svg>
)

export const SearchIcon = (p) => (
  <svg {...base} {...p}>
    <circle cx="11" cy="11" r="6.5" />
    <path d="m16 16 4.5 4.5" />
  </svg>
)

export const CloseIcon = (p) => (
  <svg {...base} {...p}>
    <path d="M6 6l12 12M18 6 6 18" />
  </svg>
)

export const SortIcon = (p) => (
  <svg {...base} {...p}>
    <path d="M8 5v14m0 0-3.5-3.5M8 19l3.5-3.5" />
    <path d="M16 19V5m0 0-3.5 3.5M16 5l3.5 3.5" />
  </svg>
)

export const ArrowUpIcon = (p) => (
  <svg {...base} {...p}>
    <path d="M12 19V5m0 0-6 6m6-6 6 6" />
  </svg>
)

export const ArrowDownIcon = (p) => (
  <svg {...base} {...p}>
    <path d="M12 5v14m0 0 6-6m-6 6-6-6" />
  </svg>
)

export const SunIcon = (p) => (
  <svg {...base} {...p}>
    <circle cx="12" cy="12" r="4" />
    <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
  </svg>
)

export const MoonIcon = (p) => (
  <svg {...base} {...p}>
    <path d="M20 14.5A8.5 8.5 0 0 1 9.5 4a8.5 8.5 0 1 0 10.5 10.5Z" />
  </svg>
)

export const MonitorIcon = (p) => (
  <svg {...base} {...p}>
    <rect x="3" y="4" width="18" height="12" rx="2" />
    <path d="M8 20h8M12 16v4" />
  </svg>
)

export const AlertIcon = (p) => (
  <svg {...base} {...p}>
    <path d="M12 4.5 2.8 20h18.4L12 4.5Z" />
    <path d="M12 10v4.5M12 17.2v.3" />
  </svg>
)

export const InfoIcon = (p) => (
  <svg {...base} {...p}>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 11v5.5M12 7.7v.3" />
  </svg>
)

export const CheckCircleIcon = (p) => (
  <svg {...base} {...p}>
    <circle cx="12" cy="12" r="9" />
    <path d="m8 12.3 2.7 2.7L16 9.7" />
  </svg>
)

export const InboxIcon = (p) => (
  <svg {...base} {...p}>
    <path d="M4 13h4l1.5 3h5L16 13h4" />
    <path d="M5.5 5h13l2.5 8v5a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1v-5l2.5-8Z" />
  </svg>
)

export const MessageIcon = (p) => (
  <svg {...base} {...p}>
    <path d="M20 15a2 2 0 0 1-2 2H8l-4 3.5V6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v9Z" />
    <path d="M8.5 9.5h7M8.5 13h4" />
  </svg>
)
