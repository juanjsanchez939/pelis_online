
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../context/UserContext.js";
import { API_BASE_URL, TMDB_IMAGE_BASE_URL } from "../utils/shared.js";
import "./AdminPanel.css";

export default function AdminPanel() {
  const { user, token } = useContext(UserContext);
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("usuarios");

  useEffect(() => {
    if (!user || !user.roles?.includes("admin")) {
      navigate("/login?redirect=/admin");
    }
  }, [user, navigate]);

  if (!user || !user.roles?.includes("admin")) {
    return <p className="auth-message">Acceso restringido. Necesitas permisos de administrador.</p>;
  }

  const apiHeaders = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };

  return (
    <div className="admin-panel-page">
      <h1>Panel de Administración</h1>

      <div className="admin-tabs">
        <button
          className={`admin-tab ${activeTab === "usuarios" ? "active" : ""}`}
          onClick={() => setActiveTab("usuarios")}
        >
          Usuarios
        </button>
        <button
          className={`admin-tab ${activeTab === "peliculas" ? "active" : ""}`}
          onClick={() => setActiveTab("peliculas")}
        >
          Películas y Series
        </button>
      </div>

      <div className="admin-content">
        {activeTab === "usuarios" && (
          <UserManager apiHeaders={apiHeaders} />
        )}
        {activeTab === "peliculas" && (
          <MovieManager apiHeaders={apiHeaders} />
        )}
      </div>
    </div>
  );
}

function UserManager({ apiHeaders }) {
  const [users, setUsers] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1 });
  const [editingUser, setEditingUser] = useState(null);
  const [form, setForm] = useState({ username: "", email: "", password: "", fullName: "", roles: "user" });
  const [message, setMessage] = useState("");

  const loadUsers = async (page = 1) => {
    try {
      const res = await fetch(`${API_BASE_URL}/user?page=${page}&limit=20`, { headers: apiHeaders });
      if (res.ok) {
        const data = await res.json();
        setUsers(data.data || data);
        if (data.pagination) {
          setPagination(data.pagination);
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    const body = {
      username: form.username,
      email: form.email,
      fullName: form.fullName || form.username,
      roles: form.roles.split(",").map((r) => r.trim()).filter(Boolean),
    };
    if (form.password) body.password = form.password;

    try {
      if (editingUser) {
        const res = await fetch(`${API_BASE_URL}/user/${editingUser.uuid}`, {
          method: "PATCH",
          headers: apiHeaders,
          body: JSON.stringify(body),
        });
        if (res.ok) {
          setMessage("Usuario actualizado correctamente.");
          setEditingUser(null);
        } else {
          const err = await res.json();
          setMessage(err.error || "Error al actualizar.");
        }
      } else {
        const res = await fetch(`${API_BASE_URL}/user`, {
          method: "POST",
          headers: apiHeaders,
          body: JSON.stringify(body),
        });
        if (res.ok) {
          setMessage("Usuario creado correctamente.");
        } else {
          const err = await res.json();
          setMessage(err.error || "Error al crear.");
        }
      }

      setForm({ username: "", email: "", password: "", fullName: "", roles: "user" });
      loadUsers(pagination.page);
    } catch (err) {
      setMessage("Error de conexión.");
      console.error(err);
    }
  };

  const handleEdit = (u) => {
    setEditingUser(u);
    setForm({
      username: u.username,
      email: u.email || "",
      password: "",
      fullName: u.fullName || "",
      roles: (u.roles || []).join(", "),
    });
    setMessage("");
  };

  const handleDelete = async (uuid) => {
    if (!window.confirm("¿Eliminar este usuario?")) return;
    try {
      const res = await fetch(`${API_BASE_URL}/user/${uuid}`, {
        method: "DELETE",
        headers: apiHeaders,
      });
      if (res.ok) {
        setMessage("Usuario eliminado.");
        loadUsers(pagination.page);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleCancel = () => {
    setEditingUser(null);
    setForm({ username: "", email: "", password: "", fullName: "", roles: "user" });
    setMessage("");
  };

  return (
    <section className="admin-section">
      <h2>Gestión de Usuarios</h2>

      {message && <div className="admin-message">{message}</div>}

      <form className="admin-form" onSubmit={handleSubmit}>
        <h3>{editingUser ? "Editar Usuario" : "Nuevo Usuario"}</h3>
        <div className="admin-form-grid">
          <div className="admin-field">
            <label>Usuario</label>
            <input name="username" value={form.username} onChange={handleChange} required />
          </div>
          <div className="admin-field">
            <label>Email</label>
            <input name="email" type="email" value={form.email} onChange={handleChange} required />
          </div>
          <div className="admin-field">
            <label>Nombre completo</label>
            <input name="fullName" value={form.fullName} onChange={handleChange} />
          </div>
          <div className="admin-field">
            <label>Contraseña {editingUser ? "(dejar vacía para no cambiar)" : ""}</label>
            <input name="password" type="password" value={form.password} onChange={handleChange} required={!editingUser} />
          </div>
          <div className="admin-field">
            <label>Roles (separados por coma: admin, user)</label>
            <input name="roles" value={form.roles} onChange={handleChange} />
          </div>
        </div>
        <div className="admin-form-actions">
          <button type="submit" className="admin-btn save">
            {editingUser ? "Actualizar" : "Crear"}
          </button>
          {editingUser && (
            <button type="button" className="admin-btn cancel" onClick={handleCancel}>
              Cancelar
            </button>
          )}
        </div>
      </form>

      <div className="admin-table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Usuario</th>
              <th>Nombre</th>
              <th>Email</th>
              <th>Roles</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.uuid}>
                <td>{u.username}</td>
                <td>{u.fullName || "-"}</td>
                <td>{u.email || "-"}</td>
                <td>{(u.roles || []).join(", ")}</td>
                <td className="admin-actions">
                  <button className="admin-btn small edit" onClick={() => handleEdit(u)}>Editar</button>
                  <button className="admin-btn small delete" onClick={() => handleDelete(u.uuid)}>Eliminar</button>
                </td>
              </tr>
            ))}
            {users.length === 0 && (
              <tr>
                <td colSpan="5" className="empty-table">No hay usuarios registrados</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {pagination.totalPages > 1 && (
        <div className="admin-pagination">
          <button
            className="admin-btn small"
            onClick={() => loadUsers(pagination.page - 1)}
            disabled={pagination.page <= 1}
          >
            Anterior
          </button>
          <span>Página {pagination.page} de {pagination.totalPages}</span>
          <button
            className="admin-btn small"
            onClick={() => loadUsers(pagination.page + 1)}
            disabled={pagination.page >= pagination.totalPages}
          >
            Siguiente
          </button>
        </div>
      )}
  );
}

function MovieManager({ apiHeaders }) {
  const [movies, setMovies] = useState([]);
  const [message, setMessage] = useState("");
  const [tmdbQuery, setTmdbQuery] = useState("");
  const [tmdbResults, setTmdbResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  const loadMovies = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/movies`, { headers: apiHeaders });
      if (res.ok) {
        const data = await res.json();
        setMovies(data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleSearchTmdb = async (e) => {
    e.preventDefault();
    if (!tmdbQuery) return;
    setIsSearching(true);
    try {
      const res = await fetch(`${API_BASE_URL}/tmdb/search?q=${encodeURIComponent(tmdbQuery)}`);
      if (res.ok) {
        const data = await res.json();
        setTmdbResults(data.filter(item => item.media_type === "movie" || item.media_type === "tv"));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSearching(false);
    }
  };

  const handleImportTmdb = async (item, forceType) => {
    try {
      const endpoint = item.media_type === "movie" ? `/tmdb/movie/${item.id}` : `/tmdb/tv/${item.id}`;
      const res = await fetch(`${API_BASE_URL}${endpoint}`);
      if (!res.ok) throw new Error("Error fetching details");
      const details = await res.json();

      const body = {
        title: details.title,
        category: details.category,
        thumbnail: details.thumbnail,
        description: details.description,
        year: details.year || 0,
        director: details.director,
        duration: details.duration,
        rating: details.rating || 0,
        trailer: details.trailer,
        cast: details.cast,
        tmdbId: item.id,
        type: forceType,
      };

      const postRes = await fetch(`${API_BASE_URL}/movies`, {
        method: "POST",
        headers: apiHeaders,
        body: JSON.stringify(body),
      });

      if (postRes.ok) {
        setMessage("Película importada correctamente desde TMDB.");
        setTmdbQuery("");
        setTmdbResults([]);
        loadMovies();
      } else {
        const err = await postRes.json();
        setMessage(err.error || "Error al importar.");
      }
    } catch (err) {
      setMessage("Error de conexión al importar.");
      console.error(err);
    }
  };

  useEffect(() => {
    loadMovies();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("¿Eliminar esta película?")) return;
    try {
      const res = await fetch(`${API_BASE_URL}/movies/${id}`, {
        method: "DELETE",
        headers: apiHeaders,
      });
      if (res.ok) {
        setMessage("Película eliminada.");
        loadMovies();
      }
    } catch (err) {
      console.error(err);
    }
  };



  return (
    <section className="admin-section">
      <h2>Gestión de Películas y Series</h2>

      {message && <div className="admin-message">{message}</div>}

      <div className="tmdb-import-section" style={{ marginBottom: '30px', padding: '15px', backgroundColor: '#222', borderRadius: '8px' }}>
        <h3>Importar de TMDB (Automático)</h3>
        <form onSubmit={handleSearchTmdb} style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
          <input 
            type="text" 
            placeholder="Buscar por nombre..." 
            value={tmdbQuery} 
            onChange={(e) => setTmdbQuery(e.target.value)} 
            style={{ flex: 1, padding: '10px', borderRadius: '4px', border: '1px solid #444', background: '#333', color: 'white' }}
          />
          <button type="submit" className="admin-btn save" disabled={isSearching}>
            {isSearching ? "Buscando..." : "Buscar"}
          </button>
        </form>
        {tmdbResults.length > 0 && (
          <div className="tmdb-results" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))', gap: '15px', marginTop: '15px' }}>
            {tmdbResults.map(item => {
              const exists = movies.some(m => m.tmdbId === item.id || m.title === (item.title || item.name));
              return (
              <div key={item.id} style={{ textAlign: 'center', background: '#333', padding: '10px', borderRadius: '4px' }}>
                <img 
                  src={item.poster_path ? `${TMDB_IMAGE_BASE_URL}${item.poster_path}` : 'https://via.placeholder.com/100x150?text=No+Image'} 
                  alt={item.title || item.name} 
                  style={{ width: '100%', borderRadius: '4px', marginBottom: '8px' }}
                />
                <h4 style={{ fontSize: '14px', margin: '0 0 5px', color: '#fff' }}>{item.title || item.name}</h4>
                <p style={{ fontSize: '12px', margin: '0 0 10px', color: '#aaa' }}>{item.media_type === "movie" ? "Película" : "Serie"} • {(item.release_date || item.first_air_date || "").split("-")[0]}</p>
                {exists ? (
                  <button type="button" className="admin-btn small" disabled style={{ width: '100%', backgroundColor: '#555', cursor: 'not-allowed' }}>Ya añadida</button>
                ) : (
                  <div style={{ display: 'flex', gap: '5px' }}>
                    <button type="button" className="admin-btn small save" style={{ flex: 1, padding: '5px', fontSize: '11px' }} onClick={() => handleImportTmdb(item, 'movie')}>+ Peli</button>
                    <button type="button" className="admin-btn small save" style={{ flex: 1, padding: '5px', fontSize: '11px' }} onClick={() => handleImportTmdb(item, 'tv')}>+ Serie</button>
                  </div>
                )}
              </div>
            )})}
          </div>
        )}
      </div>



      <div className="admin-table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Título</th>
              <th>Categoría</th>
              <th>Año</th>
              <th>Rating</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {movies.map((m) => (
              <tr key={m._id}>
                <td>{m.title}</td>
                <td>{(m.category || []).join(", ")}</td>
                <td>{m.year}</td>
                <td>{m.rating}</td>
                <td className="admin-actions">
                  <button className="admin-btn small delete" onClick={() => handleDelete(m._id)}>Eliminar</button>
                </td>
              </tr>
            ))}
            {movies.length === 0 && (
              <tr>
                <td colSpan="5" className="empty-table">No hay películas en la base de datos</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
