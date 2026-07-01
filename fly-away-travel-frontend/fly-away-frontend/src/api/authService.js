import axiosClient from "./axiosClient";

/**
 * POST /users/register (sin protección)
 * Body esperado por el backend: { email, firstName, lastName, password }
 * Si tu backend usa nombres de campo distintos (p. ej. "nombre"/"apellido"),
 * ajusta el objeto que se envía aquí.
 */
export function registerUser({ email, firstName, lastName, password }) {
  return axiosClient.post("/users/register", {
    email,
    firstName,
    lastName,
    password,
  });
}

/**
 * POST /auth/login (sin protección)
 * Respuesta esperada: { token: "..." } (o similar, ver login() en AuthContext)
 */
export function loginUser({ email, password }) {
  return axiosClient.post("/auth/login", { email, password });
}

/**
 * GET /users/current (protegido) — Nice to have
 * Devuelve los datos del usuario autenticado.
 */
export function getCurrentUser() {
  return axiosClient.get("/users/current");
}
