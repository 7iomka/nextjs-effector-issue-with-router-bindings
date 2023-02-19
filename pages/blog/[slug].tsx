import { GetStaticPaths } from 'next'
import { usePageEvent } from 'nextjs-effector'
import { ReactNode } from 'react'
import { BlogPostPage, pageStarted } from '@app/pages/blog-post'
import { appStarted } from '@app/pages/shared/model'
import { localApi } from '@app/shared/api'
import { createGSP } from '@/app/page-factories/base-layout-pages'
import { BaseLayout } from '@/widgets/layouts/base-layout'

const Page = () => {
  console.info('[Render] BlogPostPage')

  usePageEvent(appStarted, { runOnce: true })
  return <BlogPostPage />
}

Page.getLayout = (page: ReactNode) => <BaseLayout>{page}</BaseLayout>

export const getStaticPaths: GetStaticPaths<{ slug: string }> = async () => {
  const posts = await localApi.getAllPostsFx()

  return {
    paths: posts.map((post) => ({
      params: { slug: post.slug },
    })),
    fallback: false,
  }
}

export const getStaticProps = createGSP<
  Record<string, never>,
  { slug: string }
>({
  pageEvent: pageStarted,
})

export default Page
