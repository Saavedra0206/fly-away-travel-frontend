import axios from "axios";

/**
 * Base URL del backend.
 * Configúrala en un archivo .env (copia .env.example -> .env) con:
 *   VITE_API_URL=http://localhost:8080
 */
const baseURL = import.meta.env.VITE_API_URL || "http://localhost:8080";

const axiosClient = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Adjunta el token JWT (si existe) a cada request saliente.
axiosClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("flyaway_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Si el backend responde 401 (token inválido/expirado), limpiamos sesión.
axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("flyaway_token");
      localStorage.removeItem("flyaway_user");
      // No forzamos redirect aquí para no romper llamadas en pantallas públicas;
      // ProtectedRoute se encarga de redirigir cuando corresponda.
    }
    return Promise.reject(error);
  }
);

/**
 * Extrae un mensaje de error legible desde una respuesta de axios,
 * cubriendo distintos formatos comunes en backends Spring Boot
 * (message, error, string plano, mapa de errores de validación).
 */
export function extractErrorMessage(error, fallback = "Ocurrió un error inesperado. Intenta de nuevo.") {
  const data = error?.response?.data;

  if (!data) return error?.message || fallback;
  if (typeof data === "string") return data;
  if (data.message) return data.message;
  if (data.error) return data.error;

  // Errores de validación tipo { campo: "mensaje", campo2: "mensaje" }
  if (typeof data === "object") {
    const values = Object.values(data).filter((v) => typeof v === "string");
    if (values.length > 0) return values.join(" · ");
  }

  return fallback;
}

export default axiosClient;
