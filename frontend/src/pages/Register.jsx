import React, { useState } from "react";
import "./Register.css";
import { Link } from "react-router-dom";
import axios from 'axios'

export default function Register() {
  const [ username, setUsername] = useState("")
  const [ email, setEmail] = useState("")
  const [ password, setPassword] = useState("")
  const [ confirmPassword, setConfirmPassword] = useState("")
  const [ error, setError] = useState("")
  const [ success, setSuccess] = useState("")

  const handleSubmit = (e) => {
    e.preventDefault()
    setError("")
    setSuccess("")

    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden")
      return
    }

    axios.post('/api/register', {username, email, password})
      .then(() => {
        setSuccess("Usuario registrado correctamente. Redirigiendo...")
        setUsername("")
        setEmail("")
        setPassword("")
        setConfirmPassword("")
        setTimeout(() => {
          window.location.href = '/login'
        }, 2000)
      })
      .catch(err => {
        const errorMsg = err.response?.data?.error || "Error al registrar"
        setError(errorMsg)
      })
  }
  return (
    <div className="login-page">
      <form className="login-form" onSubmit={handleSubmit}>
        <div className="logo">
          Pelis<span>Online</span>
        </div>

        <h2>Crear Cuenta</h2>

        {error && <div style={{color: '#e50914', marginBottom: '1rem'}}>{error}</div>}
        {success && <div style={{color: '#00aa00', marginBottom: '1rem'}}>{success}</div>}

        <label htmlFor="username">Usuario:</label>
        <input
          type="text"
          id="username"
          name="username"
          placeholder="Ejemplo123"
          value={username}
          required
          onChange={(e) => setUsername(e.target.value)}
        />

        <label htmlFor="email">Correo electrónico:</label>
        <input
          type="email"
          id="email"
          name="email"
          placeholder="correo@ejemplo.com"
          value={email}
          required
          onChange={(e) => setEmail(e.target.value)}
        />

        <label htmlFor="password">Contraseña:</label>
        <input
          type="password"
          id="password"
          name="password"
          placeholder="Contraseña"
          value={password}
          required
          onChange={(e) => setPassword(e.target.value)}
        />

        <label htmlFor="confirm-password">Confirmar contraseña:</label>
        <input
          type="password"
          id="confirm-password"
          name="confirm-password"
          placeholder="Repite tu contraseña"
          value={confirmPassword}
          required
          onChange={(e) => setConfirmPassword(e.target.value)}
        />

        <button type="submit">Registrarse</button>

        <p className="register-text">
          ¿Ya tienes una cuenta?{" "}
          <Link to="/login" className="register-link">
            Iniciar sesión
          </Link>
        </p>
      </form>
    </div>
  );
}
