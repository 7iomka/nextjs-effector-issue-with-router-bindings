import { useUnit } from 'effector-react'
import { $authenticatedUser } from '@app/entities/authenticated-user'
import { $bio } from './model'

export function MyProfilePage() {
  const user = useUnit($authenticatedUser)
  const bio = useUnit($bio)

  return (
    <section>
      <h2 className="text-lg">My profile</h2>
      <pre className="mt-3">User: {JSON.stringify(user, null, 2)}</pre>
      <pre className="mt-8">Bio: {JSON.stringify(bio, null, 2)}</pre>
    </section>
  )
}
