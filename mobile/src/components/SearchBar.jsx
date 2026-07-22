import React from 'react';
import { View, TextInput, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { useFilters } from '../hooks/useFilters';
import { useTheme } from '../contexts/ThemeContext';
import { darkTheme, lightTheme } from '../theme';

export default function SearchBar() {
  const { filters, setFilters } = useFilters();
  const { isDark } = useTheme();
  const theme = isDark ? darkTheme : lightTheme;

  const handleClear = () => {
    setFilters((prev) => ({ ...prev, searchQuery: '' }));
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.surface, borderColor: theme.border }]}>
      <Text style={styles.icon}>🔍</Text>
      <TextInput
        style={[styles.input, { color: theme.text }]}
        placeholder="Buscar películas..."
        placeholderTextColor={theme.textSecondary}
        value={filters.searchQuery}
        onChangeText={(text) => setFilters((prev) => ({ ...prev, searchQuery: text }))}
      />
      {filters.searchQuery.length > 0 && (
        <TouchableOpacity onPress={handleClear}>
          <Text style={[styles.clear, { color: theme.textSecondary }]}>✕</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 12,
    marginTop: 10,
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  icon: {
    fontSize: 16,
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontSize: 15,
    paddingVertical: 8,
  },
  clear: {
    fontSize: 16,
    fontWeight: '700',
    paddingLeft: 8,
  },
});
