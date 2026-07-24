import { useState, useEffect } from "react";
import axios from "axios";
import { Products } from "./products.jsx";
import { API_BASE_URL } from "../utils/shared.js";

const MOVIE_CATS = [
    { key: "popular", label: "Populares", icon: "🔥" },
    { key: "now-playing", label: "En Cartelera", icon: "🎟️" },
    { key: "upcoming", label: "Próximamente", icon: "📅" },
    { key: "top-rated", label: "Mejor Puntuadas", icon: "⭐" },
];

const TV_CATS = [
    { key: "popular", label: "Populares", icon: "📺" },
    { key: "airing-today", label: "Se Emiten Hoy", icon: "🕐" },
    { key: "on-the-air", label: "En Televisión", icon: "📡" },
    { key: "top-rated", label: "Mejor Valoradas", icon: "⭐" },
];

export default function TmdbSection({ mode = "movies" }) {
    const endpoint = mode === "tv" ? "/api/tv/all" : "/api/movies/all";
    const categories = mode === "tv" ? TV_CATS : MOVIE_CATS;
    const [items, setItems] = useState([]);
    const [cat, setCat] = useState("");
    const [init, setInit] = useState(false);

    useEffect(() => {
        axios.get(`${API_BASE_URL}${endpoint}`)
            .then(r => {
                setItems(r.data);
                if (!init && categories.length > 0) {
                    setCat(categories[0].key);
                    setInit(true);
                }
            })
            .catch(() => setItems([]));
    }, [mode]);

    const filtered = cat ? items.filter(m => m.tag === cat) : items;

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
                <Products products={filtered} />
            </div>
        </div>
    );
}
