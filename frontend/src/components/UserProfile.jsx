import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../context/UserContext";
import "./UserProfile.css";

export function UserProfile() {
  const { user, logout } = useContext(UserContext);
  const navigate = useNavigate();

  if (!user) {
    return null; // No mostrar nada si no hay usuario
  }

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="user-profile">
      <span className="user-name">👤 {user.username}</span>
      <button className="logout-btn" onClick={handleLogout}>
        Cerrar Sesión
      </button>
    </div>
  );
}
