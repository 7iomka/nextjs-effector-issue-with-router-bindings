import type { UrlObject } from 'url';
import type { ParsedUrlQuery } from 'querystring';
import { isClient } from './platform';

export function getRootRelativeURL(url?: string | string[]) {
  if (!url) {
    return '/';
  }

  if (Array.isArray(url)) {
    const urlSegments = url as string[];
    const urlString =
      urlSegments.length === 0
        ? '/'
        : `/${urlSegments
            .filter((v) => v.trim() !== '')
            .map(encodeURIComponent)
            .join('/')}`;

    return urlString;
  }

  if (!(url as string).trim().startsWith('/')) {
    return `/${url}`;
  }

  return url;
}

// whole url with params (only clientside)
export const getLocationURL = (
  params?: URLSearchParams | { [key: string]: string | string[] | undefined } | string,
  includeOrigin?: boolean,
) => {
  let resParamsString = '';
  if (params instanceof URLSearchParams) {
    resParamsString.toString();
  } else if (typeof params === 'object' && Object.keys(params).length > 0) {
    resParamsString = Object.keys(params)
      .map((key) => `${key}=${params[key]}`)
      .join('&');
  } else if (typeof params === 'string') {
    resParamsString = params;
  }

  return isClient()
    ? (includeOrigin ? window.location.origin : '') +
        window.location.pathname +
        (resParamsString ? `?${resParamsString}` : '') +
        (window.location.hash && window.location.hash !== '#' ? window.location.hash : '')
    : '';
};

// Next.js uses UrlObject for router.push `url`
// See: https://nextjs.org/docs/api-reference/next/router#routerpush
export function getUrlWithoutOriginFromUrlObject(url: UrlObject): string {
  const urlWithoutOrigin = [url.pathname, url.search, url.hash].filter(Boolean).join('');
  return urlWithoutOrigin.replace(/^([^/])/, '/$1');
}

// For modern URL spec.
export function getUrlWithoutOriginFromURL(url: URL): string {
  const urlString = url.toString();
  return urlString.slice(url.origin.length).replace(/^([^/])/, '/$1');
}

export function searchParamsToUrlQuery(searchParams: URLSearchParams): ParsedUrlQuery {
  const query: ParsedUrlQuery = {};
  searchParams.forEach((value, key) => {
    if (typeof query[key] === 'undefined') {
      query[key] = value;
    } else if (Array.isArray(query[key])) {
      (query[key] as string[]).push(value);
    } else {
      query[key] = [query[key] as string, value];
    }
  });
  return query;
}

function stringifyUrlQueryParam(param: unknown): string {
  if (
    typeof param === 'string' ||
    (typeof param === 'number' && !Number.isNaN(param)) ||
    typeof param === 'boolean'
  ) {
    return String(param);
  }
  return '';
}

export function urlQueryToSearchParams(urlQuery: ParsedUrlQuery): URLSearchParams {
  const result = new URLSearchParams();
  Object.entries(urlQuery).forEach(([key, value]) => {
    if (Array.isArray(value)) {
      value.forEach((item) => result.append(key, stringifyUrlQueryParam(item)));
    } else {
      result.set(key, stringifyUrlQueryParam(value));
    }
  });
  return result;
}

export function assignToSearchParams(
  target: URLSearchParams,
  ...searchParamsList: URLSearchParams[]
): URLSearchParams {
  searchParamsList.forEach((searchParams) => {
    Array.from(searchParams.keys()).forEach((key) => target.delete(key));
    searchParams.forEach((value, key) => target.append(key, value));
  });
  return target;
}
