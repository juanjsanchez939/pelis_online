import { useState, useEffect } from "react";
import "./OnlineUsers.css";

const FAKE_USERS = [
  { name: "María G.", avatar: "👩🏻" },
  { name: "Carlos R.", avatar: "👨🏽" },
  { name: "Lucía M.", avatar: "👩🏼" },
  { name: "Pedro S.", avatar: "👨🏻" },
  { name: "Ana L.", avatar: "👩🏽" },
  { name: "Diego F.", avatar: "👨🏼" },
  { name: "Sofía C.", avatar: "👩🏻" },
  { name: "Martín P.", avatar: "👨🏽" },
  { name: "Valentina T.", avatar: "👩🏼" },
  { name: "Jorge H.", avatar: "👨🏻" },
  { name: "Camila D.", avatar: "👩🏽" },
  { name: "Andrés V.", avatar: "👨🏼" },
];

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

const ACTIVITIES = [
  "viendo el catálogo",
  "mirando un tráiler",
  "leyendo reseñas",
  "agregando a favoritos",
  "buscando películas",
  "viendo detalles",
  "explorando géneros",
  "descubriendo novedades",
];

export default function OnlineUsers() {
  const [users, setUsers] = useState([]);
  const [onlineCount, setOnlineCount] = useState(0);
  const [collapsed, setCollapsed] = useState(true);

  useEffect(() => {
    const count = getRandomInt(23, 48);
    setOnlineCount(count);

    const shuffled = [...FAKE_USERS].sort(() => 0.5 - Math.random());
    const selected = shuffled.slice(0, Math.min(count, FAKE_USERS.length));
    const withActivity = selected.map((u) => ({
      ...u,
      activity: ACTIVITIES[getRandomInt(0, ACTIVITIES.length - 1)],
    }));
    setUsers(withActivity);

    const interval = setInterval(() => {
      const newCount = getRandomInt(23, 48);
      setOnlineCount(newCount);
    }, 15000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className={`online-users-widget ${collapsed ? "collapsed" : ""}`}>
      <button
        className="online-users-toggle"
        onClick={() => setCollapsed(!collapsed)}
        title={collapsed ? "Mostrar usuarios online" : "Ocultar"}
      >
        <span className="online-dot" />
        <span className="online-count-badge">{onlineCount}</span>
        <span className="toggle-arrow">{collapsed ? "▲" : "▼"}</span>
      </button>

      {!collapsed && (
        <div className="online-users-body">
          <div className="online-users-header">
            <span className="online-dot" />
            <span className="online-title">Usuarios en línea</span>
            <span className="online-count-badge">{onlineCount}</span>
          </div>

          <ul className="online-users-list">
            {users.map((u, i) => (
              <li key={i} className="online-user-item">
                <span className="online-user-avatar">{u.avatar}</span>
                <div className="online-user-info">
                  <span className="online-user-name">{u.name}</span>
                  <span className="online-user-activity">{u.activity}</span>
                </div>
                <span className="online-indicator" />
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
