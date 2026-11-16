import { useMutation } from '@tanstack/react-query'
import { createPost } from '../api/jsonPlaceholder.ts'
import { useCreatedPosts } from '../state/CreatedPostsContext.tsx'
import type { NewPost, Post } from '../types/index.ts'

export function useCreatePost(userId: number) {
  const { addCreatedPost } = useCreatedPosts()

  return useMutation({
    mutationFn: (newPost: NewPost) => createPost(newPost),
    onSuccess: (created) => {
      const post: Post = { ...created, id: created.id ?? Date.now(), userId }
      addCreatedPost(userId, post)
    },
  })
}
