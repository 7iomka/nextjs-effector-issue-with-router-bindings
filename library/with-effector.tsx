/* eslint-disable react/jsx-key */
/* eslint-disable no-lonely-if */
import { fork, serialize, ValueMap } from 'effector'
import { Provider } from 'effector-react/scope'
import { NextComponentType } from 'next'
import { AppContext, AppProps } from 'next/app'
import React, { useRef } from 'react'
import { INITIAL_STATE_KEY } from './constants'
import { env } from './env'
import { state } from './state'

export function useScope(values: ValueMap = {}) {
  // Note: We compare stringyfied values to fix comparation of 2 empty objects
  const valuesRef = useRef<string | null>(null)

  if (env.isServer) {
    return fork({ values })
  }

  /*
   * Client first render
   * Create the new Scope and save it globally
   * We need it to be accessable inside getInitialProps
   */
  if (!state.clientScope) {
    state.clientScope = fork({ values })
    valuesRef.current = JSON.stringify(values)
  } else {
    /*
     * Values have changed, most likely it's happened on the user navigation
     * Create the new Scope from the old one and save it as before
     */
    if (JSON.stringify(values) !== valuesRef.current) {
      const currentValues = serialize(state.clientScope)
      const nextValues = Object.assign({}, currentValues, values)

      state.clientScope = fork({ values: nextValues })
      valuesRef.current = JSON.stringify(values)
    } else if (process.env.NEXT_PUBLIC_APP_STAGE !== 'production') {
      console.info('skip hydration')
    }
  }

  return state.clientScope
}

export function withEffector(App: NextComponentType<AppContext, any, any>) {
  return function EnhancedApp(props: AppProps<any>) {
    const { [INITIAL_STATE_KEY]: initialState, ...pageProps } = props.pageProps

    const scope = useScope(initialState)

    // Note: Key fixes issue https://t.me/effector_ru/273057 (we removed it)
    return (
      <Provider value={scope}>
        <App {...props} pageProps={pageProps} />
      </Provider>
    )
  }
}
