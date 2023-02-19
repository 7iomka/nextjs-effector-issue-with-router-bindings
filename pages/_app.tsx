import '@fontsource/acme'
import '@fontsource/fira-mono'
import '@app/shared/ui/globals.css'
import { useGate, useUnit } from 'effector-react/scope'
import { NextPage } from 'next'
import { AppProps } from 'next/app'
import { useRouter } from 'next/router'
import { withEffector } from 'nextjs-effector'
import { ReactElement, ReactNode, useEffect } from 'react'
import { $$navigation } from '@/entities/navigation'

export type LayoutGetter = (page: ReactElement) => ReactNode

export type NextPageWithLayout = NextPage & {
  getLayout?: LayoutGetter
}

export type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout
}

const getFallbackLayout: LayoutGetter = (page) => page

const withEffectorRouterEvents = (App: any) => {
  return function AppWithEffectorRouterEvents(props: AppPropsWithLayout) {
    const router = useRouter()
    const routerUpdated = useUnit($$navigation.routerUpdated)
    const historyChanged = useUnit($$navigation.historyChanged)
    const beforePopstateChanged = useUnit($$navigation.beforePopstateChanged)

    useGate($$navigation.RouterGate, { router })

    useEffect(() => {
      if (router.isReady) {
        routerUpdated(router)
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [router])

    // Handle beforePopState
    // NOTE: currently next support only single callback, that can be overwriten on updates
    // See: https://github.com/vercel/next.js/discussions/34835
    useEffect(() => {
      router.beforePopState((state) => {
        beforePopstateChanged(state)
        return true
      })
    }, [router, beforePopstateChanged])

    // Handle bind events to router events
    useEffect(() => {
      const handleRouteChange = (
        url: string,
        { shallow }: { shallow: boolean }
      ) => {
        historyChanged(url)
      }
      router.events.on('routeChangeComplete', handleRouteChange)

      return () => {
        router.events.off('routeChangeComplete', handleRouteChange)
      }
    }, [router.events, historyChanged])

    return <App {...props} />
  }
}

const WrappedApp = ({ Component, pageProps }: AppPropsWithLayout) => {
  const getLayout = Component.getLayout ?? getFallbackLayout

  return getLayout(<Component {...pageProps} />)
}

export default withEffector(withEffectorRouterEvents(WrappedApp))
