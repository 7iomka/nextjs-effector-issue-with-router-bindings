import { createEvent, createStore, sample } from 'effector'
import { debug } from 'patronum/debug'
import { $$navigation } from '@/entities/navigation'

export const pageStarted = createEvent()

const $demo = createStore(1)

const $demo2 = createStore('')
// if clock is not page event - scope not changes
sample({ clock: $$navigation.$url, target: $demo2 })
// if clock is pageStarted - scrope changes once clientside
sample({ clock: pageStarted, source: $demo, fn: (v) => v + 1, target: $demo })

debug({ $demo, $demo2 })
