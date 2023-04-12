import { useUnit } from 'effector-react'
import { $authenticatedUser } from '@app/entities/authenticated-user'

export function HomePage() {
  const user = useUnit($authenticatedUser)

  return (
    <section>
      <h2 className="text-lg">Home</h2>
      <pre className="mt-3">User: {JSON.stringify(user, null, 2)}</pre>
    </section>
  )
}
