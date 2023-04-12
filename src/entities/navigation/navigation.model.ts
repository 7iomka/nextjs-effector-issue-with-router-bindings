import {
  attach,
  createEffect,
  createEvent,
  createStore,
  sample,
} from 'effector'
import { createGate } from 'effector-react'
import deepEqual from 'fast-deep-equal'
import type { NextRouter } from 'next/router'
import { debug } from 'patronum/debug'
import type { ParsedUrlQuery } from 'querystring'
import { getUrlWithoutOriginFromUrlObject } from '@/shared/lib/next'
import { getNormalizedQueryParamsFromRouter } from './navigation.lib'
import type { NextHistoryState } from './navigation.types'

export const routerUpdated = createEvent<NextRouter | null>()
export const historyChanged = createEvent<string>()
export const beforePopstateChanged = createEvent<NextHistoryState>()

export const RouterGate = createGate<{ router: NextRouter | null }>(null!)

export const $router = createStore<NextRouter | null>(null, {
  serialize: 'ignore',
})
  .on(RouterGate.open, (_, { router }) => {
    return router
  })
  .reset(RouterGate.close)

// export const $router = restore(routerInitialized, null);

export const $isRouterInitialized = createStore(false)
  .on(RouterGate.open, () => true)
  .reset(RouterGate.close)

export const $queryParams = createStore<ParsedUrlQuery | null>(null, {
  updateFilter: deepEqual,
})

export const $url = createStore('')

// Set url on router initialize
sample({
  clock: RouterGate.open,
  fn: ({ router }) => router!.asPath,
  target: $url,
})

// Update url on history change
sample({
  clock: historyChanged,
  target: $url,
})

// Set query params on router initialize (not exist with ssg first load, skip it)
sample({
  clock: RouterGate.open,
  filter: ({ router }) => Boolean(router?.isReady),
  fn: ({ router }) => getNormalizedQueryParamsFromRouter(router),
  target: $queryParams,
})

// Update query on routerUpdated (only if ready (mounted))
sample({
  clock: routerUpdated,
  source: RouterGate.state,
  filter: ({ router }) => router !== null,
  fn: ({ router }) => getNormalizedQueryParamsFromRouter(router),
  target: $queryParams,
})

export const pushFx = attach({
  source: $router,
  effect(
    router,
    {
      url,
      options = {},
    }: { url: NextHistoryState['url']; options?: NextHistoryState['options'] }
  ) {
    return router?.push(url, undefined, options)
  },
})

// Update url on push
sample({
  clock: pushFx.done,
  fn: ({ params: { url } }) =>
    typeof url === 'string' ? url : getUrlWithoutOriginFromUrlObject(url),
  target: $url,
})

debug({
  $url,
  $queryParams,
  pushFx,
  $isRouterInitialized,
  RouterGateState: RouterGate.state,
  RouterGateOpenEvent: RouterGate.open,
  RouterGateCloseEvent: RouterGate.close,
})

// JUST FOR DEMO
export const callFetch = createEvent()

const fetchFx = createEffect(() => Promise.resolve(1))

sample({
  clock: callFetch,
  target: fetchFx,
})

sample({
  clock: fetchFx.done,
  fn: () => ({
    url: '/',
  }),
  target: pushFx,
})
