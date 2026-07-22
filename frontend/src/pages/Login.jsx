import React, { useState, useContext } from "react";
import "./Login.css";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { UserContext } from "../context/UserContext";

export default function Login() {
  const { login } = useContext(UserContext);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [success, setSuccess] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!username || !password) {
      alert("Por favor completa todos los campos");
      return;
    }

    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password })
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.error || "Error al iniciar sesión");
        return;
      }

      if (data.user) {
        login(data.user, data.token);
        setUsername("");
        setPassword("");
        setSuccess("Login exitoso");
        setTimeout(() => {
          setSuccess("");
          const redirect = searchParams.get("redirect") || "/";
          navigate(redirect);
        }, 1400);
      }

    } catch (err) {
      alert("Error conectando al servidor");
      console.error(err);
    }
  };

  return (
    <div className="login-page">
      <form className="login-form" onSubmit={handleLogin}>
        <div className="logo">
          Pelis<span>Online</span>
        </div>

        <h2>Iniciar Sesión</h2>

        {success && (
          <div style={{ color: '#00aa00', marginBottom: '1rem' }}>{success}</div>
        )}

        <label htmlFor="username">Usuario:</label>
        <input
          id="username"
          type="text"
          value={username}
          onChange={e => setUsername(e.target.value)}
          required
        />

        <label htmlFor="password">Contraseña:</label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
        />

        <button type="submit">Iniciar Sesión</button>

        <p className="register-text">
          ¿No tienes cuenta?{" "}
          <Link to="/register" className="register-link">
            Crear cuenta
          </Link>
        </p>
      </form>
    </div>
  );
}
