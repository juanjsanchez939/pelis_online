import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function StarRating({ rating, size = 16, showValue = true }) {
  const full = Math.floor(rating);
  const half = rating % 1 >= 0.5;
  const empty = 5 - full - (half ? 1 : 0);

  return (
    <View style={styles.container}>
      {[...Array(full)].map((_, i) => (
        <Text key={`f${i}`} style={[styles.star, { fontSize: size }]}>★</Text>
      ))}
      {half ? <Text style={[styles.star, { fontSize: size }]}>★</Text> : null}
      {[...Array(empty)].map((_, i) => (
        <Text key={`e${i}`} style={[styles.star, styles.emptyStar, { fontSize: size }]}>★</Text>
      ))}
      {showValue && (
        <Text style={[styles.value, { fontSize: size - 2 }]}>{rating.toFixed(1)}</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  star: {
    color: '#ffc107',
  },
  emptyStar: {
    color: '#555',
  },
  value: {
    color: '#ffc107',
    marginLeft: 4,
    fontWeight: '700',
  },
});
