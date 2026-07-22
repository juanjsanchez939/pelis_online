import React from 'react';
import { View, Text, StyleSheet, TextInput } from 'react-native';
import { useFilters } from '../hooks/useFilters';
import { useTheme } from '../contexts/ThemeContext';
import { darkTheme, lightTheme } from '../theme';
import { Picker } from '@react-native-picker/picker';

const GENRES = [
  { label: 'Todos los géneros', value: 'all' },
  { label: 'Acción', value: 'Acción' },
  { label: 'Animadas', value: 'Animadas' },
  { label: 'Aventura', value: 'Aventura' },
  { label: 'Bélicas', value: 'Bélicas' },
  { label: 'Comedias', value: 'Comedias' },
  { label: 'Terror', value: 'Terror' },
];

export default function Filters() {
  const { filters, setFilters } = useFilters();
  const { isDark } = useTheme();
  const theme = isDark ? darkTheme : lightTheme;

  return (
    <View style={[styles.container, { backgroundColor: theme.surface, borderColor: theme.border }]}>
      <Text style={[styles.label, { color: theme.text }]}>Género</Text>
      <View style={[styles.pickerWrapper, { backgroundColor: theme.inputBg, borderColor: theme.border }]}>
        <Picker
          selectedValue={filters.category}
          onValueChange={(val) => setFilters((prev) => ({ ...prev, category: val }))}
          style={{ color: theme.text }}
          dropdownIconColor={theme.text}
        >
          {GENRES.map((g) => (
            <Picker.Item key={g.value} label={g.label} value={g.value} />
          ))}
        </Picker>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 12,
    marginHorizontal: 12,
    marginTop: 8,
    borderRadius: 10,
    borderWidth: 1,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 6,
  },
  pickerWrapper: {
    borderRadius: 8,
    borderWidth: 1,
    overflow: 'hidden',
  },
});
