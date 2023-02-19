import { ReactNode } from 'react'
import { HomePage, pageStarted } from '@app/pages/home'
import { createGIP } from '@/app/page-factories/base-layout-pages'
import { BaseLayout } from '@/widgets/layouts/base-layout'

const Page = () => {
  console.info('[Render] HomePage')
  return <HomePage />
}

Page.getLayout = (page: ReactNode) => <BaseLayout>{page}</BaseLayout>

Page.getInitialProps = createGIP({
  pageEvent: pageStarted,
})

export default Page
