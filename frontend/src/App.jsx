import { Routes, Route, useNavigate } from 'react-router-dom'
import Navbar from './components/navbar.jsx'
import { Products } from './components/products.jsx'
import { products as initialProducts } from './mocks/products.json'
import { useState, useEffect, useContext, useMemo } from 'react'
import { Header } from './components/Header.jsx'
import { Footer } from './components/Footer.jsx'
import { useFilters } from './hooks/useFilters.js'
import { UserContext } from './context/UserContext.js'
import Login from './pages/Login.jsx'
import Register from "./pages/Register.jsx"
import ProductPage from './pages/ProductPage.jsx';
import Ayuda from './pages/Ayuda.jsx'
import UserPanel from './pages/UserPanel.jsx'
import AdminPanel from './pages/AdminPanel.jsx'
import Banner from './components/Banner.jsx'
import OnlineUsers from './components/OnlineUsers.jsx'

function App() {
  const navigate = useNavigate()
  const { user } = useContext(UserContext)
  const [products] = useState(initialProducts)
  const { filterProducts } = useFilters()
  const filteredProducts = filterProducts(products)

  const topRated = useMemo(() => {
    return [...products].sort((a, b) => b.rating - a.rating).slice(0, 10);
  }, [products]);

  const [expandedGenre, setExpandedGenre] = useState(null)

  const genres = useMemo(() => {
    const genreMap = {};
    products.forEach(p => {
      const cat = p.category[0];
      if (!genreMap[cat]) genreMap[cat] = [];
      genreMap[cat].push(p);
    });
    return genreMap;
  }, [products]);

  const genreOrder = ["Acción", "Aventura", "Animadas", "Bélicas", "Comedias", "Terror"];
  const genreIcons = { "Acción": "💥", "Aventura": "🗺️", "Animadas": "🎬", "Bélicas": "🎖️", "Comedias": "😂", "Terror": "👻" };

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

              <section className="top-rated">
                <div className="section-header">
                  <span className="icon">⭐</span>
                  <h2 className="section-title">Top 10 Mejor Valoradas</h2>
                </div>
                <p className="section-subtitle">Las mejores calificaciones de nuestra comunidad</p>
              </section>
              <Products products={topRated} limit={10} />

              {!user ? (
                <div className="ver-mas-container">
                  <button className="ver-mas-btn" onClick={() => navigate('/login')}>
                    Iniciá sesión para ver el catálogo completo
                  </button>
                </div>
              ) : (
                <>
                  <section className="top-rated" style={{ marginTop: '1rem' }}>
                    <div className="section-header">
                      <span className="icon">🎬</span>
                      <h2 className="section-title">Catálogo por Género</h2>
                    </div>
                    <p className="section-subtitle">Seleccioná un género para explorar las películas</p>
                  </section>

                  <div className="genre-buttons">
                    {genreOrder.map(genre => (
                      <button
                        key={genre}
                        className={`genre-btn ${expandedGenre === genre ? 'active' : ''}`}
                        onClick={() => setExpandedGenre(expandedGenre === genre ? null : genre)}
                      >
                        <span className="genre-icon">{genreIcons[genre]}</span>
                        {genre}
                        <span className="genre-count">({filteredGenres[genre]?.length || 0})</span>
                      </button>
                    ))}
                  </div>

                  {expandedGenre && filteredGenres[expandedGenre] && (
                    filteredGenres[expandedGenre].length > 0 ? (
                      <Products products={filteredGenres[expandedGenre]} />
                    ) : (
                      <p className="genre-prompt">No hay resultados para "{expandedGenre}" con los filtros actuales</p>
                    )
                  )}

                  {!expandedGenre && (
                    <p className="genre-prompt">Seleccioná un género arriba para ver las películas</p>
                  )}
                </>
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
