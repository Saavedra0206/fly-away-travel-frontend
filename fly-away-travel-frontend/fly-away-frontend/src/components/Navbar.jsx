import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/login");
  }

  return (
    <header className="navbar">
      <Link to="/" className="navbar-brand">
        <span className="dot" />
        Fly Away Travel
      </Link>

      <nav className="navbar-links">
        {isAuthenticated ? (
          <>
            <Link to="/search">Buscar vuelos</Link>
            <Link to="/reservations">Mis reservas</Link>
            {user && (
              <span className="navbar-user">
                Hola, {user.firstName || user.nombre || user.name || user.email}
              </span>
            )}
            <button onClick={handleLogout}>Cerrar sesión</button>
          </>
        ) : (
          <>
            <Link to="/search">Buscar vuelos</Link>
            <Link to="/login">Iniciar sesión</Link>
            <Link to="/register">Registrarse</Link>
          </>
        )}
      </nav>
    </header>
  );
}
