import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { cleanup, render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import App from './App.tsx'
import { CreatedPostsProvider } from './state/CreatedPostsContext.tsx'

const users = [
  { id: 1, name: 'Leanne Graham', username: 'Bret', email: 'leanne@example.com' },
  { id: 2, name: 'Ervin Howell', username: 'Antonette', email: 'ervin@example.com' },
]

function renderApp() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  })
  return render(
    <QueryClientProvider client={queryClient}>
      <CreatedPostsProvider>
        <App />
      </CreatedPostsProvider>
    </QueryClientProvider>,
  )
}

function mockFetch() {
  return vi.fn(async (input: RequestInfo | URL, init?: RequestInit) => {
    const url = String(input)
    if (url.endsWith('/users')) {
      return { ok: true, json: async () => users } as Response
    }
    if (url.includes('/posts?userId=1')) {
      return {
        ok: true,
        json: async () => [
          { userId: 1, id: 10, title: 'Post inicial', body: 'Contenido inicial' },
        ],
      } as Response
    }
    if (url.endsWith('/posts') && init?.method === 'POST') {
      const body = JSON.parse(String(init.body)) as {
        userId: number
        title: string
        body: string
      }
      // API mock returns fixed id to simulate JSONPlaceholder behavior
      return { ok: true, json: async () => ({ ...body, id: 101 }) } as Response
    }
    return { ok: false, status: 404, json: async () => ({}) } as Response
  })
}

describe('App', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', mockFetch())
  })

  afterEach(() => {
    cleanup()
    vi.unstubAllGlobals()
  })

  it('carga usuarios y filtra por nombre', async () => {
    const user = userEvent.setup()
    renderApp()

    expect(await screen.findByRole('button', { name: 'Leanne Graham' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Ervin Howell' })).toBeInTheDocument()

    await user.type(screen.getByLabelText('Buscar por nombre'), 'leanne')

    expect(screen.getByRole('button', { name: 'Leanne Graham' })).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Ervin Howell' })).not.toBeInTheDocument()
  })

  it('valida el formulario y no crea si faltan campos', async () => {
    const user = userEvent.setup()
    renderApp()

    await user.click(await screen.findByRole('button', { name: 'Leanne Graham' }))
    await screen.findByText('Post inicial')

    await user.click(screen.getByRole('button', { name: 'Crear publicación' }))
    const dialog = await screen.findByRole('dialog', { name: 'Nueva publicación' })

    await user.click(within(dialog).getByRole('button', { name: 'Crear' }))

    expect(await within(dialog).findByText('El título es obligatorio.')).toBeInTheDocument()
    expect(within(dialog).getByText('El texto es obligatorio.')).toBeInTheDocument()

    const postCalls = (fetch as unknown as ReturnType<typeof vi.fn>).mock.calls.filter(
      ([input, init]) => String(input).endsWith('/posts') && (init as RequestInit)?.method === 'POST',
    )
    expect(postCalls).toHaveLength(0)
  })

  it('crea múltiples posts para el mismo usuario y los lista todos', async () => {
    const user = userEvent.setup()
    renderApp()

    await user.click(await screen.findByRole('button', { name: 'Leanne Graham' }))
    await screen.findByText('Post inicial')

    await user.click(screen.getByRole('button', { name: 'Crear publicación' }))
    let dialog = await screen.findByRole('dialog', { name: 'Nueva publicación' })
    await user.type(within(dialog).getByLabelText('Título *'), 'Primer post')
    await user.type(within(dialog).getByLabelText('Texto *'), 'Contenido uno')
    await user.click(within(dialog).getByRole('button', { name: 'Crear' }))

    await waitFor(() =>
      expect(screen.queryByRole('dialog', { name: 'Nueva publicación' })).not.toBeInTheDocument(),
    )
    expect(await screen.findByText('Primer post')).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Crear publicación' }))
    dialog = await screen.findByRole('dialog', { name: 'Nueva publicación' })
    await user.type(within(dialog).getByLabelText('Título *'), 'Segundo post')
    await user.type(within(dialog).getByLabelText('Texto *'), 'Contenido dos')
    await user.click(within(dialog).getByRole('button', { name: 'Crear' }))

    await waitFor(() =>
      expect(screen.queryByRole('dialog', { name: 'Nueva publicación' })).not.toBeInTheDocument(),
    )
    expect(await screen.findByText('Segundo post')).toBeInTheDocument()
    expect(screen.getByText('Primer post')).toBeInTheDocument()
  })
})
