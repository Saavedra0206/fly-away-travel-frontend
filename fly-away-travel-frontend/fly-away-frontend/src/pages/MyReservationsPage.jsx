import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getBooking } from "../api/flightService";
import { normalizeBooking, formatDateTime } from "../utils/normalize";
import Alert from "../components/Alert";
import Loader from "../components/Loader";

const BOOKINGS_KEY = "flyaway_my_booking_ids";

export default function MyReservationsPage() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadBookings() {
      const ids = JSON.parse(localStorage.getItem(BOOKINGS_KEY) || "[]");

      if (ids.length === 0) {
        setLoading(false);
        return;
      }

      try {
        const results = await Promise.allSettled(ids.map((id) => getBooking(id)));
        const successful = results
          .filter((r) => r.status === "fulfilled")
          .map((r) => normalizeBooking(r.value.data));
        setBookings(successful);

        if (successful.length < ids.length) {
          setError("Algunas reservas no se pudieron cargar (es posible que ya no existan).");
        }
      } catch (err) {
        setError("No se pudieron cargar tus reservas.");
      } finally {
        setLoading(false);
      }
    }

    loadBookings();
  }, []);

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Mis reservas</h1>
        <p>Historial de tus vuelos reservados con Fly Away Travel.</p>
      </div>

      <Alert type="error">{error}</Alert>

      {loading && <Loader label="Cargando tus reservas..." />}

      {!loading && bookings.length === 0 && (
        <div className="empty-state">
          <div className="icon">🧳</div>
          <p>Aún no tienes reservas. ¡Es hora de planear tu próximo viaje!</p>
          <Link to="/search" className="btn btn-primary" style={{ marginTop: "1rem" }}>
            Buscar vuelos
          </Link>
        </div>
      )}

      {!loading && bookings.length > 0 && (
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>ID reserva</th>
                <th>N° vuelo</th>
                <th>Aerolínea</th>
                <th>Fecha de salida</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((booking) => (
                <tr key={booking.id}>
                  <td>#{booking.id}</td>
                  <td>{booking.flightNumber}</td>
                  <td>{booking.airline}</td>
                  <td>{formatDateTime(booking.departureTime)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
