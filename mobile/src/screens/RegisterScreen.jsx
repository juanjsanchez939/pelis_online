import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  KeyboardAvoidingView, Platform, ScrollView, ActivityIndicator,
} from 'react-native';
import { useTheme } from '../contexts/ThemeContext';
import { darkTheme, lightTheme } from '../theme';
import { API_BASE_URL } from '../config';

export default function RegisterScreen({ navigation }) {
  const { isDark } = useTheme();
  const theme = isDark ? darkTheme : lightTheme;

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    setError('');
    setSuccess('');

    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Error al registrar');
        return;
      }

      setSuccess('Usuario registrado correctamente. Redirigiendo...');
      setUsername('');
      setEmail('');
      setPassword('');
      setConfirmPassword('');

      setTimeout(() => {
        navigation.navigate('Login');
      }, 2000);
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
      <ScrollView contentContainerStyle={styles.inner} keyboardShouldPersistTaps="handled">
        <Text style={styles.logo}>
          Pelis<Text style={styles.logoAccent}>Online</Text>
        </Text>
        <Text style={[styles.title, { color: theme.text }]}>Crear Cuenta</Text>

        {error ? <Text style={styles.error}>{error}</Text> : null}
        {success ? <Text style={styles.success}>{success}</Text> : null}

        <Text style={[styles.label, { color: theme.textSecondary }]}>Usuario:</Text>
        <TextInput
          style={[styles.input, { backgroundColor: theme.inputBg, color: theme.text, borderColor: theme.border }]}
          value={username}
          onChangeText={setUsername}
          autoCapitalize="none"
          placeholderTextColor={theme.textSecondary}
        />

        <Text style={[styles.label, { color: theme.textSecondary }]}>Correo electrónico:</Text>
        <TextInput
          style={[styles.input, { backgroundColor: theme.inputBg, color: theme.text, borderColor: theme.border }]}
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
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

        <Text style={[styles.label, { color: theme.textSecondary }]}>Confirmar contraseña:</Text>
        <TextInput
          style={[styles.input, { backgroundColor: theme.inputBg, color: theme.text, borderColor: theme.border }]}
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry
          placeholderTextColor={theme.textSecondary}
        />

        <TouchableOpacity
          style={[styles.btn, { backgroundColor: theme.primary, opacity: loading ? 0.7 : 1 }]}
          onPress={handleRegister}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.btnText}>Registrarse</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
          <Text style={[styles.link, { color: theme.textSecondary }]}>
            ¿Ya tienes una cuenta?{' '}
            <Text style={{ color: theme.primary, fontWeight: '700' }}>Iniciar sesión</Text>
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  inner: { paddingHorizontal: 30, paddingVertical: 40 },
  logo: { fontSize: 32, fontWeight: '900', color: '#fff', textAlign: 'center', marginBottom: 8 },
  logoAccent: { color: '#e50914' },
  title: { fontSize: 22, fontWeight: '700', textAlign: 'center', marginBottom: 20 },
  error: { color: '#e50914', textAlign: 'center', marginBottom: 10, fontSize: 14 },
  success: { color: '#00c853', textAlign: 'center', marginBottom: 10, fontSize: 14 },
  label: { fontSize: 14, fontWeight: '600', marginBottom: 6, marginTop: 10 },
  input: { borderWidth: 1, borderRadius: 10, paddingHorizontal: 14, paddingVertical: 12, fontSize: 15 },
  btn: { marginTop: 24, paddingVertical: 14, borderRadius: 10, alignItems: 'center' },
  btnText: { color: '#fff', fontWeight: '700', fontSize: 16 },
  link: { textAlign: 'center', marginTop: 20, fontSize: 14 },
});
