import { useStore } from 'effector-react/scope'
import Link from 'next/link'
import { paths } from '@app/shared/routing'
import { $posts } from './model'

export function BlogPage() {
  const posts = useStore($posts)

  return (
    <section>
      <h2 className="text-lg">Blog</h2>
      <pre className="mt-3">
        {posts.map((post) => {
          return (
            <Link key={post.id} href={paths.blogPost(post.slug)}>
              <h3>{post.title}</h3>
            </Link>
          )
        })}
      </pre>
    </section>
  )
}
