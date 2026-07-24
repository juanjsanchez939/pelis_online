import { useState, useEffect, useContext, useMemo } from "react";
import axios from "axios";
import { Products } from "./products.jsx";
import { API_BASE_URL } from "../utils/shared.js";
import { UserContext } from "../context/UserContext.js";
import { useTranslation } from "react-i18next";

const ICONS = {
    popular: "🔥", "now-playing": "🎟️", upcoming: "📅", "top-rated": "⭐",
    "airing-today": "🕐", "on-the-air": "📡",
};

const MOVIE_KEYS = ["popular", "now-playing", "upcoming", "top-rated"];
const TV_KEYS = ["popular", "airing-today", "on-the-air", "top-rated"];

export default function TmdbSection({ mode = "movies" }) {
    const { t } = useTranslation();
    const { user } = useContext(UserContext);
    const endpoint = mode === "tv" ? "/tv/all" : "/movies/all";
    const keys = mode === "tv" ? TV_KEYS : MOVIE_KEYS;
    const catKey = mode === "tv" ? "tv" : "movies";

    const categories = useMemo(() => keys.map(key => ({
        key,
        label: t(`tmdb.categories.${catKey}.${key}`),
        icon: ICONS[key] || "🎬",
    })), [t, catKey, keys]);

    const [items, setItems] = useState([]);
    const [cat, setCat] = useState("");

    useEffect(() => {
        axios.get(`${API_BASE_URL}${endpoint}`)
            .then(r => {
                setItems(r.data);
                if (!cat && categories.length > 0) {
                    setCat(categories[0].key);
                }
            })
            .catch(() => setItems([]));
    }, [mode, cat]);

    const filtered = (cat ? items.filter(m => m.tag === cat) : items);
    const display = (user ? filtered : filtered.slice(0, 5)).map(m => ({ ...m, type: mode }));

    return (
        <div>
            <div className="genre-vertical">
                {categories.map(c => (
                    <button
                        key={c.key}
                        className={`genre-vbtn ${cat === c.key ? "active" : ""}`}
                        onClick={() => setCat(c.key)}
                    >
                        <span className="genre-vicon">{c.icon}</span>
                        <span className="genre-vname">{c.label}</span>
                        <span className="genre-vcount">{items.filter(m => m.tag === c.key).length}</span>
                    </button>
                ))}
            </div>
            <div style={{ padding: '0 16px' }}>
                <Products products={display} limit={user ? undefined : 5} />
                {!user && (
                    <p style={{ textAlign: 'center', padding: '20px', color: '#aaa' }}>
                        <a href="/login" style={{ color: '#e50914' }}>{t('tmdb.loginPrompt')}</a> {t('tmdb.toSeeAll', { count: filtered.length, type: mode === "tv" ? t('tmdb.series') : t('tmdb.movies') })}
                    </p>
                )}
            </div>
        </div>
    );
}
