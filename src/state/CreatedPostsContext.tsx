import { createContext, useContext, useMemo, useState, type ReactNode } from 'react'
import type { Post } from '../types/index.ts'

type CreatedPostsByUser = Record<number, Post[]>

type CreatedPostsContextValue = {
  getCreatedPosts: (userId: number) => Post[]
  addCreatedPost: (userId: number, post: Post) => void
}

const CreatedPostsContext = createContext<CreatedPostsContextValue | null>(null)

export function CreatedPostsProvider({ children }: { children: ReactNode }) {
  const [createdPostsByUser, setCreatedPostsByUser] = useState<CreatedPostsByUser>({})

  const value = useMemo<CreatedPostsContextValue>(
    () => ({
      getCreatedPosts: (userId) => createdPostsByUser[userId] ?? [],
      addCreatedPost: (userId, post) => {
        setCreatedPostsByUser((prev) => {
          const current = prev[userId] ?? []
          let id = post.id ?? Date.now()
          if (current.some((p) => p.id === id)) {
            id = Date.now() + Math.floor(Math.random() * 1000)
          }
          const normalized: Post = { ...post, id, userId }
          return { ...prev, [userId]: [normalized, ...current] }
        })
      },
    }),
    [createdPostsByUser],
  )

  return <CreatedPostsContext.Provider value={value}>{children}</CreatedPostsContext.Provider>
}

export function useCreatedPosts() {
  const ctx = useContext(CreatedPostsContext)
  if (!ctx) {
    throw new Error('useCreatedPosts must be used within CreatedPostsProvider')
  }
  return ctx
}
