
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../context/UserContext.js";
import "./AdminPanel.css";

export default function AdminPanel() {
  const { user, token } = useContext(UserContext);
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("usuarios");
  const [loading, setLoading] = useState(false);

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
          Películas
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
  const [editingUser, setEditingUser] = useState(null);
  const [form, setForm] = useState({ username: "", email: "", password: "", fullName: "", roles: "user" });
  const [message, setMessage] = useState("");

  const loadUsers = async () => {
    try {
      const res = await fetch("/api/user", { headers: apiHeaders });
      if (res.ok) {
        const data = await res.json();
        setUsers(data);
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
        const res = await fetch(`/api/user/${editingUser.uuid}`, {
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
        const res = await fetch("/api/user", {
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
      loadUsers();
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
      const res = await fetch(`/api/user/${uuid}`, {
        method: "DELETE",
        headers: apiHeaders,
      });
      if (res.ok) {
        setMessage("Usuario eliminado.");
        loadUsers();
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
    </section>
  );
}

function MovieManager({ apiHeaders }) {
  const [movies, setMovies] = useState([]);
  const [editingMovie, setEditingMovie] = useState(null);
  const [form, setForm] = useState({
    title: "", category: "", thumbnail: "", description: "", year: "",
    director: "", duration: "", rating: "", trailer: "", cast: ""
  });
  const [message, setMessage] = useState("");

  const loadMovies = async () => {
    try {
      const res = await fetch("/api/movies", { headers: apiHeaders });
      if (res.ok) {
        const data = await res.json();
        setMovies(data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadMovies();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    const body = {
      title: form.title,
      category: form.category.split(",").map((c) => c.trim()).filter(Boolean),
      thumbnail: form.thumbnail,
      description: form.description,
      year: parseInt(form.year) || 0,
      director: form.director,
      duration: form.duration,
      rating: parseFloat(form.rating) || 0,
      trailer: form.trailer,
      cast: form.cast.split(",").map((c) => c.trim()).filter(Boolean),
    };

    try {
      if (editingMovie) {
        const res = await fetch(`/api/movies/${editingMovie._id}`, {
          method: "PATCH",
          headers: apiHeaders,
          body: JSON.stringify(body),
        });
        if (res.ok) {
          setMessage("Película actualizada correctamente.");
          setEditingMovie(null);
        } else {
          const err = await res.json();
          setMessage(err.error || "Error al actualizar.");
        }
      } else {
        const res = await fetch("/api/movies", {
          method: "POST",
          headers: apiHeaders,
          body: JSON.stringify(body),
        });
        if (res.ok) {
          setMessage("Película creada correctamente.");
        } else {
          const err = await res.json();
          setMessage(err.error || "Error al crear.");
        }
      }

      setForm({
        title: "", category: "", thumbnail: "", description: "", year: "",
        director: "", duration: "", rating: "", trailer: "", cast: ""
      });
      loadMovies();
    } catch (err) {
      setMessage("Error de conexión.");
      console.error(err);
    }
  };

  const handleEdit = (m) => {
    setEditingMovie(m);
    setForm({
      title: m.title || "",
      category: (m.category || []).join(", "),
      thumbnail: m.thumbnail || "",
      description: m.description || "",
      year: m.year?.toString() || "",
      director: m.director || "",
      duration: m.duration || "",
      rating: m.rating?.toString() || "",
      trailer: m.trailer || "",
      cast: (m.cast || []).join(", "),
    });
    setMessage("");
  };

  const handleDelete = async (id) => {
    if (!window.confirm("¿Eliminar esta película?")) return;
    try {
      const res = await fetch(`/api/movies/${id}`, {
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

  const handleCancel = () => {
    setEditingMovie(null);
    setForm({
      title: "", category: "", thumbnail: "", description: "", year: "",
      director: "", duration: "", rating: "", trailer: "", cast: ""
    });
    setMessage("");
  };

  return (
    <section className="admin-section">
      <h2>Gestión de Películas</h2>

      {message && <div className="admin-message">{message}</div>}

      <form className="admin-form" onSubmit={handleSubmit}>
        <h3>{editingMovie ? "Editar Película" : "Nueva Película"}</h3>
        <div className="admin-form-grid">
          <div className="admin-field">
            <label>Título</label>
            <input name="title" value={form.title} onChange={handleChange} required />
          </div>
          <div className="admin-field">
            <label>Categorías (separadas por coma)</label>
            <input name="category" value={form.category} onChange={handleChange} />
          </div>
          <div className="admin-field">
            <label>Thumbnail URL</label>
            <input name="thumbnail" value={form.thumbnail} onChange={handleChange} />
          </div>
          <div className="admin-field">
            <label>Año</label>
            <input name="year" type="number" value={form.year} onChange={handleChange} />
          </div>
          <div className="admin-field">
            <label>Director</label>
            <input name="director" value={form.director} onChange={handleChange} />
          </div>
          <div className="admin-field">
            <label>Duración</label>
            <input name="duration" value={form.duration} onChange={handleChange} />
          </div>
          <div className="admin-field">
            <label>Rating</label>
            <input name="rating" type="number" step="0.1" value={form.rating} onChange={handleChange} />
          </div>
          <div className="admin-field">
            <label>Trailer URL</label>
            <input name="trailer" value={form.trailer} onChange={handleChange} />
          </div>
          <div className="admin-field full-width">
            <label>Descripción</label>
            <textarea name="description" value={form.description} onChange={handleChange} rows={3} />
          </div>
          <div className="admin-field full-width">
            <label>Reparto (separado por coma)</label>
            <input name="cast" value={form.cast} onChange={handleChange} />
          </div>
        </div>
        <div className="admin-form-actions">
          <button type="submit" className="admin-btn save">
            {editingMovie ? "Actualizar" : "Crear"}
          </button>
          {editingMovie && (
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
                  <button className="admin-btn small edit" onClick={() => handleEdit(m)}>Editar</button>
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
