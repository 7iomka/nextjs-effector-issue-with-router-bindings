import type { NextRouter } from 'next/router'
import { normalizeQuery } from '@/shared/lib/next'

export const getNormalizedQueryParamsFromRouter = (
  router: NextRouter | null
) => {
  const query = router?.query
  if (query) {
    if (Object.keys(query).length === 0) return null
    const normalized = normalizeQuery(router.query, router.pathname).query
    if (Object.keys(normalized).length === 0) return null
    return normalized
  }
  return null
}
