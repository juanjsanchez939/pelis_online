import axios from 'axios';

const API_KEY = process.env.TMDB_API_KEY || '8d7cd14f75ff2bb827d966152a610eab';
const TMDB = 'https://api.themoviedb.org/3';

const GENRE_MAP = {
    28: 'Acción', 12: 'Aventura', 16: 'Animadas',
    10752: 'Bélicas', 35: 'Comedias', 27: 'Terror'
};

function mapMovie(m, tag) {
    return {
        id: m.id,
        title: m.title,
        titleEn: m.original_title,
        category: (m.genre_ids || []).map(g => GENRE_MAP[g]).filter(Boolean),
        thumbnail: m.poster_path,
        description: m.overview,
        year: m.release_date ? new Date(m.release_date).getFullYear() : null,
        rating: Math.round((m.vote_average / 2) * 10) / 10,
        backdrop: m.backdrop_path,
        tag: tag,
    };
}

function mapTv(t, tag) {
    return {
        id: t.id,
        title: t.name,
        titleEn: t.original_name,
        thumbnail: t.poster_path,
        description: t.overview,
        year: t.first_air_date ? new Date(t.first_air_date).getFullYear() : null,
        rating: Math.round((t.vote_average / 2) * 10) / 10,
        backdrop: t.backdrop_path,
        tag: tag,
    };
}

export class TmdbService {
    static async fetchPages(urlBase, pages, tag, mapper) {
        let all = [];
        for (let p = 1; p <= pages; p++) {
            const res = await axios.get(`${urlBase}&page=${p}`);
            const results = (res.data.results || []).map(m => mapper(m, tag));
            all = all.concat(results);
            if (p >= (res.data.total_pages || 1)) break;
        }
        return all;
    }

    static async getPopularMovies() {
        return await TmdbService.fetchPages(`${TMDB}/movie/popular?api_key=${API_KEY}&language=es-ES`, 7, 'popular', mapMovie);
    }

    static async getNowPlaying() {
        return await TmdbService.fetchPages(`${TMDB}/movie/now_playing?api_key=${API_KEY}&language=es-ES`, 7, 'now-playing', mapMovie);
    }

    static async getUpcoming() {
        return await TmdbService.fetchPages(`${TMDB}/movie/upcoming?api_key=${API_KEY}&language=es-ES`, 7, 'upcoming', mapMovie);
    }

    static async getTopRated() {
        return await TmdbService.fetchPages(`${TMDB}/movie/top_rated?api_key=${API_KEY}&language=es-ES`, 7, 'top-rated', mapMovie);
    }

    static async getPopularTv() {
        return await TmdbService.fetchPages(`${TMDB}/tv/popular?api_key=${API_KEY}&language=es-ES`, 7, 'popular', mapTv);
    }

    static async getAiringToday() {
        return await TmdbService.fetchPages(`${TMDB}/tv/airing_today?api_key=${API_KEY}&language=es-ES`, 7, 'airing-today', mapTv);
    }

    static async getOnTheAir() {
        return await TmdbService.fetchPages(`${TMDB}/tv/on_the_air?api_key=${API_KEY}&language=es-ES`, 7, 'on-the-air', mapTv);
    }

    static async getTopRatedTv() {
        return await TmdbService.fetchPages(`${TMDB}/tv/top_rated?api_key=${API_KEY}&language=es-ES`, 7, 'top-rated', mapTv);
    }
}
