import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Dimensions } from 'react-native';
import { IMAGE_BASE_URL } from '../config';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const IMAGES = [
  '/portadas/portada1.png',
  '/portadas/portada2.png',
  '/portadas/portada3.png',
];

export default function Banner() {
  const [current, setCurrent] = useState(0);
  const fadeAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const interval = setInterval(() => {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }).start(() => {
        setCurrent((prev) => (prev + 1) % IMAGES.length);
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }).start();
      });
    }, 5000);

    return () => clearInterval(interval);
  }, [fadeAnim]);

  return (
    <View style={styles.container}>
      <Animated.Image
        source={{ uri: `${IMAGE_BASE_URL}${IMAGES[current]}` }}
        style={[styles.bgImage, { opacity: fadeAnim }]}
        resizeMode="cover"
      />
      <View style={styles.overlay}>
        <Text style={styles.logo}>
          Pelis{' '}
          <Text style={styles.logoAccent}>Online</Text>
        </Text>
        <Text style={styles.tagline}>Tu catálogo de películas favoritas en un solo lugar</Text>
      </View>
      <View style={styles.dots}>
        {IMAGES.map((_, i) => (
          <View key={i} style={[styles.dot, i === current && styles.dotActive]} />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 260,
    position: 'relative',
    overflow: 'hidden',
  },
  bgImage: {
    position: 'absolute',
    width: SCREEN_WIDTH,
    height: 260,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.55)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  logo: {
    fontSize: 36,
    fontWeight: '900',
    color: '#fff',
    letterSpacing: 2,
  },
  logoAccent: {
    color: '#e50914',
  },
  tagline: {
    fontSize: 14,
    color: '#ccc',
    marginTop: 8,
    textAlign: 'center',
  },
  dots: {
    position: 'absolute',
    bottom: 12,
    flexDirection: 'row',
    alignSelf: 'center',
    gap: 6,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255,255,255,0.4)',
  },
  dotActive: {
    backgroundColor: '#e50914',
    width: 20,
  },
});
