/**
 * El PDF del laboratorio no especifica el nombre exacto de cada campo del
 * DTO (usa términos en español como "número", "salida", "asientos").
 * Estas funciones buscan el valor en varias claves posibles para que la UI
 * funcione sin importar la convención exacta que use tu backend.
 * Si conoces los nombres reales, puedes simplificar estas funciones.
 */

function pick(obj, keys, fallback = undefined) {
  for (const key of keys) {
    if (obj && obj[key] !== undefined && obj[key] !== null) return obj[key];
  }
  return fallback;
}

export function normalizeFlight(raw) {
  return {
    id: pick(raw, ["id", "flightId"]),
    flightNumber: pick(raw, ["flightNumber", "number", "flight_number", "codigo"], "—"),
    airline: pick(raw, ["airline", "airlineName", "aerolinea"], "—"),
    departureTime: pick(raw, ["departureTime", "departure", "salida", "departureDate"]),
    arrivalTime: pick(raw, ["arrivalTime", "arrival", "llegada", "arrivalDate"]),
    availableSeats: pick(raw, ["availableSeats", "seats", "asientos", "seatsAvailable"], 0),
    raw,
  };
}

export function normalizeBooking(raw) {
  const flightLike = raw.flight || raw;
  return {
    id: pick(raw, ["id", "bookingId", "reservationId"]),
    flightNumber: pick(flightLike, ["flightNumber", "number", "flight_number", "codigo"], "—"),
    airline: pick(flightLike, ["airline", "airlineName", "aerolinea"], "—"),
    departureTime: pick(flightLike, ["departureTime", "departure", "salida", "departureDate"]),
    raw,
  };
}

export function formatDateTime(value) {
  if (!value) return "—";
  const date = new Date(value);
  if (isNaN(date.getTime())) return String(value);
  return date.toLocaleString("es-PE", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}
