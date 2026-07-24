import React, { useContext, useState, useEffect, useCallback } from 'react';
import {
  View, Text, ScrollView, Image, TouchableOpacity, TextInput,
  StyleSheet, FlatList, Alert, ActivityIndicator,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useFavs } from '../hooks/useFavs';
import { SnackbarContext } from '../contexts/SnackbarContext';
import { UserContext } from '../contexts/UserContext';
import { useTheme } from '../contexts/ThemeContext';
import { darkTheme, lightTheme } from '../theme';
import { IMAGE_BASE_URL, API_BASE_URL } from '../config';
import StarRating from '../components/StarRating';

export default function ProductDetailScreen({ route, navigation }) {
  const { id } = route.params;
  const { isDark } = useTheme();
  const theme = isDark ? darkTheme : lightTheme;
  const { user } = useContext(UserContext);
  const { toggleFav, isFav } = useFavs();
  const { showSnackbar } = useContext(SnackbarContext);

  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);

  const [newComment, setNewComment] = useState('');
  const [commentRating, setCommentRating] = useState(5);
  const [comments, setComments] = useState([]);

  useEffect(() => {
    const fetchMovie = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/movies/${id}`);
        const data = await res.json();
        setMovie(data);
        setComments(data.comments || []);
      } catch (e) {
        console.error('Error fetching movie:', e);
      } finally {
        setLoading(false);
      }
    };
    fetchMovie();
  }, [id]);

  useFocusEffect(
    useCallback(() => {
      if (!user) {
        navigation.replace('Login', { redirect: 'ProductDetail', redirectParams: { id } });
      }
    }, [user, id])
  );

  if (!user) {
    return (
      <View style={[styles.centered, { backgroundColor: theme.background }]}>
        <Text style={{ color: theme.textSecondary }}>Inicia sesión para ver esta película</Text>
      </View>
    );
  }

  if (loading) {
    return (
      <View style={[styles.centered, { backgroundColor: theme.background }]}>
        <ActivityIndicator size="large" color={theme.primary} />
      </View>
    );
  }

  if (!movie) {
    return (
      <View style={[styles.centered, { backgroundColor: theme.background }]}>
        <Text style={{ color: theme.text }}>Película no encontrada</Text>
      </View>
    );
  }

  const inFav = isFav(movie.id);

  const handleFavClick = () => {
    toggleFav(movie);
    showSnackbar(
      inFav ? `Quitaste "${movie.title}" de favoritos` : `Agregaste "${movie.title}" a favoritos`,
      inFav ? 'error' : 'success'
    );
  };

  const handleSubmitComment = () => {
    if (!newComment.trim()) return;
    const comment = {
      user: user?.username || 'Anónimo',
      text: newComment.trim(),
      rating: commentRating,
      date: new Date().toISOString().split('T')[0],
    };
    setComments((prev) => [comment, ...prev]);
    setNewComment('');
    setCommentRating(5);
    showSnackbar('Comentario publicado', 'success');
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Image
          source={{ uri: `${IMAGE_BASE_URL}${movie.thumbnail}` }}
          style={styles.poster}
          resizeMode="cover"
        />

        <View style={[styles.infoSection, { backgroundColor: theme.surface }]}>
          <Text style={[styles.title, { color: theme.text }]}>{movie.title}</Text>
          <Text style={[styles.meta, { color: theme.textSecondary }]}>
            {movie.year} | {movie.duration}
          </Text>
          <Text style={[styles.meta, { color: theme.textSecondary }]}>
            Director: {movie.director}
          </Text>
          <Text style={[styles.categoryTag, { color: theme.primary }]}>{movie.category?.[0]}</Text>

          {movie.rating && (
            <View style={{ marginTop: 4 }}>
              <StarRating rating={movie.rating} size={20} />
            </View>
          )}

          <TouchableOpacity
            style={[styles.favButton, { backgroundColor: inFav ? theme.primary : '#444' }]}
            onPress={handleFavClick}
          >
            <Text style={styles.favButtonText}>
              {inFav ? '❤️ Quitar de favoritos' : '🤍 Agregar a favoritos'}
            </Text>
          </TouchableOpacity>
        </View>

        {movie.cast && movie.cast.length > 0 && (
          <View style={[styles.section, { backgroundColor: theme.surface }]}>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>Reparto</Text>
            <View style={styles.castGrid}>
              {movie.cast.map((actor, i) => (
                <View key={i} style={[styles.castCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
                  <Text style={styles.castAvatar}>🎬</Text>
                  <Text style={[styles.castName, { color: theme.text }]}>{actor}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        <View style={[styles.section, { backgroundColor: theme.surface }]}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Sinopsis</Text>
          <Text style={[styles.description, { color: theme.textSecondary }]}>{movie.description}</Text>

          <View style={{ marginTop: 12 }}>
            <Text style={[styles.sectionTitle, { color: theme.text, fontSize: 16 }]}>Detalles</Text>
            <Text style={[styles.detailItem, { color: theme.textSecondary }]}>Año: {movie.year}</Text>
            <Text style={[styles.detailItem, { color: theme.textSecondary }]}>Duración: {movie.duration}</Text>
            <Text style={[styles.detailItem, { color: theme.textSecondary }]}>Director: {movie.director}</Text>
            <Text style={[styles.detailItem, { color: theme.textSecondary }]}>Género: {movie.category[0]}</Text>
          </View>
        </View>

        {movie.trailer && (
          <View style={[styles.section, { backgroundColor: theme.surface }]}>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>Tráiler</Text>
            <TouchableOpacity
              style={[styles.trailerBtn, { backgroundColor: theme.primary }]}
              onPress={() => Alert.alert('Tráiler', 'Abrir enlace: ' + movie.trailer)}
            >
              <Text style={styles.trailerBtnText}>▶ Ver Tráiler</Text>
            </TouchableOpacity>
          </View>
        )}

        <View style={[styles.section, { backgroundColor: theme.surface }]}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Comentarios</Text>

          <View style={styles.commentForm}>
            <Text style={[styles.ratingLabel, { color: theme.textSecondary }]}>Tu puntuación:</Text>
            <View style={styles.starsSelect}>
              {[1, 2, 3, 4, 5].map((star) => (
                <TouchableOpacity key={star} onPress={() => setCommentRating(star)}>
                  <Text style={[styles.starClickable, star <= commentRating && styles.starActive]}>
                    ★
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            <TextInput
              style={[styles.commentInput, { backgroundColor: theme.inputBg, color: theme.text, borderColor: theme.border }]}
              placeholder="Deja tu comentario sobre esta película..."
              placeholderTextColor={theme.textSecondary}
              value={newComment}
              onChangeText={setNewComment}
              multiline
              numberOfLines={3}
            />
            <TouchableOpacity style={[styles.commentSubmit, { backgroundColor: theme.primary }]} onPress={handleSubmitComment}>
              <Text style={styles.commentSubmitText}>Publicar comentario</Text>
            </TouchableOpacity>
          </View>

          {comments.length === 0 ? (
            <Text style={[styles.noComments, { color: theme.textSecondary }]}>Sé el primero en comentar</Text>
          ) : (
            comments.map((c, i) => (
              <View key={i} style={[styles.commentCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
                <View style={styles.commentHeader}>
                  <Text style={styles.commentAvatar}>👤</Text>
                  <Text style={[styles.commentUser, { color: theme.text }]}>{c.user}</Text>
                  <Text style={[styles.commentDate, { color: theme.textSecondary }]}>{c.date}</Text>
                  <Text style={[styles.commentStars, { color: '#ffc107' }]}>
                    {'★'.repeat(c.rating)}{'☆'.repeat(5 - c.rating)}
                  </Text>
                </View>
                <Text style={[styles.commentText, { color: theme.textSecondary }]}>{c.text}</Text>
              </View>
            ))
          )}
        </View>

        <View style={{ height: 30 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  scrollContent: { paddingBottom: 40 },
  poster: { width: '100%', height: 380 },
  infoSection: { padding: 16, marginTop: -16, borderTopLeftRadius: 20, borderTopRightRadius: 20 },
  title: { fontSize: 24, fontWeight: '800', marginBottom: 4 },
  meta: { fontSize: 13, marginBottom: 2 },
  categoryTag: { fontSize: 12, fontWeight: '700', textTransform: 'uppercase', marginTop: 4 },
  favButton: { marginTop: 14, paddingVertical: 12, borderRadius: 10, alignItems: 'center' },
  favButtonText: { color: '#fff', fontWeight: '700', fontSize: 15 },
  section: { marginTop: 10, marginHorizontal: 10, padding: 14, borderRadius: 12 },
  sectionTitle: { fontSize: 18, fontWeight: '700', marginBottom: 8 },
  castGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  castCard: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 20, borderWidth: 1, gap: 4 },
  castAvatar: { fontSize: 14 },
  castName: { fontSize: 12, fontWeight: '500' },
  description: { fontSize: 14, lineHeight: 21 },
  detailItem: { fontSize: 13, marginBottom: 4 },
  trailerBtn: { paddingVertical: 12, borderRadius: 10, alignItems: 'center', marginTop: 8 },
  trailerBtnText: { color: '#fff', fontWeight: '700', fontSize: 15 },
  commentForm: { marginBottom: 16 },
  ratingLabel: { fontSize: 13, marginBottom: 4 },
  starsSelect: { flexDirection: 'row', marginBottom: 10, gap: 4 },
  starClickable: { fontSize: 28, color: '#555' },
  starActive: { color: '#ffc107' },
  commentInput: { borderWidth: 1, borderRadius: 8, padding: 10, fontSize: 14, minHeight: 80, textAlignVertical: 'top' },
  commentSubmit: { marginTop: 8, paddingVertical: 10, borderRadius: 8, alignItems: 'center' },
  commentSubmitText: { color: '#fff', fontWeight: '700', fontSize: 14 },
  noComments: { textAlign: 'center', fontSize: 14, marginTop: 10 },
  commentCard: { padding: 12, borderRadius: 10, borderWidth: 1, marginBottom: 8 },
  commentHeader: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 6, flexWrap: 'wrap' },
  commentAvatar: { fontSize: 16 },
  commentUser: { fontSize: 13, fontWeight: '700', flex: 1 },
  commentDate: { fontSize: 11 },
  commentStars: { fontSize: 12 },
  commentText: { fontSize: 13, lineHeight: 19 },
});
