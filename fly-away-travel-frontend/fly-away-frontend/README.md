# Fly Away Travel — Frontend Web

Frontend en **React + Vite** para la app de reserva de vuelos, desarrollado como
resolución del laboratorio de repaso *CS2031 – Desarrollo Basado en Plataformas*
(Semana 14, UTEC).

---

## 🚀 Cómo correrlo

```bash
# 1. Instalar dependencias
npm install

# 2. Configurar la URL del backend
cp .env.example .env
# Edita .env y coloca la URL real de tu backend, por ejemplo:
# VITE_API_URL=http://localhost:8080

# 3. Levantar el backend (repo del profesor) por separado, en otro puerto

# 4. Correr el frontend en modo desarrollo
npm run dev
```

Esto abrirá la app en `http://localhost:5173`.

Para generar el build de producción:

```bash
npm run build
npm run preview
```

---

## ⚠️ Importante: ajusta esto antes de entregar

El PDF del laboratorio describe **qué** debe hacer cada pantalla y **qué endpoint**
consume, pero no incluye el contrato exacto (nombres de campos JSON) del backend.
Para que el proyecto compile y corra igual sin depender de esos detalles, todos los
nombres de campos están centralizados en **tres archivos**. Antes de entregar,
revisa el `STUDENT_README` del repo del backend y ajusta si es necesario:

| Archivo | Qué contiene | Qué revisar |
|---|---|---|
| `src/api/authService.js` | Body de `/users/register` y `/auth/login` | Nombres de campos (`firstName`/`lastName` vs `nombre`/`apellido`, etc.) |
| `src/api/flightService.js` | Query params de `/flights/search` y body de `/flights/book` | Nombres de query params y del body |
| `src/utils/normalize.js` | Cómo se leen los campos de la respuesta (vuelo/reserva) | Ya intenta varias claves comunes (`flightNumber`/`number`, `departureTime`/`departure`, etc.) — agrega la tuya si no está |
| `.env` | URL base del backend | `VITE_API_URL` |

Estos archivos tienen comentarios explicando exactamente qué línea tocar. El resto
de la app (formularios, tablas, rutas, autenticación) no necesita cambios.

---

## 📋 Checklist de la rúbrica (según el PDF)

| Pantalla / Requisito | Estado | Archivo principal |
|---|---|---|
| **Registro** — formulario, validación de vacíos, errores del backend, éxito + redirect | ✅ Must have | `src/pages/RegisterPage.jsx` |
| **Login** — formulario, guarda JWT en localStorage, error de credenciales, redirect tras login | ✅ Must have | `src/pages/LoginPage.jsx`, `src/context/AuthContext.jsx` |
| **Login** — mostrar nombre del usuario autenticado (`GET /users/current`) | ✅ Nice to have | `src/context/AuthContext.jsx`, `src/components/Navbar.jsx` |
| **Búsqueda de vuelos** — inputs número/aerolínea, tabla de resultados, mensaje si vacío | ✅ Must have | `src/pages/SearchPage.jsx` |
| **Búsqueda de vuelos** — filtro por rango de fechas de salida | ✅ Nice to have | `src/pages/SearchPage.jsx` (campos `startDate`/`endDate`) |
| **Reservar vuelo** — botón "Reservar" solo autenticado, éxito con ID de reserva, errores del backend | ✅ Must have | `src/pages/SearchPage.jsx` |
| **Reservar vuelo** — ver detalle de reserva (`GET /flights/book/{id}`) | ✅ Nice to have | `src/pages/MyReservationsPage.jsx` |
| **Mis reservas** — IDs guardados en localStorage, listado con vuelo/aerolínea/fecha, solo autenticado | ✅ Nice to have | `src/pages/MyReservationsPage.jsx` |
| **Logout** — limpia token de localStorage | ✅ Must have | `src/components/Navbar.jsx`, `AuthContext.jsx` |
| **Rutas protegidas** — redirigen a login si no hay token | ✅ Must have | `src/components/ProtectedRoute.jsx` |
| **Navegación clara** Registro → Login → Búsqueda → Reserva | ✅ Must have | `src/components/Navbar.jsx`, `src/App.jsx` |

---

## 🗂 Estructura del proyecto

```
src/
  api/
    axiosClient.js     # instancia de axios + interceptores (JWT, manejo de 401/errores)
    authService.js      # register, login, getCurrentUser
    flightService.js    # searchFlights, bookFlight, getBooking
  context/
    AuthContext.jsx      # estado global de sesión (token, usuario, login, logout)
  components/
    Navbar.jsx           # navegación + estado de sesión
    ProtectedRoute.jsx   # guard de rutas privadas
    Alert.jsx            # mensajes de éxito/error
    Loader.jsx           # spinner de carga
  pages/
    RegisterPage.jsx
    LoginPage.jsx
    SearchPage.jsx
    MyReservationsPage.jsx
    NotFoundPage.jsx
  utils/
    normalize.js          # adapta distintos formatos de respuesta del backend
  index.css               # sistema de diseño (colores, componentes, layout)
  App.jsx                 # rutas
  main.jsx                # entry point
```

## 🎨 Diseño

Paleta inspirada en el logo de Fly Away Travel (azul institucional + acento naranja),
con componentes propios (sin dependencias de UI externas) para mantener el proyecto
liviano y fácil de instalar: tarjetas, tablas responsivas, badges de disponibilidad
de asientos, estados vacíos, alertas y loaders.

## 🔒 Seguridad / manejo de sesión

- El JWT se guarda en `localStorage` bajo la clave `flyaway_token`.
- `axiosClient` inyecta automáticamente el header `Authorization: Bearer <token>`
  en cada request.
- Si el backend responde `401`, la sesión se limpia automáticamente.
- Las rutas protegidas (`/reservations`) redirigen a `/login` si no hay token.

## 📎 Backend

Este frontend consume el backend del repositorio del curso:

https://github.com/CS2031-DBP/cs2031-2026-1-week14-fly-away-backend

Sigue las indicaciones de su `STUDENT_README` para levantarlo localmente antes de
correr este frontend.
