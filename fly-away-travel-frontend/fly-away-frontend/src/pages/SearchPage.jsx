import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { searchFlights, bookFlight } from "../api/flightService";
import { extractErrorMessage } from "../api/axiosClient";
import { normalizeFlight, formatDateTime } from "../utils/normalize";
import { useAuth } from "../context/AuthContext";
import Alert from "../components/Alert";
import Loader from "../components/Loader";

const BOOKINGS_KEY = "flyaway_my_booking_ids";

function saveBookingIdLocally(id) {
  const existing = JSON.parse(localStorage.getItem(BOOKINGS_KEY) || "[]");
  if (!existing.includes(id)) {
    localStorage.setItem(BOOKINGS_KEY, JSON.stringify([...existing, id]));
  }
}

function seatsBadgeClass(seats) {
  if (seats <= 0) return "seats-badge none";
  if (seats <= 5) return "seats-badge low";
  return "seats-badge";
}

export default function SearchPage() {
  const [filters, setFilters] = useState({
    flightNumber: "",
    airline: "",
    startDate: "",
    endDate: "",
  });
  const [flights, setFlights] = useState(null); // null = no se ha buscado aún
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [bookingState, setBookingState] = useState({}); // { [flightId]: { loading, error, success } }

  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  function handleChange(e) {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSearch(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const { data } = await searchFlights(filters);
      const list = Array.isArray(data) ? data : data?.content || [];
      setFlights(list.map(normalizeFlight));
    } catch (err) {
      setError(extractErrorMessage(err, "No se pudo buscar vuelos. Intenta nuevamente."));
      setFlights([]);
    } finally {
      setLoading(false);
    }
  }

  async function handleBook(flight) {
    if (!isAuthenticated) {
      navigate("/login", { state: { from: { pathname: "/search" } } });
      return;
    }

    setBookingState((prev) => ({
      ...prev,
      [flight.id]: { loading: true, error: "", success: "" },
    }));

    try {
      const { data } = await bookFlight(flight.id);
      const bookingId = data?.id ?? data?.bookingId ?? data;
      if (bookingId) saveBookingIdLocally(bookingId);

      setBookingState((prev) => ({
        ...prev,
        [flight.id]: {
          loading: false,
          error: "",
          success: `¡Reserva confirmada! ID de reserva: ${bookingId}`,
        },
      }));
    } catch (err) {
      setBookingState((prev) => ({
        ...prev,
        [flight.id]: {
          loading: false,
          error: extractErrorMessage(err, "No se pudo completar la reserva."),
          success: "",
        },
      }));
    }
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Buscar vuelos</h1>
        <p>Encuentra el vuelo perfecto para tu próxima aventura.</p>
      </div>

      <div className="card" style={{ marginBottom: "1.75rem" }}>
        <form className="search-form" onSubmit={handleSearch}>
          <div className="form-group">
            <label htmlFor="flightNumber">N° de vuelo</label>
            <input
              id="flightNumber"
              name="flightNumber"
              placeholder="Ej. FA204"
              value={filters.flightNumber}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="airline">Aerolínea</label>
            <input
              id="airline"
              name="airline"
              placeholder="Ej. Fly Away"
              value={filters.airline}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="startDate">Desde</label>
            <input
              id="startDate"
              name="startDate"
              type="date"
              value={filters.startDate}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="endDate">Hasta</label>
            <input
              id="endDate"
              name="endDate"
              type="date"
              value={filters.endDate}
              onChange={handleChange}
            />
          </div>
          <button className="btn btn-primary" type="submit" disabled={loading}>
            {loading ? <span className="loader" /> : "Buscar"}
          </button>
        </form>
      </div>

      <Alert type="error">{error}</Alert>

      {loading && <Loader label="Buscando vuelos..." />}

      {!loading && flights === null && (
        <div className="empty-state">
          <div className="icon">✈️</div>
          <p>Ingresa un número de vuelo o aerolínea para comenzar tu búsqueda.</p>
        </div>
      )}

      {!loading && flights !== null && flights.length === 0 && (
        <div className="empty-state">
          <div className="icon">🔍</div>
          <p>No encontramos vuelos que coincidan con tu búsqueda. Intenta con otros filtros.</p>
        </div>
      )}

      {!loading && flights && flights.length > 0 && (
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>N° vuelo</th>
                <th>Aerolínea</th>
                <th>Salida</th>
                <th>Llegada</th>
                <th>Asientos</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {flights.map((flight) => {
                const state = bookingState[flight.id] || {};
                return (
                  <tr key={flight.id ?? flight.flightNumber}>
                    <td>{flight.flightNumber}</td>
                    <td>{flight.airline}</td>
                    <td>{formatDateTime(flight.departureTime)}</td>
                    <td>{formatDateTime(flight.arrivalTime)}</td>
                    <td>
                      <span className={seatsBadgeClass(flight.availableSeats)}>
                        {flight.availableSeats}
                      </span>
                    </td>
                    <td>
                      {state.success ? (
                        <span className="alert alert-success" style={{ margin: 0 }}>
                          {state.success}
                        </span>
                      ) : (
                        <div>
                          <button
                            className="btn btn-accent btn-sm"
                            onClick={() => handleBook(flight)}
                            disabled={state.loading || flight.availableSeats <= 0}
                          >
                            {state.loading ? <span className="loader" /> : "Reservar"}
                          </button>
                          {state.error && (
                            <div className="field-error" style={{ marginTop: "0.35rem" }}>
                              {state.error}
                            </div>
                          )}
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
