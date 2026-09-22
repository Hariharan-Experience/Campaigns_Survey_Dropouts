import { useCallback, useEffect, useState } from 'react'

export const THEME_KEY = 'sdri.theme'
export const THEMES = ['light', 'system', 'dark']

/** Reads what the pre-paint script in index.html already applied. */
function readStored() {
  try {
    const v = localStorage.getItem(THEME_KEY)
    return v === 'light' || v === 'dark' ? v : 'system'
  } catch {
    return 'system'
  }
}

/**
 * Theme preference: 'light' | 'dark' | 'system'.
 *
 * 'system' clears the stamp so the CSS media query decides; an explicit
 * choice stamps <html data-theme> and wins over the OS in both directions.
 */
export function useTheme() {
  const [theme, setThemeState] = useState(readStored)

  const setTheme = useCallback((next) => {
    setThemeState(next)
    try {
      if (next === 'system') localStorage.removeItem(THEME_KEY)
      else localStorage.setItem(THEME_KEY, next)
    } catch {
      /* private mode — the choice just won't survive a reload */
    }
  }, [])

  useEffect(() => {
    const root = document.documentElement
    if (theme === 'system') delete root.dataset.theme
    else root.dataset.theme = theme
  }, [theme])

  return { theme, setTheme }
}
