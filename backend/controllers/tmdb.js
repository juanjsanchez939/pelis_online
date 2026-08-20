import { TmdbService } from '../services/tmdb.js';
import axios from 'axios';

const API_KEY = process.env.TMDB_API_KEY || '8d7cd14f75ff2bb827d966152a610eab';
const TMDB = 'https://api.themoviedb.org/3';

export function tmdbRoutes(app) {
    app.get('/api/tmdb/search', async (req, res) => {
        try {
            const query = req.query.q;
            if (!query) return res.json([]);
            const url = `${TMDB}/search/multi?api_key=${API_KEY}&language=es-ES&query=${encodeURIComponent(query)}`;
            const searchRes = await axios.get(url);
            res.json(searchRes.data.results || []);
        } catch (e) {
            res.status(500).json({ error: e.message });
        }
    });

    app.get('/api/tmdb/movie/:id', async (req, res) => {
        try {
            const detailRes = await axios.get(
                `${TMDB}/movie/${req.params.id}?api_key=${API_KEY}&language=es-ES&append_to_response=videos`
            );
            const m = detailRes.data;
            const creditsRes = await axios.get(
                `${TMDB}/movie/${req.params.id}/credits?api_key=${API_KEY}&language=es-ES`
            ).catch(() => null);
            const credits = creditsRes?.data;
            const trailer = m.videos?.results?.find(v => v.type === 'Trailer' && v.site === 'YouTube');

            res.json({
                id: m.id,
                title: m.title,
                titleEn: m.original_title,
                thumbnail: m.poster_path,
                description: m.overview || 'Sin descripción.',
                year: m.release_date ? new Date(m.release_date).getFullYear() : null,
                director: credits?.crew?.find(c => c.job === 'Director')?.name || 'N/A',
                duration: m.runtime ? `${m.runtime} min` : 'N/A',
                rating: Math.round((m.vote_average / 2) * 10) / 10,
                cast: credits?.cast?.slice(0, 10).map(c => c.name) || [],
                trailer: trailer ? `https://www.youtube.com/embed/${trailer.key}` : '',
                category: (m.genres || []).map(g => g.name),
                type: 'movie',
                comments: [],
            });
        } catch (e) {
            res.status(500).json({ error: e.message });
        }
    });

    app.get('/api/tmdb/tv/:id', async (req, res) => {
        try {
            const detailRes = await axios.get(
                `${TMDB}/tv/${req.params.id}?api_key=${API_KEY}&language=es-ES&append_to_response=videos`
            );
            const t = detailRes.data;
            const creditsRes = await axios.get(
                `${TMDB}/tv/${req.params.id}/credits?api_key=${API_KEY}&language=es-ES`
            ).catch(() => null);
            const credits = creditsRes?.data;
            const trailer = t.videos?.results?.find(v => v.type === 'Trailer' && v.site === 'YouTube');

            res.json({
                id: t.id,
                title: t.name,
                titleEn: t.original_name,
                thumbnail: t.poster_path,
                description: t.overview || 'Sin descripción.',
                year: t.first_air_date ? new Date(t.first_air_date).getFullYear() : null,
                director: credits?.crew?.find(c => c.job === 'Director' || c.job === 'Creator')?.name || 'N/A',
                duration: t.number_of_seasons ? `${t.number_of_seasons} temporadas` : 'N/A',
                rating: Math.round((t.vote_average / 2) * 10) / 10,
                cast: credits?.cast?.slice(0, 10).map(c => c.name) || [],
                trailer: trailer ? `https://www.youtube.com/embed/${trailer.key}` : '',
                category: (t.genres || []).map(g => g.name),
                type: 'tv',
                comments: [],
            });
        } catch (e) {
            res.status(500).json({ error: e.message });
        }
    });

    app.get('/api/movies/all', async (req, res) => {
        try {
            const [popular, nowPlaying, upcoming, topRated] = await Promise.all([
                TmdbService.getPopularMovies(),
                TmdbService.getNowPlaying(),
                TmdbService.getUpcoming(),
                TmdbService.getTopRated(),
            ]);
            const all = [...popular, ...nowPlaying, ...upcoming, ...topRated];
            res.json(all);
        } catch (e) {
            res.status(500).json({ error: e.message });
        }
    });

    app.get('/api/tv/all', async (req, res) => {
        try {
            const [popular, airing, onAir, topRated] = await Promise.all([
                TmdbService.getPopularTv(),
                TmdbService.getAiringToday(),
                TmdbService.getOnTheAir(),
                TmdbService.getTopRatedTv(),
            ]);
            const all = [...popular, ...airing, ...onAir, ...topRated];
            res.json(all);
        } catch (e) {
            res.status(500).json({ error: e.message });
        }
    });
}
