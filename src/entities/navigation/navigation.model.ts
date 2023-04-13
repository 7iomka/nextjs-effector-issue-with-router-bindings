import type { ParsedUrlQuery } from 'querystring';
import { createEvent, attach, createStore, sample } from 'effector';
import type { NextRouter } from 'next/router';
import { debug } from 'patronum/debug';
import { createGate } from 'effector-react';
import equal from 'fast-deep-equal';
import { getUrlWithoutOriginFromUrlObject } from '@/shared/lib/url';
import { getQueryParamsFromPath } from '@/shared/lib/next';
import { atom } from '@/shared/lib/atom';
import type { NextHistoryState } from './navigation.types';

export const $$navigation = atom(() => {
  /**
   * This event is triggered when `asPath` changes
   * and only when it is ready (`isReady` flag)
   * Triggered on RouterGate updates
   */
  const routerUpdated = createEvent<NextRouter | null>();
  const queryParamsChangeRequested = createEvent<ParsedUrlQuery>();
  const queryParamsChangeFromEmptyRequested = createEvent<ParsedUrlQuery>();
  const queryParamsChanged = createEvent<ParsedUrlQuery>();
  const beforePopstateChanged = createEvent<NextHistoryState>();

  /**
   * Gate for next router,
   * => null, when page is not mounted / on unmount
   * => router state, when page is mounted
   */
  const RouterGate = createGate<NextRouter | null>(null!);

  /**
   * Router store (not serializable)
   * NOTE: router state is updated silently, so, don't use it as as clock!
   * IMPORTANT: don't try to use source from `routerUpdated` event, because of scope lost issue
   */
  const $router = createStore<NextRouter | null>(null);

  // Trigger routerUpdated event when `asPath` changed
  sample({
    clock: RouterGate.state,
    source: $router,
    filter: (lastRouter, newRouter) => lastRouter?.asPath !== newRouter?.asPath,
    fn: (_, router) => (router?.asPath ? router : null),
    target: routerUpdated,
  });

  // Update router store on gate state changes
  sample({
    clock: RouterGate.state,
    fn: (router) => (router?.asPath ? router : null),
    target: $router,
  });

  // Update router store on gate open/close
  sample({
    clock: RouterGate.open,
    target: $router,
  });

  sample({
    clock: RouterGate.close,
    fn: () => null,
    target: $router,
  });

  // Custom store for test cases, related to issues with loss of the scope
  const $isRouterInitialized = createStore(false);
  sample({
    clock: RouterGate.open,
    fn: () => true,
    target: $isRouterInitialized,
  });

  sample({
    clock: RouterGate.close,
    fn: () => false,
    target: $isRouterInitialized,
  });

  /**
   * Prepare query params
   * NOTE: next.js `query` also contains `params` from dynamic routes,
   * So we don't use it as a source of truth!
   * Instead we will use `routerUpdated`, which is triggered whenever
   * the router changes but only when it `isReady`,
   */

  const $queryParams = createStore<ParsedUrlQuery>({});

  /**
   * Update query on routerUpdated, extracted from `asPath`,
   * because we prevented uneccessary clientside updates when only `query` from router changes,
   * although `asPath` is already with query params
   * First, target into intermediate event to be able to listen to queryParams before the update
   */
  sample({
    clock: routerUpdated,
    source: $queryParams,
    filter: (currentQueryParams, router) =>
      !equal(getQueryParamsFromPath(router?.asPath), currentQueryParams),
    fn: (_, router) => getQueryParamsFromPath(router?.asPath),
    target: queryParamsChangeRequested,
  });

  sample({
    clock: queryParamsChangeRequested,
    source: $queryParams.map((v) => Object.keys(v).length === 0),
    filter: (isQueryParamsEmpty, queryParamsToChange) =>
      isQueryParamsEmpty && Object.keys(queryParamsToChange).length !== 0,
    fn: (_, queryParamsToChange) => queryParamsToChange,
    target: queryParamsChangeFromEmptyRequested,
  });

  sample({
    clock: queryParamsChangeRequested,
    target: $queryParams,
  });

  sample({
    clock: $queryParams,
    target: queryParamsChanged,
  });

  /**
   * Current page url
   * NOTE: Don't use it serverside,because of an empty initial
   * Updated only clientside
   */
  const $url = createStore('');

  // Set url on router initialize / `asPath` updated
  sample({
    clock: [RouterGate.open, routerUpdated],
    filter: Boolean,
    fn: (router) => router.asPath,
    target: $url,
  });

  // Use router.push with options
  const pushFx = attach({
    source: $router,
    effect(
      router,
      {
        url,
        options = {},
      }: { url: NextHistoryState['url']; options?: NextHistoryState['options'] },
    ) {
      return router?.push(url, undefined, options);
    },
  });

  // Update url on push
  sample({
    clock: pushFx.done,
    fn: ({ params: { url } }) =>
      typeof url === 'string' ? url : getUrlWithoutOriginFromUrlObject(url),
    target: $url,
  });

  // Server only units. Updates from serverside events (with fork)
  const $serverUrl = createStore('');
  const $serverQueryParams = createStore<ParsedUrlQuery>({});

  if (process.env.NEXT_PUBLIC_APP_STAGE !== 'production') {
    debug({
      $url,
      $queryParams,
      queryParamsChangeRequested,
      queryParamsChanged,
      pushFx,
      $isRouterInitialized,
      routerUpdated,
      RouterGateState: RouterGate.state,
      RouterGateOpenEvent: RouterGate.open,
      RouterGateCloseEvent: RouterGate.close,
      $serverUrl,
      $serverQueryParams,
    });
  }

  return {
    routerUpdated,
    queryParamsChangeRequested,
    queryParamsChangeFromEmptyRequested,
    queryParamsChanged,
    beforePopstateChanged,
    RouterGate,
    $router,
    $isRouterInitialized,
    $queryParams,
    $url,
    pushFx,
    $serverUrl,
    $serverQueryParams,
  };
});
