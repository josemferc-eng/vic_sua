import { useState } from 'react'
import './App.css'
import { PostsSection } from './components/PostsSection.tsx'
import { UsersSection } from './components/UsersSection.tsx'

function App() {
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null)

  return (
    <main className="app">
      <h1>vic_sua</h1>
      <div className="layout">
        <UsersSection
          selectedUserId={selectedUserId}
          onSelectUser={setSelectedUserId}
        />
        {selectedUserId == null ? (
          <section aria-labelledby="posts-heading">
            <div className="section-header">
              <h2 id="posts-heading">Publicaciones</h2>
            </div>
            <p>Selecciona un usuario para ver sus publicaciones.</p>
          </section>
        ) : (
          <PostsSection userId={selectedUserId} />
        )}
      </div>
    </main>
  )
}

export default App
