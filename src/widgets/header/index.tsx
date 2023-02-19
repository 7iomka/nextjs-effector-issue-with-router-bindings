import clsx from 'clsx'
import { useStore } from 'effector-react/scope'
import Link from 'next/link'
import { $authenticatedUser } from '@app/entities/authenticated-user'
import { paths } from '@app/shared/routing'
import styles from './styles.module.css'

interface Route {
  title: string
  path: string
}

const routes: Route[] = [
  {
    title: 'Home',
    path: paths.home(),
  },
  {
    title: 'My Profile',
    path: paths.me(),
  },
  {
    title: 'Blog',
    path: paths.blog(),
  },
]

export function Header() {
  const user = useStore($authenticatedUser)

  return (
    <header className={styles.header}>
      <Link href={paths.home()} className={clsx([styles.navlink, styles.logo])}>
        Effector + Next.js
      </Link>
      <nav className={styles.navbar}>
        {routes.map((route) => (
          <Link key={route.path} href={route.path} className={styles.navlink}>
            {route.title}
          </Link>
        ))}
      </nav>
      {user && (
        <Link href={paths.me()} className={styles.navlink}>
          Welcome, {user.firstName}!
        </Link>
      )}
    </header>
  )
}
