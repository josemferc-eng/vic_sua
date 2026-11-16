import { useMemo, useState } from 'react'
import { useUsers } from '../hooks/useUsers.ts'
import type { User } from '../types/index.ts'
import { Button } from './Button.tsx'

type Props = {
  selectedUserId: number | null
  onSelectUser: (id: number) => void
}

export function UsersSection({ selectedUserId, onSelectUser }: Props) {
  const { data: users, isLoading, isError, error, refetch } = useUsers()
  const [query, setQuery] = useState('')

  const filteredUsers = useMemo(() => {
    const list = users ?? []
    const q = query.trim().toLowerCase()
    if (!q) return list
    return list.filter((u) => u.name.toLowerCase().includes(q))
  }, [users, query])

  return (
    <section aria-labelledby="users-heading">
      <h2 id="users-heading">Usuarios</h2>

      <label htmlFor="user-search">Buscar por nombre</label>
      <input
        id="user-search"
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Ej. Leanne"
      />

      {isLoading && <p role="status">Cargando usuarios…</p>}

      {isError && (
        <div role="alert">
          <p>Error al cargar usuarios: {error instanceof Error ? error.message : 'desconocido'}</p>
          <Button type="button" variant="outline" onClick={() => refetch()}>
            Reintentar
          </Button>
        </div>
      )}

      {!isLoading && !isError && filteredUsers.length === 0 && (
        <p>No se encontraron usuarios.</p>
      )}

      {!isLoading && !isError && filteredUsers.length > 0 && (
        <ul className="user-list">
          {filteredUsers.map((user: User) => (
            <li key={user.id}>
              <button
                type="button"
                className={user.id === selectedUserId ? 'selected' : ''}
                onClick={() => onSelectUser(user.id)}
              >
                {user.name}
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
