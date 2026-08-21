import axios from 'axios';
import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import crypto from 'crypto';
import config from './config.js';

const TMDB = 'https://api.themoviedb.org/3';

const GENRES = {
    Acción: 28, Aventura: 12, Animadas: 16, Bélicas: 10752, Comedias: 35, Terror: 27
};

const FRANCHISES = {
    'Iron Man': 2008, 'The Incredible Hulk': 2008, 'Iron Man 2': 2010, 'Thor': 2011,
    'Captain America The First Avenger': 2011, 'The Avengers': 2012, 'Iron Man 3': 2013,
    'Thor The Dark World': 2013, 'Captain America The Winter Soldier': 2014,
    'Guardians of the Galaxy': 2014, 'Avengers Age of Ultron': 2015, 'Ant-Man': 2015,
    'Captain America Civil War': 2016, 'Doctor Strange': 2016,
    'Guardians of the Galaxy Vol 2': 2017, 'Spider-Man Homecoming': 2017,
    'Thor Ragnarok': 2017, 'Black Panther': 2018, 'Avengers Infinity War': 2018,
    'Ant-Man and the Wasp': 2018, 'Captain Marvel': 2019, 'Avengers Endgame': 2019,
    'Spider-Man Far From Home': 2019, 'Black Widow': 2021, 'Shang-Chi': 2021,
    'Eternals': 2021, 'Spider-Man No Way Home': 2021, 'Doctor Strange Multiverse of Madness': 2022,
    'Thor Love and Thunder': 2022, 'Black Panther Wakanda Forever': 2022,
    'Ant-Man and the Wasp Quantumania': 2023, 'Guardians of the Galaxy Vol 3': 2023,
    'The Marvels': 2023, 'Deadpool and Wolverine': 2024,
    'Star Wars': 1977, 'The Empire Strikes Back': 1980, 'Return of the Jedi': 1983,
    'The Phantom Menace': 1999, 'Attack of the Clones': 2002, 'Revenge of the Sith': 2005,
    'The Force Awakens': 2015, 'The Last Jedi': 2017, 'The Rise of Skywalker': 2019,
    'Rogue One': 2016, 'Solo': 2018,
};

const MAX_RETRIES = 3;
const RETRY_DELAY_MS = 1000;
const RATE_LIMIT_DELAY_MS = 250;

function delay(ms) { return new Promise(r => setTimeout(r, ms)); }

async function withRetry(fn, retries = MAX_RETRIES) {
    try {
        return await fn();
    } catch (err) {
        if (retries <= 0) throw err;
        if (err.response?.status === 429) {
            console.log(`  ⏳ Rate limited, esperando ${RETRY_DELAY_MS * 2}ms...`);
            await delay(RETRY_DELAY_MS * 2);
        } else {
            await delay(RETRY_DELAY_MS);
        }
        return withRetry(fn, retries - 1);
    }
}

async function searchMovie(title, year) {
    return withRetry(async () => {
        const url = `${TMDB}/search/movie?api_key=${config.tmdbApiKey}&language=en-US&query=${encodeURIComponent(title)}&primary_release_year=${year}`;
        const res = await axios.get(url);
        return res.data.results?.[0] || null;
    });
}

async function getDetails(id) {
    return withRetry(async () => {
        const res = await axios.get(`${TMDB}/movie/${id}?api_key=${config.tmdbApiKey}&language=es-ES&append_to_response=videos`);
        return res.data;
    });
}

async function getCredits(id) {
    return withRetry(async () => {
        try {
            const res = await axios.get(`${TMDB}/movie/${id}/credits?api_key=${config.tmdbApiKey}&language=es-ES`);
            return res.data;
        } catch { return null; }
    });
}

function mapGenres(genreIds) {
    return (genreIds || []).map(g => {
        for (const [k, v] of Object.entries(GENRES)) if (v === g) return k;
        return null;
    }).filter(Boolean);
}

async function saveMovie(MovieModel, data) {
    return withRetry(async () => {
        await new MovieModel(data).save();
    });
}

async function seedGenreMovies(genreEs, genreId, targetCount) {
    const MovieModel = mongoose.model('movies');
    let added = 0;
    let page = 1;

    while (added < targetCount && page <= 5) {
        try {
            const url = `${TMDB}/discover/movie?api_key=${config.tmdbApiKey}&language=es-ES&with_genres=${genreId}&sort_by=popularity.desc&page=${page}&vote_count.gte=50`;
            const res = await withRetry(() => axios.get(url));
            const movies = res.data.results || [];

            for (const m of movies) {
                if (added >= targetCount) break;
                try {
                    const exists = await MovieModel.findOne({ tmdbId: m.id });
                    if (exists) continue;

                    await delay(RATE_LIMIT_DELAY_MS);
                    const details = await getDetails(m.id);
                    await delay(RATE_LIMIT_DELAY_MS);
                    const credits = await getCredits(m.id);
                    const director = credits?.crew?.find(c => c.job === 'Director')?.name || 'N/A';
                    const cast = credits?.cast?.slice(0, 5).map(c => c.name) || [];
                    const trailer = details.videos?.results?.find(v => v.type === 'Trailer' && v.site === 'YouTube');
                    const cats = mapGenres(m.genre_ids);

                    await saveMovie(MovieModel, {
                        title: details.title || m.title,
                        titleEn: m.original_title || m.title,
                        category: cats.length > 0 ? cats : [genreEs],
                        thumbnail: m.poster_path,
                        description: details.overview || 'Sin descripción.',
                        year: new Date(m.release_date || Date.now()).getFullYear(),
                        director, duration: details.runtime ? `${details.runtime} min` : 'N/A',
                        rating: Math.round((m.vote_average / 2) * 10) / 10,
                        cast, trailer: trailer ? `https://www.youtube.com/embed/${trailer.key}` : '',
                        tmdbId: m.id, comments: []
                    });
                    added++;
                    console.log(`  ✅ ${details.title || m.title}`);
                } catch (e) { console.log(`  ❌ ${m.title}: ${e.message}`); }
            }
        } catch (e) {
            console.log(`  ❌ Página ${page} falló: ${e.message}`);
        }
        page++;
    }
    return added;
}

async function seedFranchises() {
    const MovieModel = mongoose.model('movies');
    let added = 0;

    for (const [title, year] of Object.entries(FRANCHISES)) {
        try {
            const exists = await MovieModel.findOne({ titleEn: title });
            if (exists) { console.log(`  ⏭️ ${title} ya existe`); continue; }

            const match = await searchMovie(title, year);
            if (!match) { console.log(`  ❌ No encontrada: ${title}`); continue; }

            await delay(RATE_LIMIT_DELAY_MS);
            const details = await getDetails(match.id);
            await delay(RATE_LIMIT_DELAY_MS);
            const credits = await getCredits(match.id);
            const director = credits?.crew?.find(c => c.job === 'Director')?.name || 'N/A';
            const cast = credits?.cast?.slice(0, 5).map(c => c.name) || [];
            const trailer = details.videos?.results?.find(v => v.type === 'Trailer' && v.site === 'YouTube');
            const cats = mapGenres(match.genre_ids);

            await saveMovie(MovieModel, {
                title: details.title || match.title,
                titleEn: match.original_title || match.title,
                category: cats.length > 0 ? cats : ['Acción'],
                thumbnail: match.poster_path,
                description: details.overview || 'Sin descripción.',
                year, director, duration: details.runtime ? `${details.runtime} min` : 'N/A',
                rating: Math.round((match.vote_average / 2) * 10) / 10,
                cast, trailer: trailer ? `https://www.youtube.com/embed/${trailer.key}` : '',
                tmdbId: match.id, comments: []
            });
            added++;
            console.log(`  ✅ ${details.title || match.title} (${year})`);
        } catch (e) { console.log(`  ❌ ${title}: ${e.message}`); }
    }
    return added;
}

export async function seedAllMovies() {
    console.log('🎬 Iniciando siembra masiva...\n');

    let total = 0;

    for (const [genreEs, genreId] of Object.entries(GENRES)) {
        console.log(`\n=== ${genreEs} (50 títulos) ===`);
        total += await seedGenreMovies(genreEs, genreId, 50);
    }

    console.log(`\n=== Sagas (Avengers + Star Wars) ===`);
    total += await seedFranchises();

    console.log(`\n🎉 ${total} películas sembradas en total`);
}

export async function seedAdmin() {
    const UserModel = mongoose.model('users');
    const existing = await UserModel.findOne({ username: config.admin.username });
    if (existing) { console.log('👤 Admin ya existe'); return; }
    const hashedPassword = await bcrypt.hash(config.admin.password, 10);
    await new UserModel({
        uuid: crypto.randomUUID(),
        username: config.admin.username,
        fullName: 'Administrador',
        email: config.admin.email,
        hashedPassword,
        roles: ['admin', 'user'],
    }).save();
    console.log(`👤 Admin creado (${config.admin.username} / ${config.admin.password})`);
}
