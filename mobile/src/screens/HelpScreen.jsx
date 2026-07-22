import React, { useState } from 'react';
import {
  View, Text, TouchableOpacity, TextInput, ScrollView, StyleSheet, Linking,
} from 'react-native';
import { useTheme } from '../contexts/ThemeContext';
import { darkTheme, lightTheme } from '../theme';

function FaqItem({ question, children, theme }) {
  const [open, setOpen] = useState(false);

  return (
    <View style={[styles.faqItem, { borderColor: theme.border }]}>
      <TouchableOpacity
        style={[styles.faqQuestion, { backgroundColor: theme.surface }]}
        onPress={() => setOpen(!open)}
      >
        <Text style={[styles.faqQuestionText, { color: theme.text }]}>{question}</Text>
        <Text style={[styles.faqArrow, { color: theme.textSecondary }]}>{open ? '▲' : '▼'}</Text>
      </TouchableOpacity>
      {open && (
        <View style={[styles.faqAnswer, { backgroundColor: theme.card }]}>
          {children}
        </View>
      )}
    </View>
  );
}

export default function HelpScreen() {
  const { isDark } = useTheme();
  const theme = isDark ? darkTheme : lightTheme;

  const [searchQuery, setSearchQuery] = useState('');

  const handleIMDBSearch = () => {
    if (searchQuery.trim()) {
      Linking.openURL(`https://www.imdb.com/find/?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.background }]} contentContainerStyle={styles.content}>
      <Text style={[styles.pageTitle, { color: theme.text }]}>Más Información</Text>

      <View style={[styles.card, { backgroundColor: theme.surface, borderColor: theme.border }]}>
        <Text style={[styles.cardTitle, { color: theme.text }]}>Sobre PelisOnline</Text>
        <Text style={[styles.cardText, { color: theme.textSecondary }]}>
          En PelisOnline encontrás un catálogo curado de las mejores películas de todos los géneros.
          Para información más detallada sobre cada película, ratings de la crítica, fichas técnicas completas
          y más, te recomendamos visitar IMDb.
        </Text>
        <TouchableOpacity
          style={[styles.imdbBtn, { backgroundColor: theme.primary }]}
          onPress={() => Linking.openURL('https://www.imdb.com/es/')}
        >
          <Text style={styles.imdbBtnText}>Ir a IMDb</Text>
        </TouchableOpacity>
      </View>

      <View style={[styles.card, { backgroundColor: theme.surface, borderColor: theme.border }]}>
        <Text style={[styles.cardTitle, { color: theme.text }]}>¿Cómo funciona?</Text>
        <Text style={[styles.cardText, { color: theme.textSecondary }]}>
          En PelisOnline podés explorar nuestro catálogo de películas organizadas por género,
          buscar tus títulos favoritos y agregarlos a tu lista personal de favoritos.
        </Text>
        <Text style={[styles.cardTitle, { color: theme.text, fontSize: 16, marginTop: 12 }]}>Proceso</Text>
        <Text style={[styles.stepText, { color: theme.text }]}>
          1. Explorá el catálogo y descubrí películas de todos los géneros.
        </Text>
        <Text style={[styles.stepText, { color: theme.text }]}>
          2. Agregá a favoritos las películas que más te gusten.
        </Text>
        <Text style={[styles.stepText, { color: theme.text }]}>
          3. Accedé rápido a tu lista personalizada desde tu perfil.
        </Text>
      </View>

      <View style={[styles.card, { backgroundColor: theme.surface, borderColor: theme.border }]}>
        <Text style={[styles.cardTitle, { color: theme.text }]}>Buscar en IMDb</Text>
        <Text style={[styles.cardText, { color: theme.textSecondary }]}>
          ¿Querés más información sobre una película específica? Buscala directamente en IMDb.
        </Text>
        <View style={styles.searchRow}>
          <TextInput
            style={[styles.searchInput, { backgroundColor: theme.inputBg, color: theme.text, borderColor: theme.border }]}
            placeholder="Ej: El Padrino, Shrek..."
            placeholderTextColor={theme.textSecondary}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          <TouchableOpacity style={[styles.searchBtn, { backgroundColor: theme.primary }]} onPress={handleIMDBSearch}>
            <Text style={styles.searchBtnText}>Buscar</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={[styles.card, { backgroundColor: theme.surface, borderColor: theme.border }]}>
        <Text style={[styles.cardTitle, { color: theme.text }]}>Preguntas Frecuentes</Text>

        <FaqItem question="¿Cómo agrego una película a favoritos?" theme={theme}>
          <Text style={[styles.faqText, { color: theme.textSecondary }]}>
            Tocá el corazón que aparece en cada película del catálogo. También podés hacerlo desde la página de detalle de cada película.
          </Text>
        </FaqItem>

        <FaqItem question="¿Dónde veo mis películas favoritas?" theme={theme}>
          <Text style={[styles.faqText, { color: theme.textSecondary }]}>
            Andá a la pestaña de Perfil para ver tu lista de favoritos.
          </Text>
        </FaqItem>

        <FaqItem question="¿Cómo elimino una película de favoritos?" theme={theme}>
          <Text style={[styles.faqText, { color: theme.textSecondary }]}>
            Volvé a tocar el corazón en el catálogo o la página de detalle. También podés limpiar todos tus favoritos desde el perfil.
          </Text>
        </FaqItem>
      </View>

      <View style={{ height: 30 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 14, paddingBottom: 40 },
  pageTitle: { fontSize: 26, fontWeight: '800', marginBottom: 14, marginTop: 6 },
  card: { borderRadius: 12, borderWidth: 1, padding: 14, marginBottom: 12 },
  cardTitle: { fontSize: 18, fontWeight: '700', marginBottom: 8 },
  cardText: { fontSize: 14, lineHeight: 21, marginBottom: 8 },
  stepText: { fontSize: 14, marginBottom: 4, paddingLeft: 8 },
  imdbBtn: { paddingVertical: 12, borderRadius: 10, alignItems: 'center', marginTop: 4 },
  imdbBtnText: { color: '#fff', fontWeight: '700', fontSize: 15 },
  searchRow: { flexDirection: 'row', gap: 8, marginTop: 8 },
  searchInput: { flex: 1, borderWidth: 1, borderRadius: 10, paddingHorizontal: 14, paddingVertical: 10, fontSize: 14 },
  searchBtn: { paddingHorizontal: 20, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  searchBtnText: { color: '#fff', fontWeight: '700', fontSize: 14 },
  faqItem: { borderBottomWidth: 1, paddingBottom: 8, marginBottom: 8 },
  faqQuestion: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 10, paddingHorizontal: 4 },
  faqQuestionText: { fontSize: 15, fontWeight: '600', flex: 1 },
  faqArrow: { fontSize: 12, marginLeft: 8 },
  faqAnswer: { padding: 10, borderRadius: 8, marginTop: 4 },
  faqText: { fontSize: 14, lineHeight: 20 },
});
