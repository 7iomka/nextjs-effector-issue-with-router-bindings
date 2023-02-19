import { createGIPFactory, createGSPFactory } from 'nextjs-effector'
// import { $$boot } from '@/processes/boot'
import { $$baseLayout } from '@/widgets/layouts/base-layout'

export const createGIP = createGIPFactory({
  // Will be called once:
  // - Server side on initial load
  // - Client side on navigation (only if not called yet)
  sharedEvents: [/*$boot.started, */ $$baseLayout.enter],
})

export const createGSP = createGSPFactory({
  // Will be called on each page generation (always on server side)
  sharedEvents: [/*$$boot.startedStatic, */ $$baseLayout.enterStatic],
})
