import { useState } from 'react'
import { usePosts } from '../hooks/usePosts.ts'
import type { Post } from '../types/index.ts'
import { Button } from './Button.tsx'
import { PostForm } from './PostForm.tsx'

type Props = {
  userId: number
}

export function PostsSection({ userId }: Props) {
  const { data: posts, isLoading, isError, error, refetch } = usePosts(userId)
  const [isModalOpen, setIsModalOpen] = useState(false)

  return (
    <section aria-labelledby="posts-heading">
      <div className="section-header">
        <h2 id="posts-heading">Publicaciones</h2>
        <Button type="button" variant="solid" onClick={() => setIsModalOpen(true)}>
          Crear publicación
        </Button>
      </div>

      {isModalOpen && (
        <div className="modal-backdrop" role="presentation">
          <div className="modal" role="dialog" aria-modal="true" aria-label="Nueva publicación">
            <PostForm
              userId={userId}
              onSuccess={() => setIsModalOpen(false)}
              onCancel={() => setIsModalOpen(false)}
            />
          </div>
        </div>
      )}

      {isLoading && <p role="status">Cargando publicaciones…</p>}

      {isError && (
        <div role="alert">
          <p>
            Error al cargar publicaciones:{' '}
            {error instanceof Error ? error.message : 'desconocido'}
          </p>
          <Button type="button" variant="outline" onClick={() => refetch()}>
            Reintentar
          </Button>
        </div>
      )}

      {!isLoading && (!posts || posts.length === 0) && !isError && (
        <p>Este usuario no tiene publicaciones.</p>
      )}

      {!isLoading && posts && posts.length > 0 && (
        <ul className="post-list">
          {posts.map((post: Post) => (
            <li key={post.id} className="post-item">
              <h3>{post.title}</h3>
              <p>{post.body}</p>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
