import { useEvent, useUnit } from 'effector-react/scope'
import { useRouter } from 'next/router'
import { ReactNode, useEffect } from 'react'
import { navigationModel } from '@app/entities/navigation'
import { Header } from '@app/widgets/header'
import styles from './styles.module.css'

export interface Props {
  header?: ReactNode
  title: string
  content: ReactNode
}

export function BaseLayout({ header = <Header />, title, content }: Props) {
  // const [attachRouterEvent, callFetchEvent] = useUnit([
  //   navigationModel.attachRouter,
  //   navigationModel.callFetch,
  // ])

  const attachRouterEvent = useEvent(navigationModel.attachRouter);
  const callFetchEvent = useEvent(navigationModel.callFetch)
  const router = useRouter()

  // attach router on router change
  useEffect(() => {
    attachRouterEvent(router)
    // return () => attachRouterEvent(null)
  }, [router, attachRouterEvent])

  return (
    <>
      {header}
      <h2 className={styles.title}>{title}</h2>
      <main className={styles.content}>{content}</main>
      <button onClick={() => callFetchEvent()}>Go home</button>
    </>
  )
}
