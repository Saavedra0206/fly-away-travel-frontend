import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Alert from "../components/Alert";

const initialForm = { email: "", password: "" };

export default function LoginPage() {
  const [form, setForm] = useState(initialForm);
  const [fieldErrors, setFieldErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const redirectTo = location.state?.from?.pathname || "/search";

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setFieldErrors((prev) => ({ ...prev, [name]: undefined }));
  }

  function validate() {
    const errors = {};
    if (!form.email.trim()) errors.email = "El email es obligatorio.";
    if (!form.password.trim()) errors.password = "La contraseña es obligatoria.";
    return errors;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setServerError("");

    const errors = validate();
    setFieldErrors(errors);
    if (Object.keys(errors).length > 0) return;

    setLoading(true);
    const result = await login(form);
    setLoading(false);

    if (result.success) {
      navigate(redirectTo, { replace: true });
    } else {
      setServerError(result.message);
    }
  }

  return (
    <div className="page-container">
      <div className="card card-narrow">
        <div className="page-header">
          <h1>Iniciar sesión</h1>
          <p>Ingresa tus credenciales para reservar tu próximo vuelo.</p>
        </div>

        <Alert type="error">{serverError}</Alert>

        <form onSubmit={handleSubmit} noValidate>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              className={fieldErrors.email ? "input-error" : ""}
              autoComplete="email"
            />
            {fieldErrors.email && <span className="field-error">{fieldErrors.email}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="password">Contraseña</label>
            <input
              id="password"
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              className={fieldErrors.password ? "input-error" : ""}
              autoComplete="current-password"
            />
            {fieldErrors.password && <span className="field-error">{fieldErrors.password}</span>}
          </div>

          <button className="btn btn-primary btn-block" type="submit" disabled={loading}>
            {loading ? <span className="loader" /> : "Iniciar sesión"}
          </button>
        </form>

        <p className="auth-switch">
          ¿No tienes cuenta? <Link to="/register">Regístrate</Link>
        </p>
      </div>
    </div>
  );
}
