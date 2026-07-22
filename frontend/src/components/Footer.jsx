import './Footer.css'
import { Link } from "react-router-dom";

export function Footer () {
  return (
    <footer className='footer'>
      <div className="footer-film-top" />

      <div className="footer-cinema-scene">
        <div className="cinema-lights">
          <div className="light-bulb l1" />
          <div className="light-bulb l2" />
          <div className="light-bulb l3" />
          <div className="light-bulb l4" />
          <div className="light-bulb l5" />
          <div className="light-bulb l6" />
          <div className="light-bulb l7" />
          <div className="light-bulb l8" />
        </div>

        <div className="snack-bar">
          <div className="popcorn-bucket">
            <div className="popcorn-piece p1" />
            <div className="popcorn-piece p2" />
            <div className="popcorn-piece p3" />
            <div className="popcorn-piece p4" />
          </div>

          <div className="soda-cup">
            <div className="soda-straw" />
            <div className="soda-bubbles">
              <span className="bubble" /><span className="bubble" /><span className="bubble" />
            </div>
          </div>

          <div className="ticket-stub">
            <div className="ticket-hole" />
            <span className="ticket-text">PELIS</span>
          </div>

          <div className="popcorn-bucket right">
            <div className="popcorn-piece p1" />
            <div className="popcorn-piece p2" />
            <div className="popcorn-piece p3" />
          </div>
        </div>
      </div>

      <div className="footer-content">
        <div className="footer-marquee">
          <span>🎬 AHORA EN CARTELERA 🍿 LAS MEJORES PELÍCULAS 🎥 EN UN SOLO LUGAR 🎞️ PELISONLINE 🎬</span>
        </div>

        <p className='copyright'>© 2025 PelisOnline — Todos los derechos reservados</p>

        <Link to="/ayuda">
          <button className='boton-ayuda'>¿Necesitas ayuda?</button>
        </Link>
      </div>

      <div className="footer-film-bottom" />
    </footer>
  )
}
