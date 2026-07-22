# PelisOnline

Catálogo de películas multiplataforma con autenticación de usuarios. Web + API + App móvil.

## Estructura

```
pelis_online/
├── backend/       # API REST (Node.js + Express + MongoDB)
├── frontend/      # Web app (React 19 + Vite + Bootstrap)
└── mobile/        # App móvil (Expo SDK 57 + React Native)
```

## Funcionalidades

- Catálogo de películas organizado por género (Acción, Aventura, Animadas, Bélicas, Comedias, Terror)
- Búsqueda por título o descripción
- Top 10 mejor valoradas
- Detalle de película: sinopsis, reparto, director, duración, rating, tráiler
- Sistema de comentarios y puntuación
- Favoritos (persistidos por dispositivo)
- Registro e inicio de sesión (JWT)
- Tema dark/light
- Perfil de usuario con gestión de favoritos
- Página de ayuda con FAQ y búsqueda IMDb

## Requisitos

- **Node.js** 18+
- **npm**
- **MongoDB** (local o Atlas)
- Para mobile: **Expo Go** (Android/iOS) o Android Studio / Xcode

---

## Backend

API REST con autenticación JWT y conexión a MongoDB.

### Configuración

Crear `backend/config.local.js`:

```js
export default {
  port: 3001,
  jwtKey: 'clave_secreta_segura',
  dbConnection: 'mongodb://127.0.0.1:27017/pelis_online',
};
```

O por variables de entorno: `PORT`, `JWT_KEY`, `DB_CONNECTION`.

### Endpoints

| Método | Ruta | Auth | Descripción |
|--------|------|------|-------------|
| POST | `/api/login` | No | Iniciar sesión |
| POST | `/api/register` | No | Crear cuenta |
| GET | `/api/user` | Admin | Listar usuarios |
| POST | `/api/user` | Admin | Crear usuario |
| PATCH | `/api/user/:uuid` | Admin | Editar usuario |
| DELETE | `/api/user/:uuid` | Admin | Eliminar usuario |

### Iniciar

```bash
cd backend
npm install
npm run dev    # → http://localhost:3001
```

---

## Frontend (Web)

React 19 + Vite + Bootstrap 5. Consume la API del backend. Las imágenes y datos de películas son estáticos (`src/mocks/products.json`).

```bash
cd frontend
npm install
npm run dev    # → http://localhost:5173
```

El proxy de Vite redirige `/api/*` al backend en `localhost:3001`.

---

## Mobile (Expo / React Native)

App nativa con Expo SDK 57. Comparte la misma API y datos del backend.

### Configuración de red

Editar `mobile/src/config.js` con la IP de tu PC en la red local:

```js
export const API_BASE_URL = 'http://192.168.X.X:3001';   // Backend
export const IMAGE_BASE_URL = 'http://192.168.X.X:5173';  // Imágenes (Vite)
```

### Iniciar

```bash
cd mobile
npm install
npx expo start          # QR para Expo Go
npx expo start --tunnel # Si el firewall bloquea la conexión
npx expo run:android    # Development build (requiere Android Studio)
```

### Permisos de firewall (Windows)

Si el celu no se conecta, abrir estos puertos (PowerShell como admin):

```powershell
New-NetFirewallRule -DisplayName "Expo 8081" -Direction Inbound -Protocol TCP -LocalPort 8081 -Action Allow
New-NetFirewallRule -DisplayName "Vite 5173" -Direction Inbound -Protocol TCP -LocalPort 5173 -Action Allow
New-NetFirewallRule -DisplayName "Backend 3001" -Direction Inbound -Protocol TCP -LocalPort 3001 -Action Allow
```

### Vite en red

Para que el celu acceda a las imágenes, Vite debe escuchar en la red. El archivo `frontend/vite.config.js` ya incluye `host: true`.

---

## Orden de ejecución

1. Backend (`cd backend && npm run dev`)
2. Frontend (`cd frontend && npm run dev`)
3. Mobile (`cd mobile && npx expo start`)

---

## Stack técnico

| Capa | Tecnología |
|------|------------|
| Backend | Node.js, Express 5, MongoDB (Mongoose), JWT, bcrypt |
| Frontend | React 19, Vite 7, React Router 7, Bootstrap 5, Axios |
| Mobile | Expo SDK 57, React Native 0.86, React Navigation 7, AsyncStorage |

---

## Notas

- Las imágenes de películas se sirven desde el frontend (Vite). Ambos deben estar corriendo para verlas en la app mobile.
- El backend requiere MongoDB funcionando. Si usás Atlas, configurá la URI en `config.local.js`.
- La app mobile usa `AsyncStorage` en vez de `localStorage` para persistir sesión y favoritos.
