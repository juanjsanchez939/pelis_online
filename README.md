# PelisOnline

Catálogo de películas multiplataforma con autenticación de usuarios. Incluye web, API y app móvil.

## Descripción

PelisOnline es una plataforma para explorar un catálogo de películas por género, buscar títulos, ver detalles completos, dejar comentarios y guardar favoritos. El proyecto está organizado en tres partes:

- **Backend**: API REST con Node.js, Express y MongoDB.
- **Frontend**: web app con React, Vite y Bootstrap.
- **Mobile**: app móvil con Expo y React Native.

## Estructura del repositorio

```text
pelis_online/
├── backend/       # API REST (Node.js + Express + MongoDB)
├── frontend/      # Web app (React + Vite + Bootstrap)
└── mobile/        # App móvil (Expo + React Native)
```

## Funcionalidades

- Catálogo de películas organizado por género
- Búsqueda por título o descripción
- Sección con las películas mejor valoradas
- Ficha detallada de película: sinopsis, reparto, director, duración, rating y tráiler
- Sistema de comentarios y puntuación
- Favoritos persistidos por dispositivo
- Registro e inicio de sesión con JWT
- Tema claro/oscuro
- Perfil de usuario con gestión de favoritos
- Página de ayuda con FAQ y búsqueda en IMDb

## Requisitos

- Node.js 18 o superior
- npm
- MongoDB local o Atlas
- Para la app móvil: Expo Go o Android Studio / Xcode

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

También puede configurarse mediante variables de entorno:

- `PORT`
- `JWT_KEY`
- `DB_CONNECTION`

### Endpoints principales

| Método | Ruta | Auth | Descripción |
|--------|------|------|-------------|
| POST | `/api/login` | No | Iniciar sesión |
| POST | `/api/register` | No | Crear cuenta |
| GET | `/api/user` | Admin | Listar usuarios |
| POST | `/api/user` | Admin | Crear usuario |
| PATCH | `/api/user/:uuid` | Admin | Editar usuario |
| DELETE | `/api/user/:uuid` | Admin | Eliminar usuario |

### Iniciar backend

```bash
cd backend
npm install
npm run dev
```

El backend queda disponible en `http://localhost:3001`.

## Frontend

Aplicación web con React + Vite + Bootstrap.

### Ejecutar

```bash
cd frontend
npm install
npm run dev
```

La aplicación queda disponible en `http://localhost:5173`.

### Notas del frontend

- El proxy de Vite redirige `/api/*` al backend en `localhost:3001`.
- Las imágenes y datos de películas se consumen desde el frontend.

## Mobile

Aplicación móvil con Expo y React Native.

### Configuración de red

Editar `mobile/src/config.js` con la IP de tu computadora en la red local:

```js
export const API_BASE_URL = 'http://192.168.X.X:3001';
export const IMAGE_BASE_URL = 'http://192.168.X.X:5173';
```

### Ejecutar

```bash
cd mobile
npm install
npx expo start
```

Opcionalmente:

- `npx expo start --tunnel` si el firewall bloquea la conexión
- `npx expo run:android` para development build

## Orden recomendado de ejecución

1. Backend: `cd backend && npm run dev`
2. Frontend: `cd frontend && npm run dev`
3. Mobile: `cd mobile && npx expo start`

## Stack técnico

| Capa | Tecnología |
|------|------------|
| Backend | Node.js, Express 5, MongoDB (Mongoose), JWT, bcrypt |
| Frontend | React, Vite, React Router, Bootstrap, Axios |
| Mobile | Expo SDK 57, React Native, React Navigation, AsyncStorage |

## Notas

- El backend requiere MongoDB en ejecución.
- Si usás Atlas, ajustá la URI en `backend/config.local.js`.
- La app móvil usa `AsyncStorage` para persistir sesión y favoritos.
- Para que las imágenes se vean en mobile, frontend y backend deben estar corriendo.
- En Windows, puede ser necesario habilitar los puertos 3001, 5173 y 8081 en el firewall.

## Demo

- Web: https://pelis-online-lake.vercel.app
