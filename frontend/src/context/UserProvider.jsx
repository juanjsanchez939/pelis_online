import { useState } from "react";
import { UserContext } from "./UserContext";

export function UserProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("user");
    return saved ? JSON.parse(saved) : null;
  });

  const [token, setToken] = useState(() => {
    return localStorage.getItem("token") || null;
  });

  const login = (userData, jwtToken) => {
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
    if (jwtToken) {
      setToken(jwtToken);
      localStorage.setItem("token", jwtToken);
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
  };

  return (
    <UserContext.Provider value={{ user, token, login, logout }}>
      {children}
    </UserContext.Provider>
  );
}