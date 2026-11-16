import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createPost } from '../api/jsonPlaceholder.ts'
import type { NewPost, Post } from '../types/index.ts'

export function useCreatePost(userId: number) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (newPost: NewPost) => createPost(newPost),
    onSuccess: (created) => {
      queryClient.setQueryData<Post[]>(['posts', userId], (old = []) => [
        { ...created, id: created.id ?? Date.now() },
        ...old,
      ])
    },
  })
}
