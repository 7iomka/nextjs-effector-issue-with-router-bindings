import { createEvent, sample } from 'effector'
import type { PageContext, StaticPageContext } from 'nextjs-effector'
import { loadAuthenticatedUser } from '@app/entities/authenticated-user'

const enter = createEvent<PageContext>()
const enterStatic = createEvent<StaticPageContext>()
const enterClient = createEvent()

enter.watch(() => console.info('[Event] enter (BaseLayout)'))
enterStatic.watch(() => console.info('[Event] enterStatic (BaseLayout)'))
enterClient.watch(() => console.info('[Event] enterClient (BaseLayout)'))

sample({
  clock: [enter, enterStatic],
  target: loadAuthenticatedUser,
})

// Fetch categories on layout started
// sample({
//   clock: [enter, enterStatic],
//   fn: () => {},
//   target: $$category.getCategoriesFx,
// })

// Fetch featured subcategories
// sample({
//   clock: [enter, enterStatic],
//   fn: () => {},
//   target: $$category.getFeatureSubcategoriesFx,
// })

export { enter, enterClient, enterStatic }
