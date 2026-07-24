import { Routes, Route } from 'react-router-dom'
import Navbar from './components/navbar.jsx'
import { Products } from './components/products.jsx'
import { useState, useEffect, useMemo, useContext } from 'react'
import axios from 'axios'
import { Header } from './components/Header.jsx'
import { Footer } from './components/Footer.jsx'
import { API_BASE_URL } from './utils/shared.js'
import { UserContext } from './context/UserContext.js'
import { useTranslation } from 'react-i18next'
import Login from './pages/Login.jsx'

import Register from "./pages/Register.jsx"
import ProductPage from './pages/ProductPage.jsx';
import Ayuda from './pages/Ayuda.jsx'
import UserPanel from './pages/UserPanel.jsx'
import AdminPanel from './pages/AdminPanel.jsx'
import Banner from './components/Banner.jsx'
import OnlineUsers from './components/OnlineUsers.jsx'
import TmdbSection from './components/TmdbSection.jsx'

function App() {
  const { t } = useTranslation();
  const { user } = useContext(UserContext)
  const [products, setProducts] = useState([]);
  const [activeTab, setActiveTab] = useState("estreno2026")

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

  const releases2026 = useMemo(() => {
    return products.filter(p => p.year === 2026);
  }, [products]);

  const [theme, setTheme] = useState("dark-theme");

  useEffect(() => {
    document.body.className = theme;
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "dark-theme" ? "light-theme" : "dark-theme"));
  }

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
                  className={`tab-btn ${activeTab === "estreno2026" ? "active" : ""}`}
                  onClick={() => setActiveTab("estreno2026")}
                >
                  <span className="tab-icon">🆕</span>
                  {t('tabs.estreno2026')}
                </button>
                <button
                  className={`tab-btn ${activeTab === "peliculas" ? "active" : ""}`}
                  onClick={() => setActiveTab("peliculas")}
                >
                  <span className="tab-icon">🎬</span>
                  {t('tabs.peliculas')}
                </button>
                <button
                  className={`tab-btn ${activeTab === "series" ? "active" : ""}`}
                  onClick={() => setActiveTab("series")}
                >
                  <span className="tab-icon">📺</span>
                  {t('tabs.series')}
                </button>
              </div>

              {activeTab === "estreno2026" && (
                <>
                  <div className="cinema-header">
                    <div className="cinema-strip" />
                    <h2 className="cinema-title">
                      <span className="cinema-star">★</span> {t('estreno.title')} <span className="cinema-star">★</span>
                    </h2>
                    <p className="cinema-subtitle">{t('estreno.subtitle')}</p>
                    <div className="cinema-strip" />
                  </div>
                  <Products products={user ? releases2026 : releases2026.slice(0, 5)} limit={user ? undefined : 5} />
                  {!user && (
                    <p style={{ textAlign: 'center', padding: '20px', color: '#aaa' }}>
                      <a href="/login" style={{ color: '#e50914' }}>{t('estreno.loginPrompt')}</a> {t('estreno.toSee', { count: releases2026.length })}
                    </p>
                  )}
                </>
              )}

              {activeTab === "peliculas" && (
                <TmdbSection mode="movies" />
              )}

              {activeTab === "series" && (
                <TmdbSection mode="tv" />
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
