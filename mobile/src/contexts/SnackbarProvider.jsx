import { useState, useCallback, useRef } from 'react';
import { SnackbarContext } from './SnackbarContext';
import { Animated, Text, StyleSheet } from 'react-native';

export function SnackbarProvider({ children }) {
  const [snackbar, setSnackbar] = useState({ open: false, message: '', type: 'info' });
  const opacity = useRef(new Animated.Value(0)).current;
  const timerRef = useRef(null);

  const showSnackbar = useCallback((message, type = 'info') => {
    if (timerRef.current) clearTimeout(timerRef.current);

    setSnackbar({ open: true, message, type });
    Animated.timing(opacity, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();

    timerRef.current = setTimeout(() => {
      Animated.timing(opacity, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start(() => {
        setSnackbar({ open: false, message: '', type: 'info' });
      });
    }, 2500);
  }, [opacity]);

  const bgColor =
    snackbar.type === 'success' ? '#00c853'
    : snackbar.type === 'error' ? '#e50914'
    : '#333';

  return (
    <SnackbarContext.Provider value={{ showSnackbar }}>
      {children}
      {snackbar.open && (
        <Animated.View style={[styles.snackbar, { opacity, backgroundColor: bgColor }]}>
          <Text style={styles.snackbarText}>{snackbar.message}</Text>
        </Animated.View>
      )}
    </SnackbarContext.Provider>
  );
}

const styles = StyleSheet.create({
  snackbar: {
    position: 'absolute',
    bottom: 90,
    left: 20,
    right: 20,
    padding: 14,
    borderRadius: 8,
    zIndex: 9999,
    elevation: 10,
    alignItems: 'center',
  },
  snackbarText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
});
