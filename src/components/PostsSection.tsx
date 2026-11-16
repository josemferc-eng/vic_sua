import { usePosts } from '../hooks/usePosts.ts'
import type { Post } from '../types/index.ts'
import { PostForm } from './PostForm.tsx'

type Props = {
  userId: number
}

export function PostsSection({ userId }: Props) {
  const { data: posts, isLoading, isError, error, refetch } = usePosts(userId)

  return (
    <div>
      <PostForm userId={userId} />

      {isLoading && <p role="status">Cargando publicaciones…</p>}

      {isError && (
        <div role="alert">
          <p>
            Error al cargar publicaciones:{' '}
            {error instanceof Error ? error.message : 'desconocido'}
          </p>
          <button type="button" onClick={() => refetch()}>
            Reintentar
          </button>
        </div>
      )}

      {!isLoading && !isError && (!posts || posts.length === 0) && (
        <p>Este usuario no tiene publicaciones.</p>
      )}

      {!isLoading && !isError && posts && posts.length > 0 && (
        <ul className="post-list">
          {posts.map((post: Post) => (
            <li key={post.id} className="post-item">
              <h3>{post.title}</h3>
              <p>{post.body}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
