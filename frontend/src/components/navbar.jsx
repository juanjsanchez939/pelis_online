import { useContext, useState, useRef, useEffect, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserContext } from "../context/UserContext.js";
import { FiltersContext } from "../context/FiltersContext.js";
import { products as allProducts } from "../mocks/products.json";
import "./navbar.css";

const DarkIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
    <path fillRule="evenodd" d="M9.528 1.718a.75.75 0 0 1 .162.819A8.97 8.97 0 0 0 9 6a9 9 0 0 0 9 9 8.97 8.97 0 0 0 3.463-.69.75.75 0 0 1 .981.98 10.503 10.503 0 0 1-9.694 6.46c-5.799 0-10.5-4.7-10.5-10.5 0-4.368 2.667-8.112 6.46-9.694a.75.75 0 0 1 .818.162Z" clipRule="evenodd" />
  </svg>
);

const LightIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
    <path d="M12 2.25a.75.75 0 0 1 .75.75v2.25a.75.75 0 0 1-1.5 0V3a.75.75 0 0 1 .75-.75ZM7.5 12a4.5 4.5 0 1 1 9 0 4.5 4.5 0 0 1-9 0ZM18.894 6.166a.75.75 0 0 0-1.06-1.06l-1.591 1.59a.75.75 0 1 0 1.06 1.061l1.591-1.59ZM21.75 12a.75.75 0 0 1-.75.75h-2.25a.75.75 0 0 1 0-1.5H21a.75.75 0 0 1 .75.75ZM17.834 18.894a.75.75 0 0 0 1.06-1.06l-1.59-1.591a.75.75 0 1 0-1.061 1.06l1.59 1.591ZM12 18a.75.75 0 0 1 .75.75V21a.75.75 0 0 1-1.5 0v-2.25A.75.75 0 0 1 12 18ZM7.758 17.303a.75.75 0 0 0-1.061-1.06l-1.591 1.59a.75.75 0 0 0 1.06 1.061l1.591-1.59ZM6 12a.75.75 0 0 1-.75.75H3a.75.75 0 0 1 0-1.5h2.25A.75.75 0 0 1 6 12ZM6.697 7.757a.75.75 0 0 0 1.06-1.06l-1.59-1.591a.75.75 0 0 0-1.061 1.06l1.59 1.591Z" />
  </svg>
);

const FilmReelIcon = () => (
  <div className="film-reel">
    <div className="reel-circle">
      <div className="reel-inner" />
    </div>
  </div>
);

const Navbar = ({ theme, toggleTheme }) => {
  const { user, logout } = useContext(UserContext);
  const { setFilters } = useContext(FiltersContext);
  const navigate = useNavigate();
  const [searchText, setSearchText] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const searchRef = useRef(null);
  const dropdownRef = useRef(null);

  const results = useMemo(() => {
    if (searchText.trim().length < 2) return [];
    const query = searchText.toLowerCase();
    return allProducts
      .filter(p =>
        p.title.toLowerCase().includes(query) ||
        p.description.toLowerCase().includes(query)
      )
      .slice(0, 8);
  }, [searchText]);

  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target) &&
          searchRef.current && !searchRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const handleSearch = (e) => {
    const val = e.target.value;
    setSearchText(val);
    setShowDropdown(val.trim().length >= 2);
    setFilters((prev) => ({
      ...prev,
      searchQuery: val
    }));
  };

  const handleResultClick = (id) => {
    setShowDropdown(false);
    setSearchText("");
    setFilters((prev) => ({ ...prev, searchQuery: "" }));
    navigate(`/product/${id}`);
  };

  return (
    <header className="navbar">
      <Link to="/" className="logo">
        <FilmReelIcon />
        <span className="logo-text">
          Pelis<span className="logo-accent">Online</span>
        </span>
      </Link>

      <nav className="nav-links">
        <Link to="/">Inicio</Link>
        <Link to="/ayuda">Más Info</Link>
        {user && <Link to="/perfil">Mi Perfil</Link>}
        {user?.roles?.includes("admin") && <Link to="/admin">Admin</Link>}
      </nav>

      <div className="actions">
        {user ? (
          <>
            <span className="user-welcome">👤 {user.username}</span>
            <button className="logout-nav-btn" onClick={handleLogout}>
              CERRAR SESIÓN
            </button>
          </>
        ) : (
          <Link to="/login">
            <button className="login-nav-btn">INICIAR SESIÓN</button>
          </Link>
        )}

        <div className="search-wrapper" ref={dropdownRef}>
          <input
            ref={searchRef}
            type="text"
            placeholder="Buscar películas..."
            className="search"
            value={searchText}
            onChange={handleSearch}
            onFocus={() => { if (searchText.trim().length >= 2) setShowDropdown(true); }}
          />
          {showDropdown && results.length > 0 && (
            <div className="search-dropdown">
              {results.map(movie => (
                <div
                  key={movie.id}
                  className="search-result-item"
                  onClick={() => handleResultClick(movie.id)}
                >
                  <img src={movie.thumbnail} alt={movie.title} />
                  <div className="search-result-info">
                    <span className="search-result-title">{movie.title}</span>
                    <span className="search-result-meta">{movie.year} | {movie.category[0]} | ★ {movie.rating}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
          {showDropdown && searchText.trim().length >= 2 && results.length === 0 && (
            <div className="search-dropdown">
              <p className="search-no-results">No se encontraron películas</p>
            </div>
          )}
        </div>

        <button className="theme-toggle-btn" onClick={toggleTheme} title="Cambiar tema">
          {theme === "dark-theme" ? <LightIcon /> : <DarkIcon />}
        </button>
      </div>
    </header>
  );
};

export default Navbar;
