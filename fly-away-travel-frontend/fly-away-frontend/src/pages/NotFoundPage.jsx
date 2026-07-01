import { Link } from "react-router-dom";

export default function NotFoundPage() {
  return (
    <div className="page-container">
      <div className="empty-state">
        <div className="icon">🛫</div>
        <h1 style={{ margin: "0 0 0.5rem", color: "var(--color-primary-dark)" }}>404</h1>
        <p>Esta página despegó sin ti. Volvamos a la ruta correcta.</p>
        <Link to="/search" className="btn btn-primary" style={{ marginTop: "1rem" }}>
          Ir a búsqueda de vuelos
        </Link>
      </div>
    </div>
  );
}
