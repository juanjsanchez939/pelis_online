import { useContext, useEffect, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import axios from "axios";
import { useFavs } from "../hooks/useFavs.js";
import { SnackbarContext } from "../context/snackbarContext.js";
import { UserContext } from "../context/UserContext.js";
import "./ProductPage.css";
import { HeartIcon, HeartFilledIcon } from "../components/icons.jsx";
import { getImageUrl, API_BASE_URL } from "../utils/shared.js";
import { useTranslation } from "react-i18next";

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
  const [searchParams] = useSearchParams();
  const isTv = searchParams.get("type") === "tv";
  const { user } = useContext(UserContext);
  const { t } = useTranslation();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [id]);

  useEffect(() => {
    const fetchMovie = async () => {
      try {
        const isNumeric = /^\d+$/.test(id);
        let url;
        if (isTv && isNumeric) {
          url = `${API_BASE_URL}/tmdb/tv/${id}`;
        } else if (isNumeric) {
          url = `${API_BASE_URL}/tmdb/movie/${id}`;
        } else {
          url = `${API_BASE_URL}/movies/${id}`;
        }
        const res = await axios.get(url);
        setMovie(res.data);
      } catch (e) {
        console.error('Error fetching movie:', e);
      } finally {
        setLoading(false);
      }
    };
    fetchMovie();
  }, [id, isTv]);

  const { toggleFav, isFav } = useFavs();
  const { showSnackbar } = useContext(SnackbarContext);
  const [newComment, setNewComment] = useState("");
  const [commentRating, setCommentRating] = useState(5);
  const [comments, setComments] = useState([]);

  useEffect(() => {
    if (movie) {
      setComments(movie.comments || []);
    }
  }, [movie]);

  if (loading) return <p className="auth-message">Cargando...</p>;
  if (!movie) return <p>{t('product.notFound')}</p>;

  const inFav = isFav(movie.id);

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
            <img src={getImageUrl(movie.thumbnail)} alt={movie.title} />
          </div>

          <div className="product-info">
            <h1>{movie.title}</h1>
            <p className="year">{movie.year}</p>
            <p className="duration">{movie.duration}</p>
            <p className="director">{t('product.director')}: {movie.director}</p>
            <p className="category-tag">{movie.category?.[0]}</p>
            {movie.rating && <Stars rating={movie.rating} />}

            {user && (
            <button className="buy-button" onClick={handleFavClick}>
              {inFav ? <HeartFilledIcon /> : <HeartIcon />}
              {inFav ? " Quitar de favoritos" : " Agregar a favoritos"}
            </button>
            )}
          </div>
        </div>

        {movie.cast && movie.cast.length > 0 && (
          <section className="cast-section">
            <h2>{t('product.cast')}</h2>
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
          <h2>{t('product.synopsis')}</h2>
          <div className="descripcion">
            <p>{movie.description}</p>
          </div>
          <div className="caracteristicas">
            <h3>{t('product.details')}</h3>
            <h4>{t('product.year')}: {movie.year}</h4>
            <h4>{t('product.duration')}: {movie.duration}</h4>
            <h4>{t('product.director')}: {movie.director}</h4>
            <h4>{t('product.genre')}: {movie.category?.[0]}</h4>
          </div>
        </section>

        {movie.trailer && (
          <section className="trailer-section">
            <h2>{t('product.trailer')}</h2>
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
          <h2>{t('product.comments')}</h2>

          {user && (
          <form className="comment-form" onSubmit={handleSubmitComment}>
            <div className="comment-rating-select">
              <span className="rating-label">{t('product.yourRating')}:</span>
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
              placeholder={t('product.leaveComment')}
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              rows={3}
            />
            <button type="submit" className="comment-submit-btn">
              {t('product.publish')}
            </button>
          </form>
          )}

          <div className="comments-list">
            {comments.length === 0 ? (
              <p className="no-comments">{t('product.firstComment')}</p>
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
