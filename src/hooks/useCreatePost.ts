import { useMutation } from '@tanstack/react-query'
import { createPost } from '../api/jsonPlaceholder.ts'
import { useCreatedPosts } from '../state/CreatedPostsContext.tsx'
import type { NewPost, Post } from '../types/index.ts'

export function useCreatePost(userId: number) {
  const { addCreatedPost } = useCreatedPosts()

  return useMutation({
    mutationFn: (newPost: NewPost) => createPost(newPost),
    onSuccess: (created) => {
      // JSONPlaceholder returns a fixed id; use a unique client id for session state.
      const post: Post = {
        ...created,
        id: Date.now() + Math.floor(Math.random() * 1000),
        userId,
      }
      addCreatedPost(userId, post)
    },
  })
}
