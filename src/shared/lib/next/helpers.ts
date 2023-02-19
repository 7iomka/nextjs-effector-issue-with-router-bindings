/* eslint-disable no-continue */
import type { StaticPageContext } from 'nextjs-effector'
import type { ParsedUrlQuery } from 'querystring'
import { UrlObject } from 'url'

export function getRootRelativeURL(url?: string | string[]) {
  if (!url) {
    return '/'
  }

  if (Array.isArray(url)) {
    const urlSegments = url as string[]
    const urlString =
      urlSegments.length === 0
        ? '/'
        : `/${urlSegments
            .filter((v) => v.trim() !== '')
            .map(encodeURIComponent)
            .join('/')}`

    return urlString
  }

  if (!(url as string).trim().startsWith('/')) {
    return `/${url}`
  }

  return url
}

export function getURLFromContext<
  Context extends StaticPageContext = StaticPageContext
>(context: Context) {
  return getRootRelativeURL(context.params?.url)
}

export function normalizeQuery(query: ParsedUrlQuery, route: string) {
  const onlyQuery: ParsedUrlQuery = {}
  const onlyParams: ParsedUrlQuery = {}

  for (const [name, value] of Object.entries(query)) {
    if (!value) continue

    // handle catch and optional catch
    if (Array.isArray(value) && route.includes(`[...${name}]`)) {
      onlyParams[name] = value
      continue
    }

    if (route.includes(`[${name}]`)) {
      onlyParams[name] = value
      continue
    }

    onlyQuery[name] = value
  }

  return {
    params: onlyParams,
    query: onlyQuery,
  }
}

export function removeParamsFromQuery(
  query: ParsedUrlQuery,
  params: ParsedUrlQuery
) {
  const filteredEntries = Object.entries(query).filter(([key]) => {
    const hasProperty = Object.prototype.hasOwnProperty.call(params, key)
    return !hasProperty
  })

  return Object.fromEntries(filteredEntries)
}


// Next.js uses UrlObject for router.push `url`
// See: https://nextjs.org/docs/api-reference/next/router#routerpush
export function getUrlWithoutOriginFromUrlObject(url: UrlObject): string {
  const urlWithoutOrigin = [url.pathname, url.search, url.hash]
    .filter(Boolean)
    .join('')
  return urlWithoutOrigin.replace(/^([^/])/, '/$1')
}

// For modern URL spec.
export function getUrlWithoutOriginFromURL(url: URL): string {
  const urlString = url.toString()
  return urlString.slice(url.origin.length).replace(/^([^/])/, '/$1')
}
