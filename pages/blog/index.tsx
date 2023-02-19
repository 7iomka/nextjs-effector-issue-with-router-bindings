import { usePageEvent } from 'nextjs-effector'
import { ReactNode } from 'react'
import { BlogPage, pageStarted } from '@app/pages/blog'
import { appStarted } from '@app/pages/shared/model'
import { createGSP } from '@/app/page-factories/base-layout-pages'
import { BaseLayout } from '@/widgets/layouts/base-layout'

const Page = () => {
  console.info('[Render] BlogPage')

  usePageEvent(appStarted, { runOnce: true })
  return <BlogPage />
}

Page.getLayout = (page: ReactNode) => <BaseLayout>{page}</BaseLayout>

export const getStaticProps = createGSP({
  pageEvent: pageStarted,
})

export default Page
