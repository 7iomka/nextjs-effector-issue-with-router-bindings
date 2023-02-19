import { useEvent } from 'effector-react/scope'
import { useRouter } from 'next/router'
import type { EmptyOrPageEvent } from 'nextjs-effector'
import { assertStrict, ContextNormalizers } from 'nextjs-effector'
import { useEffect } from 'react'

export function useEnterClientEvent(event: EmptyOrPageEvent<any, any>) {
  assertStrict(event)

  const router = useRouter()
  const boundEvent = useEvent(event)

  useEffect(() => {
    const context = ContextNormalizers.router(router)
    if (router.isReady) {
      boundEvent(context)
    }
  }, [router.isReady])
}
