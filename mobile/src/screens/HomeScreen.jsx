import React, { useState, useContext, useMemo } from 'react';
import {
  View, Text, TouchableOpacity, ScrollView, StyleSheet, RefreshControl,
} from 'react-native';
import { products as initialProducts } from '../assets/products.json';
import { useFilters } from '../hooks/useFilters';
import { useFavs } from '../hooks/useFavs';
import { SnackbarContext } from '../contexts/SnackbarContext';
import { UserContext } from '../contexts/UserContext';
import { useTheme } from '../contexts/ThemeContext';
import { darkTheme, lightTheme } from '../theme';
import Banner from '../components/Banner';
import SearchBar from '../components/SearchBar';
import MovieCard from '../components/MovieCard';

const GENRE_ORDER = ['Acción', 'Aventura', 'Animadas', 'Bélicas', 'Comedias', 'Terror'];
const GENRE_ICONS = { Acción: '💥', Aventura: '🗺️', Animadas: '🎬', Bélicas: '🎖️', Comedias: '😂', Terror: '👻' };

function MovieGrid({ movies, navigation, isFav, onFavPress }) {
  return (
    <View style={styles.grid}>
      {movies.map((movie) => (
        <MovieCard
          key={movie.id}
          movie={movie}
          onPress={(m) => navigation.navigate('ProductDetail', { id: m.id })}
          onFavPress={onFavPress}
          isFav={isFav(movie.id)}
        />
      ))}
    </View>
  );
}

export default function HomeScreen({ navigation }) {
  const { isDark } = useTheme();
  const theme = isDark ? darkTheme : lightTheme;
  const { user } = useContext(UserContext);
  const { filterProducts } = useFilters();
  const { toggleFav, isFav } = useFavs();
  const { showSnackbar } = useContext(SnackbarContext);

  const [refreshing, setRefreshing] = useState(false);
  const [selectedGenre, setSelectedGenre] = useState(null);

  const products = useMemo(() => initialProducts, []);

  const topRated = useMemo(() => {
    return [...products].sort((a, b) => b.rating - a.rating).slice(0, 10);
  }, [products]);

  const genres = useMemo(() => {
    const map = {};
    products.forEach((p) => {
      const cat = p.category[0];
      if (!map[cat]) map[cat] = [];
      map[cat].push(p);
    });
    return map;
  }, [products]);

  const allFilteredMovies = useMemo(() => filterProducts(products), [products, filterProducts]);

  const moviesToShow = useMemo(() => {
    if (selectedGenre === 'all') return allFilteredMovies;
    if (selectedGenre && genres[selectedGenre]) {
      return filterProducts(genres[selectedGenre]);
    }
    return null;
  }, [selectedGenre, genres, filterProducts, allFilteredMovies]);

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 800);
  };

  const handleFavAction = (movie) => {
    const wasFav = isFav(movie.id);
    toggleFav(movie);
    showSnackbar(
      wasFav ? `Quitaste "${movie.title}" de favoritos` : `Agregaste "${movie.title}" a favoritos`,
      wasFav ? 'error' : 'success'
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <ScrollView
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={theme.primary} />}
      >
        <Banner />
        <SearchBar />

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionIcon}>⭐</Text>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Top 10 Mejor Valoradas</Text>
        </View>
        <Text style={[styles.sectionSubtitle, { color: theme.textSecondary }]}>
          Las mejores calificaciones de nuestra comunidad
        </Text>
        <MovieGrid movies={topRated} navigation={navigation} isFav={isFav} onFavPress={handleFavAction} />

        {!user ? (
          <View style={styles.loginPrompt}>
            <TouchableOpacity
              style={[styles.loginBtn, { backgroundColor: theme.primary }]}
              onPress={() => navigation.navigate('Login')}
            >
              <Text style={styles.loginBtnText}>Iniciá sesión para ver el catálogo completo</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <>
            <View style={[styles.sectionHeader, { marginTop: 8 }]}>
              <Text style={styles.sectionIcon}>🎬</Text>
              <Text style={[styles.sectionTitle, { color: theme.text }]}>Catálogo por Género</Text>
            </View>
            <Text style={[styles.sectionSubtitle, { color: theme.textSecondary }]}>
              Seleccioná un género o elegí &quot;Ver Todas&quot;
            </Text>

            <View style={styles.genreButtons}>
              <TouchableOpacity
                style={[
                  styles.genreBtn,
                  { backgroundColor: selectedGenre === 'all' ? theme.primary : theme.surface, borderColor: theme.border },
                ]}
                onPress={() => setSelectedGenre(selectedGenre === 'all' ? null : 'all')}
              >
                <Text style={styles.genreIcon}>🎞️</Text>
                <Text style={[styles.genreText, { color: selectedGenre === 'all' ? '#fff' : theme.text }]}>
                  Ver Todas
                </Text>
                <Text style={[styles.genreCount, { color: selectedGenre === 'all' ? 'rgba(255,255,255,0.7)' : theme.textSecondary }]}>
                  ({allFilteredMovies.length})
                </Text>
              </TouchableOpacity>

              {GENRE_ORDER.map((genre) => (
                <TouchableOpacity
                  key={genre}
                  style={[
                    styles.genreBtn,
                    { backgroundColor: selectedGenre === genre ? theme.primary : theme.surface, borderColor: theme.border },
                  ]}
                  onPress={() => setSelectedGenre(selectedGenre === genre ? null : genre)}
                >
                  <Text style={styles.genreIcon}>{GENRE_ICONS[genre]}</Text>
                  <Text style={[styles.genreText, { color: selectedGenre === genre ? '#fff' : theme.text }]}>
                    {genre}
                  </Text>
                  <Text style={[styles.genreCount, { color: selectedGenre === genre ? 'rgba(255,255,255,0.7)' : theme.textSecondary }]}>
                    ({filterProducts(genres[genre] || []).length})
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {moviesToShow && moviesToShow.length > 0 ? (
              <MovieGrid movies={moviesToShow} navigation={navigation} isFav={isFav} onFavPress={handleFavAction} />
            ) : moviesToShow && moviesToShow.length === 0 ? (
              <Text style={[styles.genrePrompt, { color: theme.textSecondary }]}>
                No hay resultados con los filtros actuales
              </Text>
            ) : (
              <Text style={[styles.genrePrompt, { color: theme.textSecondary }]}>
                Seleccioná un género o &quot;Ver Todas&quot; para explorar
              </Text>
            )}
          </>
        )}

        <View style={{ height: 20 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginTop: 20,
  },
  sectionIcon: { fontSize: 20, marginRight: 8 },
  sectionTitle: { fontSize: 20, fontWeight: '800' },
  sectionSubtitle: { fontSize: 13, paddingHorizontal: 16, marginBottom: 12 },
  genreButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 12,
    gap: 8,
    marginBottom: 16,
  },
  genreBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    gap: 4,
  },
  genreIcon: { fontSize: 14 },
  genreText: { fontSize: 13, fontWeight: '600' },
  genreCount: { fontSize: 12 },
  genrePrompt: { textAlign: 'center', fontSize: 14, paddingVertical: 20 },
  loginPrompt: { paddingHorizontal: 20, paddingVertical: 24, alignItems: 'center' },
  loginBtn: { paddingHorizontal: 24, paddingVertical: 14, borderRadius: 10 },
  loginBtnText: { color: '#fff', fontWeight: '700', fontSize: 15 },
});
