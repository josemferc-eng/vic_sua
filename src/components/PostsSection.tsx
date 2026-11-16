import { usePosts } from '../hooks/usePosts.ts'
import type { Post } from '../types/index.ts'

type Props = {
  userId: number
}

export function PostsSection({ userId }: Props) {
  const { data: posts, isLoading, isError, error, refetch } = usePosts(userId)

  if (isLoading) {
    return <p role="status">Cargando publicaciones…</p>
  }

  if (isError) {
    return (
      <div role="alert">
        <p>
          Error al cargar publicaciones:{' '}
          {error instanceof Error ? error.message : 'desconocido'}
        </p>
        <button type="button" onClick={() => refetch()}>
          Reintentar
        </button>
      </div>
    )
  }

  if (!posts || posts.length === 0) {
    return <p>Este usuario no tiene publicaciones.</p>
  }

  return (
    <ul className="post-list">
      {posts.map((post: Post) => (
        <li key={post.id} className="post-item">
          <h3>{post.title}</h3>
          <p>{post.body}</p>
        </li>
      ))}
    </ul>
  )
}
