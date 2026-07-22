import React, { useContext, useCallback } from 'react';
import { View, Text, TouchableOpacity, FlatList, Image, StyleSheet } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { UserContext } from '../contexts/UserContext';
import { useFavs } from '../hooks/useFavs';
import { useTheme } from '../contexts/ThemeContext';
import { darkTheme, lightTheme } from '../theme';
import { IMAGE_BASE_URL } from '../config';

export default function ProfileScreen({ navigation }) {
  const { isDark } = useTheme();
  const theme = isDark ? darkTheme : lightTheme;
  const { user, logout } = useContext(UserContext);
  const { favs, clearFavs } = useFavs();

  useFocusEffect(
    useCallback(() => {
      if (!user) {
        navigation.navigate('Login');
      }
    }, [user])
  );

  if (!user) {
    return (
      <View style={[styles.centered, { backgroundColor: theme.background }]}>
        <Text style={{ color: theme.textSecondary }}>Inicia sesión para ver tu perfil</Text>
      </View>
    );
  }

  const handleLogout = async () => {
    await logout();
    navigation.reset({ index: 0, routes: [{ name: 'HomeTab' }] });
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <FlatList
        ListHeaderComponent={
          <>
            <Text style={[styles.pageTitle, { color: theme.text }]}>Mi Perfil</Text>

            <View style={[styles.card, { backgroundColor: theme.surface, borderColor: theme.border }]}>
              <Text style={[styles.sectionTitle, { color: theme.text }]}>Datos de registro</Text>
              <View style={styles.avatarRow}>
                <Text style={styles.avatar}>👤</Text>
                <View style={styles.dataGrid}>
                  <View style={styles.dataItem}>
                    <Text style={[styles.dataLabel, { color: theme.textSecondary }]}>Usuario</Text>
                    <Text style={[styles.dataValue, { color: theme.text }]}>{user.username}</Text>
                  </View>
                  <View style={styles.dataItem}>
                    <Text style={[styles.dataLabel, { color: theme.textSecondary }]}>Email</Text>
                    <Text style={[styles.dataValue, { color: theme.text }]}>{user.email || '-'}</Text>
                  </View>
                  <View style={styles.dataItem}>
                    <Text style={[styles.dataLabel, { color: theme.textSecondary }]}>Roles</Text>
                    <Text style={[styles.dataValue, { color: theme.text }]}>
                      {(user.roles || []).join(', ') || 'user'}
                    </Text>
                  </View>
                </View>
              </View>
              <TouchableOpacity style={[styles.logoutBtn, { backgroundColor: theme.primary }]} onPress={handleLogout}>
                <Text style={styles.logoutBtnText}>Cerrar Sesión</Text>
              </TouchableOpacity>
            </View>

            <View style={[styles.card, { backgroundColor: theme.surface, borderColor: theme.border }]}>
              <Text style={[styles.sectionTitle, { color: theme.text }]}>
                Películas favoritas ({favs.length})
              </Text>
            </View>
          </>
        }
        data={favs}
        keyExtractor={(item) => item.id.toString()}
        numColumns={2}
        columnWrapperStyle={styles.favRow}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[styles.favCard, { backgroundColor: theme.card, borderColor: theme.border }]}
            onPress={() => navigation.navigate('ProductDetail', { id: item.id })}
          >
            <Image source={{ uri: `${IMAGE_BASE_URL}${item.thumbnail}` }} style={styles.favImage} resizeMode="cover" />
            <View style={styles.favInfo}>
              <Text style={[styles.favTitle, { color: theme.text }]} numberOfLines={2}>{item.title}</Text>
              <Text style={[styles.favMeta, { color: theme.textSecondary }]}>
                {item.year} | {item.category[0]}
              </Text>
            </View>
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <Text style={[styles.emptyText, { color: theme.textSecondary }]}>
            No tienes películas favoritas aún.
          </Text>
        }
        ListFooterComponent={
          favs.length > 0 ? (
            <TouchableOpacity style={[styles.clearBtn, { borderColor: theme.primary }]} onPress={clearFavs}>
              <Text style={[styles.clearBtnText, { color: theme.primary }]}>Limpiar favoritos</Text>
            </TouchableOpacity>
          ) : null
        }
        contentContainerStyle={{ padding: 12, paddingBottom: 30 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  pageTitle: { fontSize: 26, fontWeight: '800', marginBottom: 16, marginTop: 8 },
  card: { borderRadius: 12, borderWidth: 1, padding: 14, marginBottom: 12 },
  sectionTitle: { fontSize: 17, fontWeight: '700', marginBottom: 12 },
  avatarRow: { flexDirection: 'row', marginBottom: 14 },
  avatar: { fontSize: 40, marginRight: 14 },
  dataGrid: { flex: 1 },
  dataItem: { marginBottom: 8 },
  dataLabel: { fontSize: 11, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 2 },
  dataValue: { fontSize: 15, fontWeight: '600' },
  logoutBtn: { paddingVertical: 12, borderRadius: 10, alignItems: 'center' },
  logoutBtnText: { color: '#fff', fontWeight: '700', fontSize: 15 },
  favRow: { justifyContent: 'space-between', marginBottom: 8 },
  favCard: { width: '48%', borderRadius: 10, overflow: 'hidden', borderWidth: 1 },
  favImage: { width: '100%', height: 160 },
  favInfo: { padding: 8 },
  favTitle: { fontSize: 13, fontWeight: '700', marginBottom: 4 },
  favMeta: { fontSize: 11 },
  emptyText: { textAlign: 'center', fontSize: 14, marginTop: 8 },
  clearBtn: { marginTop: 12, paddingVertical: 10, borderRadius: 10, alignItems: 'center', borderWidth: 1 },
  clearBtnText: { fontWeight: '700', fontSize: 14 },
});
