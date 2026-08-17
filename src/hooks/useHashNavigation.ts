import { useEffect, useState } from 'react'

const readHash = <Page extends string>(
  validPages: readonly Page[],
  fallback: Page,
) => {
  if (typeof window === 'undefined') {
    return fallback
  }

  const hash = decodeURIComponent(window.location.hash.slice(1))

  return validPages.includes(hash as Page) ? (hash as Page) : fallback
}

export function useHashNavigation<Page extends string>(
  validPages: readonly Page[],
  fallback: Page,
) {
  const [activePage, setActivePage] = useState(() =>
    readHash(validPages, fallback),
  )

  useEffect(() => {
    const handleHashChange = () => {
      setActivePage(readHash(validPages, fallback))
    }

    window.addEventListener('hashchange', handleHashChange)

    return () => {
      window.removeEventListener('hashchange', handleHashChange)
    }
  }, [fallback, validPages])

  const navigate = (page: Page) => {
    const nextHash = `#${encodeURIComponent(page)}`

    if (window.location.hash === nextHash) {
      setActivePage(page)
      return
    }

    window.location.hash = nextHash
  }

  return [activePage, navigate] as const
}