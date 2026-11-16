# Prueba técnica: React + TypeScript + JSONPlaceholder

Pequeña app con React y TypeScript que consume la API pública [JSONPlaceholder](https://jsonplaceholder.typicode.com): lista usuarios con búsqueda por nombre, permite ver sus publicaciones y crear una nueva (formulario validado) reflejándola en la lista.

## Cómo ejecutarlo

### Prerrequisitos
- Node.js (mínimo v22.21.1)
- npm

### Instalación
```bash
npm install
```

### Comandos
- Desarrollo (HMR): `npm run dev` y abrir la URL que muestra Vite (p. ej. `http://localhost:5173`).
- Tests: `npm test` (Vitest en modo `run`).
- Build de producción: `npm run build` (compila TypeScript y genera `dist/`).
- Vista previa del build: `npm run preview`.
- Lint: `npm run lint` (Oxlint).

## Decisiones que tomé

- **Stack y tooling**: Vite + React + TypeScript por configuración mínima y arranque rápido. Vitest + React Testing Library + `jsdom` para tests, integrados con el ecosistema de Vite.
- **Datos remotos con React Query**: `@tanstack/react-query` para manejar peticiones, caché y estados (`isLoading`, `isError`, `refetch`, mutaciones). Un `QueryClient` global (`retry: 1`, `refetchOnWindowFocus: false`) provisto en la raíz.
- **Hooks de datos**: `useUsers` (`['users']`), `usePosts(userId)` (`['posts', userId]`, habilitado solo con usuario seleccionado) y `useCreatePost(userId)` encapsulan `useQuery`/`useMutation` y la capa API, separando la UI del fetching.
- **Capa API y tipos**: funciones tipadas (`fetchUsers`, `fetchPostsByUser`, `createPost`) con `fetch` nativo y error explícito si `!res.ok`; tipos de dominio `User`, `Post`, `NewPost`.
- **Búsqueda**: filtrado en cliente por nombre (case-insensitive) sobre la lista cargada, sin llamadas adicionales.
- **Creación de posts y limitación de la API**: JSONPlaceholder responde éxito en `POST /posts` pero **no persiste** y devuelve un `id` fijo. La mutación **siempre llama al endpoint**; para que los nuevos posts no se pierdan al cambiar de usuario ni al crear varios (y no se mezclen entre usuarios), se mantiene un **estado de la app** (`CreatedPostsContext`, `createdPostsByUser` por `userId`) donde se registran los posts creados con un `id` de cliente único para la sesión. `usePosts` fusiona los posts del servidor (caché de React Query) con los creados localmente de ese usuario (deduplicados por `id`), en lugar de depender solo de `setQueryData`/caché del fetch.
- **Formulario**: creación desde un modal (botón “Crear publicación” en la cabecera de publicaciones). Validación en submit con campos título y texto obligatorios, mensajes visibles, estado de envío (“Publicando…”, botón deshabilitado) y error de mutación visible.
- **Estados de UI**: carga y error visibles con opción de reintentar en usuarios y publicaciones; estados vacíos/sin selección claros.
- **Estructura simple**: `api/`, `types/`, `hooks/`, `state/`, `components/` y `App` como composición, sin librerías de estado global ni abstracciones innecesarias.
- **Commits**: historial incremental por funcionalidad/parte importante para dejar trazabilidad del progreso.

## Qué haría con más tiempo

- **Persistencia y datos**: persistir posts creados en `localStorage` para sobrevivir recargas; usar invalidación/estrategias de caché más finas o actualizaciones optimistas más completas según un backend real.
- **Experiencia y accesibilidad**: mejoras de estilos, focus trap/cierre por `Esc` y accesibilidad completa del modal, feedback de éxito más explícito, paginación o infinite scroll si el volumen creciera.
- **Robustez**: manejo de errores y reintentos más granular, límites y sanitización de inputs, pruebas de estados de error/red y casos borde adicionales.
- **Testing**: mocks más realistas con MSW, más cobertura (errores de carga, reintentos, “sin coincidencias”), y tests e2e.
- **Arquitectura**: mayor modularización y separación si el alcance creciera (rutas, features), manteniendo el mismo enfoque de hooks/capa de datos.

## Cómo usé la IA

### Qué le pedí
- Crear un plan para la prueba técnica a partir de los requisitos (React + TypeScript, JSONPlaceholder, búsqueda, detalle/creación de posts, estados de carga/error, tests, README y commits incrementales).
- Actualizar el plan para incluir `@tanstack/react-query` y hooks para las peticiones, con commits frecuentes y trazables.
- Implementar la app paso a paso esperando confirmación entre pasos.
- Ajustes solicitados durante el desarrollo: formulario de creación en un modal con botón, refinamiento de estilos (selección de usuario, cabecera/botón alineado, componente `Button` con variantes, cambio a tonalidad azul y botones más pequeños).
- Analizar/planificar cómo mantener en estado los posts creados (la API no persiste), confirmando que el `POST` siempre debe llamar al endpoint y que los posts no deben mezclarse entre usuarios; luego aplicar esos cambios.
- Investigar y corregir un bug (al crear varios posts para el mismo usuario solo se listaba el primero).
- Configurar y ejecutar tests, evaluarlos y añadir cobertura del escenario de múltiples posts/cambio de usuario; explicar el manejo de la caché de React Query.

### Qué acepté
- La planificación y la implementación incremental por commits (scaffold, configuración de React Query, API/tipos, hooks, UI de usuarios/búsqueda, posts, formulario/modal, consolidación de estados, estilos, store y merge de posts creados, tests).
- El uso de React Query con hooks propios, la separación por capas (`api`, `hooks`, `state`, `components`) y la estrategia de fusionar posts del servidor con un estado de la app por `userId` (llamando siempre al endpoint al crear).
- Ajustes de UI/estilos propuestos (modal de creación, componente `Button` con variantes `solid`/`outline`, paleta azul y tamaños) y los tests añadidos (búsqueda, validación sin `POST`, creación múltiple con `id` fijo simulado y persistencia al cambiar de usuario sin mezclar).

### Qué corregí
- Dirigí cambios concretos sobre la propuesta: incluir React Query y hooks desde el plan, abrir el formulario en un **modal** tras un botón, alinear el botón con el título, introducir variantes de botón y ajustar colores/tamaños.
- Exigí que la creación **siempre** invocara al endpoint y que el estado mantuviera los posts nuevos por usuario sin perderlos al cambiar de usuario ni mezclarlos; esto llevó a reemplazar la dependencia de `setQueryData` como fuente de verdad por un store en la app combinado con la caché de servidor.
- Detecté y reporté el bug de “solo se lista el primer post creado”: se corrigió asignando un `id` de cliente único en sesión (la API mock devuelve un `id` fijo), y se pidió cubrir explícitamente ese escenario en los tests.
- Solicité re-ejecución/evaluación de tests y verifiqué resultados (`npm test`, `npm run build`) antes de dar por buenos los cambios.

