import NextErrorPage from 'next/error'
import { ReactNode } from 'react'
import { MyProfilePage, pageStarted } from '@app/pages/my-profile'
import { $bio } from '@app/pages/my-profile/model'
import { createGIP } from '@/app/page-factories/base-layout-pages'
import { BaseLayout } from '@/widgets/layouts/base-layout'

interface Props {
  notFound?: boolean
}

const Page = ({ notFound }: Props) => {
  console.info('[Render] ProfilePage')

  if (notFound) {
    return <NextErrorPage statusCode={404} />
  }

  return <MyProfilePage />
}

Page.getLayout = (page: ReactNode) => <BaseLayout>{page}</BaseLayout>

Page.getInitialProps = createGIP<Props>({
  pageEvent: pageStarted,
  customize({ scope, context }) {
    const { res } = context
    const notFound = scope.getState($bio) === null
    if (notFound && res) res.statusCode = 404
    return { notFound }
  },
})

export default Page
