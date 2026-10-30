import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
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
  WordOfTheDayCard,
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

function getWordOfTheDay(words: DictionaryWord[]): DictionaryWord {
  if (!words || words.length === 0) {
    return {
      id: 'default',
      word: 'Ünnemek',
      meaning: 'Seslenmek, çağırmak',
      example_sentence: null,
      category: 'gunluk_yasam',
      audio_url: null,
    };
  }
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 0);
  const diff = now.getTime() - start.getTime();
  const oneDay = 1000 * 60 * 60 * 24;
  const dayOfYear = Math.floor(diff / oneDay);
  const index = Math.abs((dayOfYear * 37) % words.length);
  return words[index] || words[0];
}

export default function HomeScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { isFavorite, toggleFavorite } = useFavorites();
  const [selectedCategory, setSelectedCategory] = useState<CategoryType | 'hepsi'>('hepsi');

  const { query, setQuery, filteredWords } = useSearch(wordsData, selectedCategory);

  const wordOfTheDay = useMemo(() => getWordOfTheDay(wordsData), []);

  // Filtered or discovery words
  const discoveryWords = useMemo(() => {
    if (selectedCategory === 'hepsi') {
      // Pick a diverse set of 8 distinct words
      return wordsData.slice(0, 8);
    }
    return wordsData.filter((w) => w.category === selectedCategory).slice(0, 8);
  }, [selectedCategory]);

  const handleWordPress = (wordId: string) => {
    router.push({
      pathname: '/word/[id]',
      params: { id: wordId },
    });
  };

  const handleViewAllInDictionary = () => {
    router.push('/(tabs)/dictionary');
  };

  const isSearchActive = query.trim().length > 0;

  return (
    <View style={[styles.screen, { paddingTop: insets.top }]}>
      <Header
        title="Denizli Sözlüğü"
        subtitle="Ege'nin köklü dili ve yöresel ağzı"
        rightAction={
          <TouchableOpacity
            onPress={handleViewAllInDictionary}
            activeOpacity={0.7}
            style={styles.headerIconButton}
            accessibilityRole="button"
            accessibilityLabel="Tüm sözlüğü aç"
            accessibilityHint="Sözlük sekmesine geçiş yapar"
          >
            <Ionicons name="book-outline" size={22} color={Colors.primary} />
          </TouchableOpacity>
        }
      />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[
          styles.contentContainer,
          { paddingBottom: insets.bottom + Spacing.xxxl },
        ]}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Search Bar Section */}
        <View style={styles.searchSection}>
          <SearchBar
            value={query}
            onChangeText={setQuery}
            onClear={() => setQuery('')}
            placeholder="Kelime veya Türkçe anlam ara..."
          />
        </View>

        {isSearchActive ? (
          /* Search Results */
          <View style={styles.sectionContainer}>
            <View style={styles.sectionHeaderRow}>
              <Text style={styles.sectionTitle}>
                Arama Sonuçları ({filteredWords.length})
              </Text>
            </View>

            {filteredWords.length === 0 ? (
              <EmptyState
                title="Kelime Bulunamadı"
                description={`"${query}" ifadesiyle eşleşen Denizli yöresel kelimesi bulunamadı.`}
                actionText="Aramayı Temizle"
                onAction={() => setQuery('')}
                iconName="search-outline"
              />
            ) : (
              filteredWords.map((word) => (
                <WordCard
                  key={word.id}
                  word={word}
                  isFavorite={isFavorite(word.id)}
                  onToggleFavorite={() => toggleFavorite(word.id)}
                  onPress={() => handleWordPress(word.id)}
                />
              ))
            )}
          </View>
        ) : (
          /* Main Home Discovery Content */
          <>
            {/* Word of the Day */}
            <View style={styles.sectionContainer}>
              <WordOfTheDayCard
                word={wordOfTheDay}
                isFavorite={isFavorite(wordOfTheDay.id)}
                onToggleFavorite={() => toggleFavorite(wordOfTheDay.id)}
                onPress={() => handleWordPress(wordOfTheDay.id)}
              />
            </View>

            {/* Cultural Stats Pill Banner */}
            <View style={styles.bannerCard}>
              <View style={styles.bannerIconCircle}>
                <Ionicons name="sparkles" size={20} color={Colors.primary} />
              </View>
              <View style={styles.bannerTextContainer}>
                <Text style={styles.bannerTitle}>Denizli Ağzı Hafızası</Text>
                <Text style={styles.bannerSubtitle}>
                  {wordsData.length} özgün kelime ve deyimle zenginleşen kültürel miras
                </Text>
              </View>
            </View>

            {/* Category Pills Horizontal Scroll */}
            <View style={styles.categoriesSection}>
              <View style={styles.sectionHeaderRow}>
                <Text style={styles.sectionTitle}>Kategorilere Göz At</Text>
              </View>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.categoriesList}
              >
                {CATEGORIES.map((cat) => {
                  const count =
                    cat.id === 'hepsi'
                      ? wordsData.length
                      : wordsData.filter((w) => w.category === cat.id).length;

                  return (
                    <CategoryPill
                      key={cat.id}
                      category={cat.id}
                      isSelected={selectedCategory === cat.id}
                      count={count}
                      onPress={() => setSelectedCategory(cat.id)}
                    />
                  );
                })}
              </ScrollView>
            </View>

            {/* Discovery Words List */}
            <View style={styles.sectionContainer}>
              <View style={styles.sectionHeaderRow}>
                <Text style={styles.sectionTitle}>
                  {selectedCategory === 'hepsi'
                    ? 'Keşfet'
                    : `${CATEGORIES.find((c) => c.id === selectedCategory)?.label || ''} Kelimeleri`}
                </Text>
                <TouchableOpacity
                  onPress={handleViewAllInDictionary}
                  style={styles.seeAllButton}
                  accessibilityRole="button"
                  accessibilityLabel="Tümünü gör"
                  accessibilityHint="Sözlük ekranında tüm listeyi açar"
                >
                  <Text style={styles.seeAllText}>Tümünü Gör</Text>
                  <Ionicons name="chevron-forward" size={16} color={Colors.primary} />
                </TouchableOpacity>
              </View>

              {discoveryWords.map((word) => (
                <WordCard
                  key={word.id}
                  word={word}
                  isFavorite={isFavorite(word.id)}
                  onToggleFavorite={() => toggleFavorite(word.id)}
                  onPress={() => handleWordPress(word.id)}
                />
              ))}
            </View>
          </>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: Spacing.lg,
  },
  headerIconButton: {
    width: Spacing.minTouchTarget,
    height: Spacing.minTouchTarget,
    borderRadius: BorderRadius.pill,
    backgroundColor: Colors.primarySubtle,
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchSection: {
    marginVertical: Spacing.sm,
  },
  sectionContainer: {
    marginTop: Spacing.md,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.sm,
  },
  sectionTitle: {
    fontSize: Typography.fontSize.lg,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.textPrimary,
  },
  seeAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: Spacing.minTouchTarget,
    paddingHorizontal: Spacing.xs,
  },
  seeAllText: {
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.primary,
    marginRight: 2,
  },
  categoriesSection: {
    marginTop: Spacing.md,
  },
  categoriesList: {
    paddingVertical: Spacing.xs,
  },
  bannerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    marginTop: Spacing.sm,
  },
  bannerIconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.primarySubtle,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
  },
  bannerTextContainer: {
    flex: 1,
  },
  bannerTitle: {
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.textPrimary,
  },
  bannerSubtitle: {
    fontSize: Typography.fontSize.xs,
    color: Colors.textSecondary,
    marginTop: 2,
  },
});
