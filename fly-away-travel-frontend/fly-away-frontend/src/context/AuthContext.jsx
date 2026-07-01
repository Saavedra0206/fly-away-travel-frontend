import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { loginUser, getCurrentUser } from "../api/authService";
import { extractErrorMessage } from "../api/axiosClient";

const AuthContext = createContext(null);

const TOKEN_KEY = "flyaway_token";
const USER_KEY = "flyaway_user";

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY));
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem(USER_KEY);
    return stored ? JSON.parse(stored) : null;
  });
  const [loadingUser, setLoadingUser] = useState(false);

  const isAuthenticated = Boolean(token);

  // Nice to have: al iniciar sesión (o al recargar con un token guardado)
  // intentamos obtener el nombre del usuario autenticado.
  const fetchCurrentUser = useCallback(async () => {
    setLoadingUser(true);
    try {
      const { data } = await getCurrentUser();
      setUser(data);
      localStorage.setItem(USER_KEY, JSON.stringify(data));
    } catch {
      // Si el endpoint aún no está disponible o falla, no rompemos el login.
    } finally {
      setLoadingUser(false);
    }
  }, []);

  useEffect(() => {
    if (token && !user) {
      fetchCurrentUser();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  async function login({ email, password }) {
    try {
      const { data } = await loginUser({ email, password });
      // Soporta distintas formas comunes de respuesta del backend.
      const jwt = data?.token || data?.jwt || data?.accessToken || data;
      if (!jwt || typeof jwt !== "string") {
        throw new Error("El servidor no devolvió un token válido.");
      }
      localStorage.setItem(TOKEN_KEY, jwt);
      setToken(jwt);
      await fetchCurrentUser();
      return { success: true };
    } catch (error) {
      return { success: false, message: extractErrorMessage(error, "Credenciales incorrectas.") };
    }
  }

  function logout() {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    setToken(null);
    setUser(null);
  }

  const value = {
    token,
    user,
    isAuthenticated,
    loadingUser,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth debe usarse dentro de <AuthProvider>");
  return ctx;
}
