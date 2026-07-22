import React, { useState, useContext } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  KeyboardAvoidingView, Platform, ActivityIndicator,
} from 'react-native';
import { UserContext } from '../contexts/UserContext';
import { useTheme } from '../contexts/ThemeContext';
import { darkTheme, lightTheme } from '../theme';
import { API_BASE_URL } from '../config';

export default function LoginScreen({ route, navigation }) {
  const { isDark } = useTheme();
  const theme = isDark ? darkTheme : lightTheme;
  const { login } = useContext(UserContext);

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const redirect = route.params?.redirect;
  const redirectParams = route.params?.redirectParams;

  const handleLogin = async () => {
    setError('');
    if (!username || !password) {
      setError('Por favor completa todos los campos');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Error al iniciar sesión');
        return;
      }

      if (data.user) {
        await login(data.user, data.token);
        setUsername('');
        setPassword('');

        if (redirect) {
          navigation.replace(redirect, redirectParams || {});
        } else {
          navigation.reset({ index: 0, routes: [{ name: 'HomeTab' }] });
        }
      }
    } catch (err) {
      setError('Error conectando al servidor');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: theme.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.inner}>
        <Text style={styles.logo}>
          Pelis<Text style={styles.logoAccent}>Online</Text>
        </Text>
        <Text style={[styles.title, { color: theme.text }]}>Iniciar Sesión</Text>

        {error ? <Text style={styles.error}>{error}</Text> : null}

        <Text style={[styles.label, { color: theme.textSecondary }]}>Usuario:</Text>
        <TextInput
          style={[styles.input, { backgroundColor: theme.inputBg, color: theme.text, borderColor: theme.border }]}
          value={username}
          onChangeText={setUsername}
          autoCapitalize="none"
          placeholderTextColor={theme.textSecondary}
        />

        <Text style={[styles.label, { color: theme.textSecondary }]}>Contraseña:</Text>
        <TextInput
          style={[styles.input, { backgroundColor: theme.inputBg, color: theme.text, borderColor: theme.border }]}
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          placeholderTextColor={theme.textSecondary}
        />

        <TouchableOpacity
          style={[styles.btn, { backgroundColor: theme.primary, opacity: loading ? 0.7 : 1 }]}
          onPress={handleLogin}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.btnText}>Iniciar Sesión</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate('Register')}>
          <Text style={[styles.link, { color: theme.textSecondary }]}>
            ¿No tienes cuenta?{' '}
            <Text style={{ color: theme.primary, fontWeight: '700' }}>Crear cuenta</Text>
          </Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center' },
  inner: { paddingHorizontal: 30 },
  logo: { fontSize: 32, fontWeight: '900', color: '#fff', textAlign: 'center', marginBottom: 8 },
  logoAccent: { color: '#e50914' },
  title: { fontSize: 22, fontWeight: '700', textAlign: 'center', marginBottom: 24 },
  error: { color: '#e50914', textAlign: 'center', marginBottom: 12, fontSize: 14 },
  label: { fontSize: 14, fontWeight: '600', marginBottom: 6, marginTop: 10 },
  input: { borderWidth: 1, borderRadius: 10, paddingHorizontal: 14, paddingVertical: 12, fontSize: 15 },
  btn: { marginTop: 24, paddingVertical: 14, borderRadius: 10, alignItems: 'center' },
  btnText: { color: '#fff', fontWeight: '700', fontSize: 16 },
  link: { textAlign: 'center', marginTop: 20, fontSize: 14 },
});
