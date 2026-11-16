import { useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { fetchPostsByUser } from '../api/jsonPlaceholder.ts'
import { useCreatedPosts } from '../state/CreatedPostsContext.tsx'
import type { Post } from '../types/index.ts'

export function usePosts(userId: number | null) {
  const { getCreatedPosts } = useCreatedPosts()
  const query = useQuery<Post[]>({
    queryKey: ['posts', userId],
    queryFn: () => fetchPostsByUser(userId as number),
    enabled: userId != null,
  })

  const data = useMemo(() => {
    if (userId == null) return undefined
    const local = getCreatedPosts(userId).filter((p) => p.userId === userId)
    const server = query.data ?? []
    const localIds = new Set(local.map((p) => p.id))
    return [...local, ...server.filter((p) => p.userId === userId && !localIds.has(p.id))]
  }, [userId, getCreatedPosts, query.data])

  return { ...query, data }
}
