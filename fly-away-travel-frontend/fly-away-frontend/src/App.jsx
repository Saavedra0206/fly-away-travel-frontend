import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import RegisterPage from "./pages/RegisterPage";
import LoginPage from "./pages/LoginPage";
import SearchPage from "./pages/SearchPage";
import MyReservationsPage from "./pages/MyReservationsPage";
import NotFoundPage from "./pages/NotFoundPage";

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="app-shell">
          <Navbar />
          <main style={{ flex: 1 }}>
            <Routes>
              <Route path="/" element={<Navigate to="/search" replace />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/search" element={<SearchPage />} />
              <Route
                path="/reservations"
                element={
                  <ProtectedRoute>
                    <MyReservationsPage />
                  </ProtectedRoute>
                }
              />
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </main>
          <footer className="app-footer">
            © 2026 Fly Away Travel — Proyecto académico CS2031 DBP, UTEC
          </footer>
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}
