import { useQuery } from '@tanstack/react-query'
import { fetchUsers } from '../api/jsonPlaceholder.ts'
import type { User } from '../types/index.ts'

export function useUsers() {
  return useQuery<User[]>({
    queryKey: ['users'],
    queryFn: fetchUsers,
  })
}
