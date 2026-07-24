import { useState, useEffect } from "react";
import axios from "axios";
import { Products } from "./products.jsx";
import { API_BASE_URL } from "../utils/shared.js";
import "./TmdbSection.css";

export default function TmdbSection({ mode = "movies" }) {
    const endpoint = mode === "tv" ? "/api/tv/all" : "/api/movies/all";
    const [items, setItems] = useState([]);

    useEffect(() => {
        axios.get(`${API_BASE_URL}${endpoint}`)
            .then(r => setItems(r.data))
            .catch(() => setItems([]));
    }, [mode]);

    return (
        <div style={{ padding: '0 16px' }}>
            <p className="section-subtitle" style={{ padding: '12px 0' }}>
                {mode === "tv" ? `📺 ${items.length} series` : `🎬 ${items.length} películas`}
            </p>
            <Products products={items} />
        </div>
    );
}
