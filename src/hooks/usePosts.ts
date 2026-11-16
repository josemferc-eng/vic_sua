import { useQuery } from '@tanstack/react-query'
import { fetchPostsByUser } from '../api/jsonPlaceholder.ts'
import type { Post } from '../types/index.ts'

export function usePosts(userId: number | null) {
  return useQuery<Post[]>({
    queryKey: ['posts', userId],
    queryFn: () => fetchPostsByUser(userId as number),
    enabled: userId != null,
  })
}
