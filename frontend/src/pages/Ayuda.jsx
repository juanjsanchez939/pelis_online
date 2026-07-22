import { useState } from "react";
import "./Ayuda.css";

function FaqItem({ question, children }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="faq-item">
      <button
        className="faq-question"
        onClick={() => setOpen(!open)}
      >
        {question}
      </button>

      <div className={`faq-answer ${open ? "open" : ""}`}>
        {children}
      </div>
    </div>
  );
}

export default function Ayuda() {
  return (
    <main className="ayuda-container">

      <section className="sobre-nosotros">
        <h2>Más Información</h2>
        <p>
          En <strong>PelisOnline</strong> encontrás un catálogo curado de las mejores películas
          de todos los géneros. Para información más detallada sobre cada película, ratings
          de la crítica, fichas técnicas completas y más, te recomendamos visitar IMDb.
        </p>
        <a
          href="https://www.imdb.com/es/"
          target="_blank"
          rel="noopener noreferrer"
          className="imdb-link-btn"
        >
          Ir a IMDb
        </a>
      </section>

      <section className="como-funciona">
        <h2>¿Cómo funciona?</h2>
        <p>
          En PelisOnline podés explorar nuestro catálogo de películas organizadas por género,
          buscar tus títulos favoritos y agregarlos a tu lista personal de favoritos.
        </p>

        <h2>Proceso</h2>
        <ol>
          <li><strong>Explorá el catálogo</strong> y descubrí películas de todos los géneros.</li>
          <li><strong>Agregá a favoritos</strong> las películas que más te gusten.</li>
          <li><strong>Accedé rápido</strong> a tu lista personalizada desde el menú.</li>
        </ol>
      </section>

      <section className="imdb-section">
        <h2>Buscar en IMDb</h2>
        <p>
          ¿Querés más información sobre una película específica? Buscala directamente en IMDb
          para ver puntuaciones, reseñas de críticos, elenco completo, trivia y mucho más.
        </p>
        <form
          className="imdb-search-form"
          onSubmit={(e) => {
            e.preventDefault();
            const query = e.target.elements.search.value.trim();
            if (query) {
              window.open(`https://www.imdb.com/find/?q=${encodeURIComponent(query)}`, '_blank');
            }
          }}
        >
          <input
            name="search"
            type="text"
            placeholder="Ej: El Padrino, Shrek, Harry Potter..."
            className="imdb-search-input"
          />
          <button type="submit" className="imdb-search-btn">
            Buscar en IMDb
          </button>
        </form>
      </section>

      <section className="faq">
        <h2>Preguntas Frecuentes</h2>

        <FaqItem question="¿Cómo agrego una película a favoritos?">
          <p>Hacé clic en el corazón que aparece en cada película del catálogo. También podés hacerlo desde la página de detalle de cada película.</p>
        </FaqItem>

        <FaqItem question="¿Dónde veo mis películas favoritas?">
          <p>Hacé clic en el botón del corazón en la esquina superior izquierda de la pantalla para abrir tu lista de favoritos.</p>
        </FaqItem>

        <FaqItem question="¿Cómo elimino una película de favoritos?">
          <p>Desde la lista de favoritos, hacé clic en la X junto a la película que quieras eliminar. También podés volver a hacer clic en el corazón desde el catálogo.</p>
        </FaqItem>

      </section>

    </main>
  );
}
