import axiosClient from "./axiosClient";

/**
 * GET /flights/search (sin protección)
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
  */
export function bookFlight(flightId) {
  return axiosClient.post("/flights/book", { flightId });
}

/**
 * GET /flights/book/{id} (protegido) 
 */
export function getBooking(id) {
  return axiosClient.get(`/flights/book/${id}`);
}
