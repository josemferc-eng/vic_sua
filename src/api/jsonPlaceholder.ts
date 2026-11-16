import type { NewPost, Post, User } from '../types/index.ts'

const BASE_URL = 'https://jsonplaceholder.typicode.com'

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, init)
  if (!res.ok) {
    throw new Error(`Request failed (${res.status})`)
  }
  return res.json() as Promise<T>
}

export function fetchUsers(): Promise<User[]> {
  return request<User[]>('/users')
}

export function fetchPostsByUser(userId: number): Promise<Post[]> {
  return request<Post[]>(`/posts?userId=${userId}`)
}

export function createPost(newPost: NewPost): Promise<Post> {
  return request<Post>('/posts', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(newPost),
  })
}
