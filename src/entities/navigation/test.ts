import { $$navigation } from "./navigation.model"
import { createEffect, createEvent, sample } from "effector"

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
  target: $$navigation.pushFx,
})
