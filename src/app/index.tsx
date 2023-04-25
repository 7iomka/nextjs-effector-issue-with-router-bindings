import { NextPage } from 'next'
import { AppProps } from 'next/app'
import { ReactElement, ReactNode, useEffect } from 'react'
import { withHocs } from './hocs'
import { MantineProvider } from '@mantine/core';

export type LayoutGetter = (page: ReactElement) => ReactNode

export type NextPageWithLayout = NextPage & {
  getLayout?: LayoutGetter
}

export type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout
}

const getFallbackLayout: LayoutGetter = (page) => page


const WrappedApp = ({ Component, pageProps }: AppPropsWithLayout) => {
  const getLayout = Component.getLayout ?? getFallbackLayout

  return (
    <MantineProvider
        withGlobalStyles
        withNormalizeCSS
      >
        {getLayout(<Component {...pageProps} />)}
    </MantineProvider>
  )
}

const App = withHocs(WrappedApp);

export { App };
