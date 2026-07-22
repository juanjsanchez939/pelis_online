import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { IMAGE_BASE_URL } from '../config';
import { useTheme } from '../contexts/ThemeContext';
import { darkTheme, lightTheme } from '../theme';

export default function MovieCard({ movie, onPress, onFavPress, isFav, showFav = true }) {
  const { isDark } = useTheme();
  const theme = isDark ? darkTheme : lightTheme;

  const imageSource = { uri: `${IMAGE_BASE_URL}${movie.thumbnail}` };

  return (
    <TouchableOpacity
      style={[styles.card, { backgroundColor: theme.card }]}
      activeOpacity={0.8}
      onPress={() => onPress(movie)}
    >
      <View style={styles.imageWrapper}>
        <Image source={imageSource} style={styles.image} resizeMode="cover" />
        {movie.rating && (
          <View style={styles.ratingBadge}>
            <Text style={styles.ratingText}>★ {movie.rating.toFixed(1)}</Text>
          </View>
        )}
      </View>
      <View style={styles.info}>
        <Text style={[styles.title, { color: theme.text }]} numberOfLines={2}>
          {movie.title}
        </Text>
        <Text style={[styles.year, { color: theme.textSecondary }]}>{movie.year}</Text>
        <Text style={[styles.category, { color: theme.primary }]}>{movie.category[0]}</Text>
      </View>
      {showFav && (
        <TouchableOpacity
          style={[styles.favBtn, isFav && styles.favActive]}
          onPress={() => onFavPress(movie)}
        >
          <Text style={styles.favIcon}>{isFav ? '❤️' : '🤍'}</Text>
        </TouchableOpacity>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 16,
    width: '48%',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  imageWrapper: {
    position: 'relative',
  },
  image: {
    width: '100%',
    height: 220,
  },
  ratingBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(0,0,0,0.75)',
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  ratingText: {
    color: '#ffc107',
    fontSize: 12,
    fontWeight: '700',
  },
  info: {
    padding: 10,
  },
  title: {
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 4,
  },
  year: {
    fontSize: 12,
    marginBottom: 4,
  },
  category: {
    fontSize: 11,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  favBtn: {
    position: 'absolute',
    top: 8,
    left: 8,
    backgroundColor: 'rgba(0,0,0,0.6)',
    borderRadius: 20,
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  favActive: {
    backgroundColor: 'rgba(229,9,20,0.7)',
  },
  favIcon: {
    fontSize: 16,
  },
});
