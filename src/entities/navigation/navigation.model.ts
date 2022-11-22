import { attach, createEffect, createEvent, restore, sample } from 'effector'
import { debug } from 'patronum/debug'

export const attachRouter = createEvent<any>()
export const $router = restore(attachRouter, null)
export const $queryParams = $router.map((router) => router?.query ?? {})
export const $url = $router.map((router) => router?.asPath ?? '')

export const pushFx = attach({
  source: $router,
  effect(router, { url, options = {} }) {
    console.log('PUSH FX triggered', {
      router,
      url,
      options,
      asPath: router?.asPath,
    })
    return router?.push(url, undefined, options)
  },
})

// effect to update location search part using router
export const setQueryFx = attach({
  source: $router,
  effect(router, query: { [key: string]: string | string[] | undefined }) {
    // const {url: pageParam, ...onlyRealQueryParams} =  (router?.query || {})
    const newQuery = {
      ...(router?.query || {}),
    }

    for (const [key, val] of Object.entries(query)) {
      if (newQuery[key] && val === undefined) {
        delete newQuery[key]
      } else {
        newQuery[key] = val
      }
    }

    router?.push(
      {
        pathname: router.pathname,
        query: newQuery,
      },
      undefined,
      {
        shallow: true,
        scroll: false,
      }
    )

    console.log('router to push from set query', { query, newQuery })
  },
})

// effect to get location search part using router
export const getLocationFx = attach({
  source: $router,
  effect(router) {
    return router?.asPath ?? null
  },
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

debug(attachRouter, $router, callFetch, fetchFx, pushFx)
