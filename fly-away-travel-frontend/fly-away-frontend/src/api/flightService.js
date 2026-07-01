import axiosClient from "./axiosClient";

/**
 * GET /flights/search (sin protección)
 * Query params: flightNumber, airline, startDate, endDate (nice to have)
 * Ajusta los nombres de los params si tu backend espera otros distintos.
 */
export function searchFlights({ flightNumber, airline, startDate, endDate }) {
  const params = {};
  if (flightNumber) params.flightNumber = flightNumber;
  if (airline) params.airline = airline;
  if (startDate) params.startDate = startDate;
  if (endDate) params.endDate = endDate;

  return axiosClient.get("/flights/search", { params });
}

/**
 * POST /flights/book (protegido)
 * Body esperado: { flightId }
 */
export function bookFlight(flightId) {
  return axiosClient.post("/flights/book", { flightId });
}

/**
 * GET /flights/book/{id} (protegido) — Nice to have
 */
export function getBooking(id) {
  return axiosClient.get(`/flights/book/${id}`);
}
