/* eslint-disable no-continue */
import type { ParsedUrlQuery } from 'querystring';
import type { NextRouter } from 'next/router';
import { getRootRelativeURL, searchParamsToUrlQuery } from '../url';
import type { PageContext, StaticPageContext } from 'nextjs-effector';

export function getURLFromStaticPageContext<Context extends StaticPageContext = StaticPageContext>(
  context: Context,
) {
  return getRootRelativeURL(context.params?.url);
}

export function getURLFromPageContext<Context extends PageContext = PageContext>(context: Context) {
  return getRootRelativeURL(context.asPath);
}

export function normalizeQuery(query: ParsedUrlQuery, route: string) {
  const onlyQuery: ParsedUrlQuery = {};
  const onlyParams: ParsedUrlQuery = {};

  for (const [name, value] of Object.entries(query)) {
    if (!value) continue;

    // handle catch and optional catch
    if (Array.isArray(value) && route.includes(`[...${name}]`)) {
      onlyParams[name] = value;
      continue;
    }

    if (route.includes(`[${name}]`)) {
      onlyParams[name] = value;
      continue;
    }

    onlyQuery[name] = value;
  }

  return {
    params: onlyParams,
    query: onlyQuery,
  };
}

export function removeParamsFromQuery(query: ParsedUrlQuery, params: ParsedUrlQuery) {
  const filteredEntries = Object.entries(query).filter(([key]) => {
    const hasProperty = Object.prototype.hasOwnProperty.call(params, key);
    return !hasProperty;
  });

  return Object.fromEntries(filteredEntries);
}

export const getQueryParamsFromPath = (asPath?: string | null) => {
  if (!asPath) return {};
  const [, search] = asPath.split('?');
  const params = new URLSearchParams(search);
  return searchParamsToUrlQuery(params);
};

export const getNormalizedQueryParamsFromRouter = (router: NextRouter | null) => {
  const query = router?.query;
  if (query) {
    if (Object.keys(query).length === 0) return null;
    const normalized = normalizeQuery(router.query, router.pathname).query;

    if (Object.keys(normalized).length === 0) return null;
    return normalized;
  }
  return null;
};
