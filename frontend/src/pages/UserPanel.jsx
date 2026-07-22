import { useContext, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { UserContext } from "../context/UserContext.js";
import { useFavs } from "../hooks/useFavs.js";
import "./UserPanel.css";

export default function UserPanel() {
  const { user, logout } = useContext(UserContext);
  const { favs, clearFavs } = useFavs();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate("/login?redirect=/perfil");
    }
  }, [user, navigate]);

  if (!user) return <p className="auth-message">Inicia sesión para ver tu perfil</p>;

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="user-panel-page">
      <h1>Mi Perfil</h1>

      <section className="user-data-section">
        <h2>Datos de registro</h2>
        <div className="user-data-card">
          <div className="user-avatar">👤</div>
          <div className="user-data-grid">
            <div className="data-item">
              <span className="data-label">Usuario</span>
              <span className="data-value">{user.username}</span>
            </div>
            <div className="data-item">
              <span className="data-label">Nombre completo</span>
              <span className="data-value">{user.fullName || "-"}</span>
            </div>
            <div className="data-item">
              <span className="data-label">Email</span>
              <span className="data-value">{user.email || "-"}</span>
            </div>
            <div className="data-item">
              <span className="data-label">Roles</span>
              <span className="data-value">
                {(user.roles || []).join(", ") || "user"}
              </span>
            </div>
          </div>
          <button className="logout-panel-btn" onClick={handleLogout}>
            Cerrar Sesión
          </button>
        </div>
      </section>

      <section className="favs-section">
        <h2>Películas favoritas ({favs.length})</h2>
        {favs.length === 0 ? (
          <p className="no-favs">
            No tienes películas favoritas aún.{" "}
            <Link to="/">Explora el catálogo</Link>
          </p>
        ) : (
          <>
            <div className="favs-grid">
              {favs.map((movie) => (
                <div key={movie.id} className="fav-card">
                  <Link to={`/product/${movie.id}`}>
                    <img src={movie.thumbnail} alt={movie.title} />
                    <div className="fav-card-info">
                      <h3>{movie.title}</h3>
                      <p>{movie.year} | {movie.category[0]}</p>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
            <button className="clear-favs-btn" onClick={clearFavs}>
              Limpiar favoritos
            </button>
          </>
        )}
      </section>
    </div>
  );
}
