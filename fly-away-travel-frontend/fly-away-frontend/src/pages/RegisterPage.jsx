import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registerUser } from "../api/authService";
import { extractErrorMessage } from "../api/axiosClient";
import Alert from "../components/Alert";

const initialForm = { email: "", firstName: "", lastName: "", password: "" };

export default function RegisterPage() {
  const [form, setForm] = useState(initialForm);
  const [fieldErrors, setFieldErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setFieldErrors((prev) => ({ ...prev, [name]: undefined }));
  }

  function validate() {
    const errors = {};
    if (!form.email.trim()) errors.email = "El email es obligatorio.";
    else if (!/^\S+@\S+\.\S+$/.test(form.email)) errors.email = "Ingresa un email válido.";
    if (!form.firstName.trim()) errors.firstName = "El nombre es obligatorio.";
    if (!form.lastName.trim()) errors.lastName = "El apellido es obligatorio.";
    if (!form.password.trim()) errors.password = "La contraseña es obligatoria.";
    else if (form.password.length < 6) errors.password = "Debe tener al menos 6 caracteres.";
    return errors;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setServerError("");
    setSuccess("");

    const errors = validate();
    setFieldErrors(errors);
    if (Object.keys(errors).length > 0) return;

    setLoading(true);
    try {
      await registerUser(form);
      setSuccess("¡Cuenta creada exitosamente! Redirigiendo al login...");
      setForm(initialForm);
      setTimeout(() => navigate("/login"), 1500);
    } catch (error) {
      setServerError(extractErrorMessage(error, "No se pudo completar el registro."));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="page-container">
      <div className="card card-narrow">
        <div className="page-header">
          <h1>Crear cuenta</h1>
          <p>Únete a Fly Away Travel y empieza a reservar tus vuelos.</p>
        </div>

        <Alert type="error">{serverError}</Alert>
        <Alert type="success">{success}</Alert>

        <form onSubmit={handleSubmit} noValidate>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="firstName">Nombre</label>
              <input
                id="firstName"
                name="firstName"
                value={form.firstName}
                onChange={handleChange}
                className={fieldErrors.firstName ? "input-error" : ""}
                autoComplete="given-name"
              />
              {fieldErrors.firstName && <span className="field-error">{fieldErrors.firstName}</span>}
            </div>
            <div className="form-group">
              <label htmlFor="lastName">Apellido</label>
              <input
                id="lastName"
                name="lastName"
                value={form.lastName}
                onChange={handleChange}
                className={fieldErrors.lastName ? "input-error" : ""}
                autoComplete="family-name"
              />
              {fieldErrors.lastName && <span className="field-error">{fieldErrors.lastName}</span>}
            </div>
          </div>

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
              autoComplete="new-password"
            />
            {fieldErrors.password && <span className="field-error">{fieldErrors.password}</span>}
          </div>

          <button className="btn btn-primary btn-block" type="submit" disabled={loading}>
            {loading ? <span className="loader" /> : "Crear cuenta"}
          </button>
        </form>

        <p className="auth-switch">
          ¿Ya tienes cuenta? <Link to="/login">Inicia sesión</Link>
        </p>
      </div>
    </div>
  );
}
