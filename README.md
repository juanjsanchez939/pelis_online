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
- Panel de administración (usuarios y películas)
- Rate limiting en APIs externas (TMDB)

## Requisitos

- Node.js 18 o superior
- npm
- MongoDB local o Atlas
- Para la app móvil: Expo Go o Android Studio / Xcode

## Backend

API REST con autenticación JWT, conexión a MongoDB, rate limiting y validaciones robustas.

### Configuración

1. Copiar el archivo de ejemplo:
   ```bash
   cd backend
   cp .env.example .env
   ```

2. Editar `.env` con tus valores:

```env
# Server
PORT=3001
NODE_ENV=development

# JWT - OBLIGATORIO: genera uno seguro con: openssl rand -base64 32
JWT_KEY=tu_clave_secreta_muy_larga_y_segura_aqui

# MongoDB
DB_CONNECTION=mongodb://localhost:27017/pelis_online
DB_NAME=pelis_online

# TMDB API - Obtén tu key en https://www.themoviedb.org/settings/api
TMDB_API_KEY=tu_tmdb_api_key_aqui

# CORS - Orígenes permitidos (separados por coma)
CORS_ORIGIN=http://localhost:5173,http://localhost:3000

# Admin por defecto (cambia en producción)
ADMIN_USERNAME=admin
ADMIN_PASSWORD=cambia_esta_password_segura
ADMIN_EMAIL=admin@tudominio.com
```

### Variables de entorno requeridas

| Variable | Descripción | Requerida |
|----------|-------------|-----------|
| `JWT_KEY` | Clave secreta para firmar tokens JWT (mín. 32 chars) | **Sí** |
| `TMDB_API_KEY` | API key de TheMovieDB | **Sí** |
| `DB_CONNECTION` | URI de MongoDB | No (default: localhost) |
| `DB_NAME` | Nombre de la base de datos | No (default: pelis_online) |
| `PORT` | Puerto del servidor | No (default: 3001) |
| `NODE_ENV` | Entorno (development/production) | No (default: development) |
| `CORS_ORIGIN` | Orígenes permitidos CORS | No (default: localhost:5173,3000) |
| `ADMIN_USERNAME` | Usuario admin por defecto | No (default: admin) |
| `ADMIN_PASSWORD` | Password admin por defecto | No (default: admin123) |
| `ADMIN_EMAIL` | Email admin por defecto | No |

### Endpoints principales

| Método | Ruta | Auth | Descripción |
|--------|------|------|-------------|
| POST | `/api/login` | No | Iniciar sesión |
| POST | `/api/register` | No | Crear cuenta |
| GET | `/api/user` | Admin | Listar usuarios (paginado) |
| POST | `/api/user` | Admin | Crear usuario |
| PATCH | `/api/user/:uuid` | Admin | Editar usuario |
| DELETE | `/api/user/:uuid` | Admin | Eliminar usuario |
| GET | `/api/movies` | No | Listar películas (con filtros) |
| GET | `/api/movies/:id` | No | Obtener película por ID |
| POST | `/api/movies` | Admin | Crear película |
| PATCH | `/api/movies/:id` | Admin | Actualizar película |
| DELETE | `/api/movies/:id` | Admin | Eliminar película |
| POST | `/api/reseed` | Admin | Re-sembrar base de datos desde TMDB |
| GET | `/api/tmdb/search` | No | Buscar en TMDB (rate limited) |
| GET | `/api/tmdb/movie/:id` | No | Detalles de película TMDB |
| GET | `/api/tmdb/tv/:id` | No | Detalles de serie TMDB |
| GET | `/api/movies/all` | No | Catálogo completo TMDB (películas) |
| GET | `/api/tv/all` | No | Catálogo completo TMDB (series) |

### Iniciar backend

```bash
cd backend
npm install
npm run dev
```

El backend queda disponible en `http://localhost:3001`.

### Tests y calidad

```bash
# Tests
npm test              # Ejecutar tests (26 tests)
npm run test:watch    # Modo watch
npm run test:coverage # Con coverage

# Lint
npm run lint          # ESLint (0 errors, 0 warnings)
```

### Seed de datos

```bash
# El seed se ejecuta automáticamente al iniciar si la BD está vacía
# O manualmente via endpoint protegido:
curl -X POST http://localhost:3001/api/reseed \
  -H "Authorization: Bearer <admin_token>"
```

## Frontend

Aplicación web con React + Vite + Bootstrap + i18n.

### Configuración

1. Copiar el archivo de ejemplo:
   ```bash
   cd frontend
   cp .env.example .env
   ```

2. Editar `.env`:
   ```env
   # Desarrollo (usa proxy Vite)
   VITE_API_BASE_URL=/api
   
   # Producción (cambia a tu backend real)
   # VITE_API_BASE_URL=https://tu-backend.com/api
   ```

### Ejecutar

```bash
cd frontend
npm install
npm run dev
```

La aplicación queda disponible en `http://localhost:5173`.

### Notas del frontend

- El proxy de Vite redirige `/api/*` al backend en `localhost:3001` (desarrollo).
- En producción, `VITE_API_BASE_URL` debe apuntar al backend real.
- Las imágenes y datos de películas se consumen desde el backend y TMDB.

## Mobile

Aplicación móvil con Expo y React Native.

### Configuración

La configuración se maneja vía `app.json` (expo-constants):

```json
{
  "expo": {
    "extra": {
      "apiBaseUrl": "http://localhost:3001"
    }
  }
}
```

Para desarrollo local, la app detecta automáticamente:
- Android emulator: `http://10.0.2.2:3001`
- iOS simulator: `http://localhost:3001`
- Dispositivo físico: usar tu IP local en `app.json`

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

1. **MongoDB** (Docker): `docker compose up -d` (desde raíz del proyecto)
2. **Backend**: `cd backend && npm run dev`
3. **Frontend**: `cd frontend && npm run dev`
4. **Mobile**: `cd mobile && npx expo start`

## Stack técnico

| Capa | Tecnología |
|------|------------|
| Backend | Node.js, Express 4.19 (LTS), MongoDB (Mongoose), JWT, bcrypt |
| Frontend | React 19, Vite 7, React Router 7, Bootstrap, Axios, i18next |
| Mobile | Expo SDK 57, React Native, React Navigation, AsyncStorage |
| Testing | Vitest, @vitest/coverage-v8 |
| Linting | ESLint 9 |

## Seguridad implementada

- ✅ CORS restrictivo configurable (`CORS_ORIGIN`)
- ✅ JWT_KEY y TMDB_API_KEY obligatorias (fail fast al inicio)
- ✅ Rate limiting en rutas TMDB (30 req/min/IP)
- ✅ Validación y sanitización de filtros (previene NoSQL injection)
- ✅ Esquemas Mongoose con validaciones estrictas y índices
- ✅ Admin por defecto configurable por `.env` (no hardcodeado)
- ✅ Endpoint `/reseed` protegido (POST + JWT + rol admin)
- ✅ Error handler sin exposición de stack traces en producción
- ✅ Manejo correcto de expiración y errores de JWT
- ✅ bcrypt async en seed (no bloquea event loop)

## Notas

- El backend requiere MongoDB en ejecución (ver Docker Compose).
- Si usás Atlas, ajustá `DB_CONNECTION` en `backend/.env`.
- La app móvil usa `AsyncStorage` para persistir sesión y favoritos.
- Para que las imágenes se vean en mobile, frontend y backend deben estar corriendo.
- En Windows, puede ser necesario habilitar los puertos 3001, 5173 y 8081 en el firewall.
- **Rotar la TMDB_API_KEY** si estuvo expuesta en historial git previo.

## Demo

- Web: https://pelis-online-lake.vercel.app

## Licencia

ISC