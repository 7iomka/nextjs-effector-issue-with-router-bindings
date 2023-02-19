import {  useUnit } from 'effector-react/scope'
import { PropsWithChildren, ReactNode } from 'react'
import { $$navigation } from '@app/entities/navigation'
import { Header } from '@app/widgets/header'
import styles from './styles.module.css'

export interface BaseLayoutProps {
  header?: ReactNode
}

export function BaseLayout({
  header = <Header />,

  children,
}: PropsWithChildren<BaseLayoutProps>) {
  // demo event
  const callFetchEvent = useUnit($$navigation.callFetch)

  return (
    <>
      {header}
      <main className={styles.content}>{children}</main>
      <button onClick={() => callFetchEvent()}>Go home</button>
    </>
  )
}
