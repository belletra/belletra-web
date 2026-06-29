import { useEffect, useState } from 'react'

export function useDarkMode() {
  const [dark, setDark] = useState(() => {
    try { return localStorage.getItem('bl-dark') === 'true' } catch { return false }
  })

  useEffect(() => {
    document.documentElement.setAttribute('data-mode', dark ? 'dark' : 'light')
    try { localStorage.setItem('bl-dark', String(dark)) } catch {}
  }, [dark])

  // Pick up changes made in other pages
  useEffect(() => {
    const stored = localStorage.getItem('bl-dark') === 'true'
    if (stored !== dark) setDark(stored)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return [dark, setDark] as const
}
