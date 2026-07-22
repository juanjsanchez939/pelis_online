import { useContext, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { products as initialProducts } from "../mocks/products.json";
import { useFavs } from "../hooks/useFavs.js";
import { SnackbarContext } from "../context/snackbarContext.js";
import { UserContext } from "../context/UserContext.js";
import "./ProductPage.css";
import { HeartIcon, HeartFilledIcon } from "../components/icons.jsx";

function Stars({ rating }) {
  const full = Math.floor(rating);
  const half = rating % 1 >= 0.5;
  const empty = 5 - full - (half ? 1 : 0);
  return (
    <div className="product-rating">
      {[...Array(full)].map((_, i) => <span key={`f${i}`} className="star">★</span>)}
      {half && <span className="star">★</span>}
      {[...Array(empty)].map((_, i) => <span key={`e${i}`} className="star empty">★</span>)}
      <span className="rating-value">{rating.toFixed(1)}</span>
    </div>
  );
}

export default function ProductPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(UserContext);

  useEffect(() => {
    if (!user) {
      navigate(`/login?redirect=/product/${id}`);
    }
  }, [user, id, navigate]);

  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [id]);

  const movie = initialProducts.find((p) => p.id === parseInt(id));

  if (!user) return <p className="auth-message">Inicia sesión para ver esta película</p>;
  if (!movie) return <p>Película no encontrada</p>;

  const { toggleFav, isFav } = useFavs();
  const { showSnackbar } = useContext(SnackbarContext);

  const inFav = isFav(movie.id);

  const [newComment, setNewComment] = useState("");
  const [commentRating, setCommentRating] = useState(5);
  const [comments, setComments] = useState(movie.comments || []);

  const handleFavClick = () => {
    toggleFav(movie);
    if (inFav) {
      showSnackbar(`Quitaste "${movie.title}" de favoritos`, "error");
    } else {
      showSnackbar(`Agregaste "${movie.title}" a favoritos`, "success");
    }
  };

  const handleSubmitComment = (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    const comment = {
      user: user?.username || "Anónimo",
      text: newComment.trim(),
      rating: commentRating,
      date: new Date().toISOString().split("T")[0],
    };
    setComments((prev) => [comment, ...prev]);
    setNewComment("");
    setCommentRating(5);
    showSnackbar("Comentario publicado", "success");
  };

  return (
    <div className="page-wrapper">
      <div className="page-content">

        <div className="product-container">
          <div className="product-image">
            <img src={movie.thumbnail} alt={movie.title} />
          </div>

          <div className="product-info">
            <h1>{movie.title}</h1>
            <p className="year">{movie.year}</p>
            <p className="duration">{movie.duration}</p>
            <p className="director">Director: {movie.director}</p>
            <p className="category-tag">{movie.category[0]}</p>
            {movie.rating && <Stars rating={movie.rating} />}

            <button className="buy-button" onClick={handleFavClick}>
              {inFav ? <HeartFilledIcon /> : <HeartIcon />}
              {inFav ? " Quitar de favoritos" : " Agregar a favoritos"}
            </button>
          </div>
        </div>

        {movie.cast && movie.cast.length > 0 && (
          <section className="cast-section">
            <h2>Reparto</h2>
            <div className="cast-grid">
              {movie.cast.map((actor, i) => (
                <div key={i} className="cast-card">
                  <span className="cast-avatar">🎬</span>
                  <span className="cast-name">{actor}</span>
                </div>
              ))}
            </div>
          </section>
        )}

        <section className="descripcion-producto">
          <h2>Sinopsis</h2>
          <div className="descripcion">
            <p>{movie.description}</p>
          </div>
          <div className="caracteristicas">
            <h3>Detalles</h3>
            <h4>Año: {movie.year}</h4>
            <h4>Duración: {movie.duration}</h4>
            <h4>Director: {movie.director}</h4>
            <h4>Género: {movie.category[0]}</h4>
          </div>
        </section>

        {movie.trailer && (
          <section className="trailer-section">
            <h2>Tráiler</h2>
            <div className="trailer-container">
              <iframe
                src={movie.trailer}
                title={`Tráiler de ${movie.title}`}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </section>
        )}

        <section className="comments-section">
          <h2>Comentarios</h2>

          <form className="comment-form" onSubmit={handleSubmitComment}>
            <div className="comment-rating-select">
              <span className="rating-label">Tu puntuación:</span>
              <div className="stars-select">
                {[1, 2, 3, 4, 5].map((star) => (
                  <span
                    key={star}
                    className={`star-clickable ${star <= commentRating ? "active" : ""}`}
                    onClick={() => setCommentRating(star)}
                  >
                    ★
                  </span>
                ))}
              </div>
            </div>
            <textarea
              className="comment-input"
              placeholder="Deja tu comentario sobre esta película..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              rows={3}
            />
            <button type="submit" className="comment-submit-btn">
              Publicar comentario
            </button>
          </form>

          <div className="comments-list">
            {comments.length === 0 ? (
              <p className="no-comments">Sé el primero en comentar</p>
            ) : (
              comments.map((c, i) => (
                <div key={i} className="comment-card">
                  <div className="comment-header">
                    <span className="comment-avatar">👤</span>
                    <span className="comment-user">{c.user}</span>
                    <span className="comment-date">{c.date}</span>
                    <span className="comment-rating">
                      {"★".repeat(c.rating)}
                      {"☆".repeat(5 - c.rating)}
                    </span>
                  </div>
                  <p className="comment-text">{c.text}</p>
                </div>
              ))
            )}
          </div>
        </section>

      </div>
    </div>
  );
}
