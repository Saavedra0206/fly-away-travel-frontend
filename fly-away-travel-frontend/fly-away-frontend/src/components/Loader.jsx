export default function Loader({ label = "Cargando...", dark = true }) {
  return (
    <div className="page-loading">
      <span className={`loader ${dark ? "loader-dark" : ""}`} />
      <span>{label}</span>
    </div>
  );
}
