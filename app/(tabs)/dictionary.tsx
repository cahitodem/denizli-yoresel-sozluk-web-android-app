import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import {
  Header,
  SearchBar,
  CategoryPill,
  WordCard,
  EmptyState,
} from '../../components';
import { useFavorites } from '../../hooks/useFavorites';
import { useSearch } from '../../hooks/useSearch';
import {
  Colors,
  Spacing,
  Typography,
  BorderRadius,
  CATEGORIES,
} from '../../constants/theme';
import { DictionaryWord, CategoryType } from '../../types/dictionary';
import rawWordsData from '../../data/dictionary-data.json';

const wordsData = rawWordsData as DictionaryWord[];

export default function DictionaryScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { isFavorite, toggleFavorite } = useFavorites();
  const [selectedCategory, setSelectedCategory] = useState<CategoryType | 'hepsi'>('hepsi');
  const [sortAscending, setSortAscending] = useState<boolean>(true);

  const { query, setQuery, filteredWords } = useSearch(wordsData, selectedCategory);

  // Sorted words using Turkish collation
  const sortedWords = useMemo(() => {
    return [...filteredWords].sort((a, b) => {
      const cmp = a.word.localeCompare(b.word, 'tr-TR');
      return sortAscending ? cmp : -cmp;
    });
  }, [filteredWords, sortAscending]);

  const handleWordPress = (wordId: string) => {
    router.push({
      pathname: '/word/[id]',
      params: { id: wordId },
    });
  };

  const handleResetFilters = () => {
    setQuery('');
    setSelectedCategory('hepsi');
  };

  return (
    <View style={[styles.screen, { paddingTop: insets.top }]}>
      <Header
        title="Yöresel Sözlük"
        subtitle="A'dan Z'ye Denizli ağzı ve deyimleri"
        rightAction={
          <TouchableOpacity
            onPress={() => setSortAscending((prev) => !prev)}
            activeOpacity={0.7}
            style={styles.sortButton}
            accessibilityRole="button"
            accessibilityLabel={sortAscending ? 'Z-A sırala' : 'A-Z sırala'}
            accessibilityHint="Kelime sıralama yönünü değiştirir"
          >
            <Ionicons
              name={sortAscending ? 'arrow-down' : 'arrow-up'}
              size={18}
              color={Colors.primary}
            />
            <Text style={styles.sortButtonText}>
              {sortAscending ? 'A-Z' : 'Z-A'}
            </Text>
          </TouchableOpacity>
        }
      />

      {/* Search and Category Filter Section */}
      <View style={styles.filterSection}>
        <View style={styles.searchPadding}>
          <SearchBar
            value={query}
            onChangeText={setQuery}
            onClear={() => setQuery('')}
            placeholder="Sözlükte kelime veya anlam ara..."
          />
        </View>

        {/* Categories Bar */}
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={CATEGORIES}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.categoriesContent}
          renderItem={({ item }) => {
            const count =
              item.id === 'hepsi'
                ? wordsData.length
                : wordsData.filter((w) => w.category === item.id).length;

            return (
              <CategoryPill
                category={item.id}
                isSelected={selectedCategory === item.id}
                count={count}
                onPress={() => setSelectedCategory(item.id)}
              />
            );
          }}
        />

        {/* Results Counter and Filter Info Bar */}
        <View style={styles.counterBar}>
          <Text style={styles.counterText}>
            {sortedWords.length} kelime listeleniyor
          </Text>
          {(query.trim() || selectedCategory !== 'hepsi') && (
            <TouchableOpacity
              onPress={handleResetFilters}
              style={styles.clearFilterButton}
              accessibilityRole="button"
              accessibilityLabel="Filtreleri sıfırla"
            >
              <Ionicons name="close-circle-outline" size={16} color={Colors.primary} />
              <Text style={styles.clearFilterText}>Filtreleri Sıfırla</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Dictionary Words List */}
      <FlatList
        data={sortedWords}
        keyExtractor={(item) => item.id}
        contentContainerStyle={[
          styles.listContent,
          { paddingBottom: insets.bottom + Spacing.xxxl },
        ]}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        initialNumToRender={12}
        maxToRenderPerBatch={15}
        windowSize={7}
        renderItem={({ item }) => (
          <WordCard
            word={item}
            isFavorite={isFavorite(item.id)}
            onToggleFavorite={() => toggleFavorite(item.id)}
            onPress={() => handleWordPress(item.id)}
          />
        )}
        ListEmptyComponent={
          <EmptyState
            title="Kelime Bulunamadı"
            description={
              query.trim()
                ? `"${query}" aramasıyla eşleşen herhangi bir kelime bulunamadı.`
                : 'Seçili kategoride henüz kelime bulunmuyor.'
            }
            actionText="Tüm Kelimeleri Göster"
            onAction={handleResetFilters}
            iconName="book-outline"
          />
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  filterSection: {
    backgroundColor: Colors.background,
    borderBottomWidth: 1,
    borderBottomColor: Colors.divider,
    paddingBottom: Spacing.xs,
  },
  searchPadding: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.xs,
    paddingBottom: Spacing.sm,
  },
  categoriesContent: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.xs,
  },
  counterBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.xs + 2,
  },
  counterText: {
    fontSize: Typography.fontSize.xs,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.textSecondary,
  },
  clearFilterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: Spacing.minTouchTarget,
    paddingHorizontal: Spacing.xs,
  },
  clearFilterText: {
    fontSize: Typography.fontSize.xs,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.primary,
    marginLeft: 4,
  },
  sortButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primarySubtle,
    borderRadius: BorderRadius.pill,
    paddingHorizontal: Spacing.md,
    height: Spacing.minTouchTarget,
  },
  sortButtonText: {
    fontSize: Typography.fontSize.xs,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.primaryDark,
    marginLeft: 4,
  },
  listContent: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.sm,
  },
});
