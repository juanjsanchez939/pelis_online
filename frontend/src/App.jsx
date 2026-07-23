import { Routes, Route } from 'react-router-dom'
import Navbar from './components/navbar.jsx'
import { Products } from './components/products.jsx'
import { useState, useEffect, useMemo } from 'react'
import axios from 'axios'
import { Header } from './components/Header.jsx'
import { Footer } from './components/Footer.jsx'
import { useFilters } from './hooks/useFilters.js'
import { API_BASE_URL } from './utils/shared.js'
import Login from './pages/Login.jsx'
import Register from "./pages/Register.jsx"
import ProductPage from './pages/ProductPage.jsx';
import Ayuda from './pages/Ayuda.jsx'
import UserPanel from './pages/UserPanel.jsx'
import AdminPanel from './pages/AdminPanel.jsx'
import Banner from './components/Banner.jsx'
import OnlineUsers from './components/OnlineUsers.jsx'
import GenreSidebar from './components/GenreSidebar.jsx'

function App() {
  const [products, setProducts] = useState([]);
  const { filterProducts } = useFilters()

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/movies`);
        setProducts(res.data);
      } catch (e) {
        console.error('Error fetching movies:', e);
      }
    };
    fetchMovies();
  }, []);

  const topRated = useMemo(() => {
    return [...products].sort((a, b) => b.rating - a.rating).slice(0, 10);
  }, [products]);

  const [expandedGenre, setExpandedGenre] = useState(null)
  const [activeTab, setActiveTab] = useState("top10")

  const genres = useMemo(() => {
    const genreMap = {};
    products.forEach(p => {
      const cat = p.category?.[0];
      if (cat && !genreMap[cat]) genreMap[cat] = [];
      if (cat) genreMap[cat].push(p);
    });
    return genreMap;
  }, [products]);

  const [theme, setTheme] = useState("dark-theme");

  useEffect(() => {
    document.body.className = theme;
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "dark-theme" ? "light-theme" : "dark-theme"));
  }

  const filteredGenres = useMemo(() => {
    const result = {};
    Object.entries(genres).forEach(([genre, movies]) => {
      result[genre] = filterProducts(movies);
    });
    return result;
  }, [genres, filterProducts]);

  return (
    <>
      <Navbar theme={theme} toggleTheme={toggleTheme} />

      <Routes>
        <Route
          path="/"
          element={
            <>
              <Banner />
              <Header />

              <div className="catalog-tabs">
                <button
                  className={`tab-btn ${activeTab === "top10" ? "active" : ""}`}
                  onClick={() => { setActiveTab("top10"); setExpandedGenre(null); }}
                >
                  <span className="tab-icon">⭐</span>
                  Top 10
                </button>
                <button
                  className={`tab-btn ${activeTab === "genres" ? "active" : ""}`}
                  onClick={() => setActiveTab("genres")}
                >
                  <span className="tab-icon">🎬</span>
                  Géneros
                </button>
              </div>

              {activeTab === "top10" && (
                <>
                  <p className="section-subtitle" style={{ paddingLeft: 16 }}>Las mejores calificaciones de nuestra comunidad</p>
                  <Products products={topRated} limit={10} />
                </>
              )}

              {activeTab === "genres" && (
                <div className="catalog-layout">
                  <GenreSidebar
                    selectedGenre={expandedGenre}
                    onSelectGenre={setExpandedGenre}
                    filteredGenres={filteredGenres}
                  />
                  <div className="catalog-content">
                    {expandedGenre && filteredGenres[expandedGenre] && (
                      filteredGenres[expandedGenre].length > 0 ? (
                        <Products products={filteredGenres[expandedGenre]} />
                      ) : (
                        <p className="genre-prompt">No hay resultados para "{expandedGenre}" con los filtros actuales</p>
                      )
                    )}
                    {!expandedGenre && (
                      <p className="genre-prompt">Seleccioná un género en la barra lateral para ver las películas</p>
                    )}
                  </div>
                </div>
              )}

              <Footer />
            </>
          }
        />
        <Route path="/product/:id" element={<ProductPage />} />
        <Route path="/ayuda" element={<Ayuda />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/perfil" element={<UserPanel />} />
        <Route path="/admin" element={<AdminPanel />} />
      </Routes>

      <div style={{
        position: "fixed", bottom: 24, right: 24, zIndex: 999
      }}>
        <OnlineUsers />
      </div>
    </>
  )
}

export default App;

