import { useState, type FormEvent } from 'react'
import { useCreatePost } from '../hooks/useCreatePost.ts'
import { Button } from './Button.tsx'

type Props = {
  userId: number
  onSuccess?: () => void
  onCancel?: () => void
}

export function PostForm({ userId, onSuccess, onCancel }: Props) {
  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')
  const [errors, setErrors] = useState<{ title?: string; body?: string }>({})
  const { mutateAsync, isPending, isError, error, reset } = useCreatePost(userId)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    const nextErrors: { title?: string; body?: string } = {}
    if (!title.trim()) nextErrors.title = 'El título es obligatorio.'
    if (!body.trim()) nextErrors.body = 'El texto es obligatorio.'
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) return

    try {
      await mutateAsync({ userId, title: title.trim(), body: body.trim() })
      setTitle('')
      setBody('')
      setErrors({})
      reset()
      onSuccess?.()
    } catch {
      // error shown via mutation state
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      <h3>Nueva publicación</h3>

      <div>
        <label htmlFor="post-title">Título *</label>
        <input
          id="post-title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        {errors.title && <p role="alert">{errors.title}</p>}
      </div>

      <div>
        <label htmlFor="post-body">Texto *</label>
        <textarea
          id="post-body"
          value={body}
          onChange={(e) => setBody(e.target.value)}
          rows={4}
        />
        {errors.body && <p role="alert">{errors.body}</p>}
      </div>

      {isError && (
        <p role="alert">
          Error al crear la publicación:{' '}
          {error instanceof Error ? error.message : 'desconocido'}
        </p>
      )}

      <div className="form-actions">
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel} disabled={isPending}>
            Cancelar
          </Button>
        )}
        <Button type="submit" variant="solid" disabled={isPending}>
          {isPending ? 'Publicando…' : 'Crear'}
        </Button>
      </div>
    </form>
  )
}
