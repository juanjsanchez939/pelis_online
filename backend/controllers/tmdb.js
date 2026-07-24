import { TmdbService } from '../services/tmdb.js';

export function tmdbRoutes(app) {

    app.get('/api/movies/all', async (req, res) => {
        const [popular, nowPlaying, upcoming, topRated] = await Promise.all([
            TmdbService.getPopularMovies(),
            TmdbService.getNowPlaying(),
            TmdbService.getUpcoming(),
            TmdbService.getTopRated(),
        ]);
        const seen = new Set();
        const all = [...popular, ...nowPlaying, ...upcoming, ...topRated].filter(m => {
            if (seen.has(m.id)) return false;
            seen.add(m.id);
            return true;
        });
        res.json(all);
    });

    app.get('/api/tv/all', async (req, res) => {
        const [popular, airing, onAir, topRated] = await Promise.all([
            TmdbService.getPopularTv(),
            TmdbService.getAiringToday(),
            TmdbService.getOnTheAir(),
            TmdbService.getTopRatedTv(),
        ]);
        const seen = new Set();
        const all = [...popular, ...airing, ...onAir, ...topRated].filter(t => {
            if (seen.has(t.id)) return false;
            seen.add(t.id);
            return true;
        });
        res.json(all);
    });
}
