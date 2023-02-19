import { attach, createEvent, restore, sample } from 'effector'
import { debug } from 'patronum/debug'
import { localApi } from '@app/shared/api'

export const pageStarted = createEvent()

const loadBioFx = attach({ effect: localApi.getBioFx })

export const $bio = restore(loadBioFx, null)

sample({
  clock: pageStarted,
  target: loadBioFx,
})

debug({ $bio })
