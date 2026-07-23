import "./GenreSidebar.css";
import { GENRE_ORDER, GENRE_ICONS } from "../utils/shared.js";

export default function GenreSidebar({ selectedGenre, onSelectGenre, filteredGenres }) {
  return (
    <aside className="genre-sidebar">
      <h3 className="genre-sidebar-title">Géneros</h3>
      <ul className="genre-sidebar-list">
        {GENRE_ORDER.map(genre => (
          <li key={genre}>
            <button
              className={`genre-sidebar-btn ${selectedGenre === genre ? "active" : ""}`}
              onClick={() => onSelectGenre(selectedGenre === genre ? null : genre)}
            >
              <span className="genre-icon">{GENRE_ICONS[genre]}</span>
              <span className="genre-label">{genre}</span>
              <span className="genre-count">{filteredGenres[genre]?.length || 0}</span>
            </button>
          </li>
        ))}
      </ul>
    </aside>
  );
}
