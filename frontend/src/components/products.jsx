import { useFavs } from "../hooks/useFavs.js";
import { HeartIcon, HeartFilledIcon } from "./icons.jsx";
import "./products.css";
import { Link } from "react-router-dom";
import { useContext } from "react";
import { SnackbarContext } from "../context/snackbarContext.js";
import { UserContext } from "../context/UserContext.js";
import { getImageUrl } from "../utils/shared.js";

export function Products({ products, limit }) {
  const displayed = limit ? products.slice(0, limit) : products;
  const { toggleFav, isFav } = useFavs();
  const { showSnackbar } = useContext(SnackbarContext);
  const { user } = useContext(UserContext);

  const handleFavAction = (movie) => {
    toggleFav(movie);
    if (isFav(movie.id)) {
      showSnackbar(`Quitaste "${movie.title}" de favoritos`, "error");
    } else {
      showSnackbar(`Agregaste "${movie.title}" a favoritos`, "success");
    }
  };

  return (
    <section className="products">
      <div className="product-grid">
        {displayed.map((movie, idx) => {
          const fav = isFav(movie.id);

          return (
            <div key={movie.id} className="product-card" style={{ animationDelay: `${Math.min(idx * 0.05, 1)}s` }}>
              <Link to={`/product/${movie.id}`} className="product-link">
                <div className="image-wrapper">
                  <img src={getImageUrl(movie.thumbnail)} alt={movie.title} />
                  {movie.rating && (
                    <span className="rating-badge">★ {movie.rating.toFixed(1)}</span>
                  )}
                </div>
                <h3>{movie.title}</h3>
                <p className="price">{movie.year}</p>
                <p className="category-tag">{movie.category?.[0]}</p>
              </Link>

              {user && (
              <button
                className={`btn-fav ${fav ? "fav-active" : ""}`}
                onClick={() => handleFavAction(movie)}
              >
                {fav ? <HeartFilledIcon /> : <HeartIcon />}
                {fav ? " Favorito" : " Agregar a favoritos"}
              </button>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
