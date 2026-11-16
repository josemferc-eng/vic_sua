import { useState } from 'react'
import './App.css'
import { PostsSection } from './components/PostsSection.tsx'
import { UsersSection } from './components/UsersSection.tsx'

function App() {
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null)

  return (
    <main className="app">
      <h1>Prueba técnica: Usuarios y publicaciones</h1>
      <div className="layout">
        <UsersSection
          selectedUserId={selectedUserId}
          onSelectUser={setSelectedUserId}
        />
        <section aria-labelledby="posts-heading">
          <h2 id="posts-heading">Publicaciones</h2>
          {selectedUserId == null ? (
            <p>Selecciona un usuario para ver sus publicaciones.</p>
          ) : (
            <PostsSection userId={selectedUserId} />
          )}
        </section>
      </div>
    </main>
  )
}

export default App
