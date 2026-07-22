# Pelis Online

Pelis Online es una aplicacion multiplataforma para explorar peliculas y gestionar usuarios. El repositorio esta organizado en tres partes:

- `backend`: API en Node.js + Express conectada a MongoDB.
- `frontend`: aplicacion web en React + Vite.
- `mobile`: aplicacion movil en Expo / React Native.

## Que hace el proyecto

La web permite navegar el catalogo, filtrar peliculas, ver detalle, iniciar sesion, registrarse y acceder al perfil de usuario. El backend expone una API REST para autenticacion y administracion de usuarios, y la app movil reutiliza la misma base funcional desde un entorno nativo.

## Requisitos

- Node.js 18 o superior.
- npm.
- MongoDB local o una conexion a MongoDB Atlas.
- Para mobile: Expo Go, Android Studio o Xcode, segun la plataforma que quieras usar.

## Configuracion del backend

El backend necesita una configuracion local que no se versiona en el repositorio. Crea el archivo `backend/config.local.js` con algo similar a esto:

```js
export default {
  port: 3001,
  jwtKey: 'una_clave_secreta_larga',
  dbConnection: 'mongodb://127.0.0.1:27017/pelis_online',
};
```

Tambien puedes definir estos valores por variables de entorno:

- `PORT`
- `JWT_KEY`
- `DB_CONNECTION`

## Como arrancarlo

### 1. Backend

Desde la carpeta `backend`:

```bash
npm install
npm run dev
```

El servidor levanta en `http://localhost:3001` por defecto y expone las rutas bajo `/api`.

Endpoints principales:

- `POST /api/login`
- `POST /api/register`
- `GET /api/user`
- `POST /api/user`
- `PATCH /api/user/:uuid`
- `DELETE /api/user/:uuid`

### 2. Frontend web

Desde la carpeta `frontend`:

```bash
npm install
npm run dev
```

Vite suele levantar en `http://localhost:5173`.

### 3. Mobile

Desde la carpeta `mobile`:

```bash
npm install
npm start
```

Despues puedes abrir la app con Expo Go o correrla en un emulador/dispositivo.

## Orden recomendado para desarrollo

1. Levantar primero el backend.
2. Levantar despues el frontend web.
3. Si vas a probar la version movil, arrancar tambien Expo.

## Estructura general

```text
backend/   API, autenticacion, usuarios y middleware
frontend/  Web principal en React
mobile/    App movil en React Native / Expo
```

## Notas

- Si el backend no arranca, revisa primero `backend/config.local.js` y la conexion a MongoDB.
- Si el frontend no muestra datos, asegurate de que el backend este corriendo y accesible desde la URL configurada en el cliente.
- El proyecto usa datos y recursos propios, por lo que puedes levantarlo en local sin dependencias externas adicionales.