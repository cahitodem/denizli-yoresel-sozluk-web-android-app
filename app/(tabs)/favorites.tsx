import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  Header,
  SearchBar,
  WordCard,
  EmptyState,
} from '../../components';
import { useFavorites } from '../../hooks/useFavorites';
import {
  Colors,
  Spacing,
  Typography,
} from '../../constants/theme';
import { DictionaryWord } from '../../types/dictionary';
import rawWordsData from '../../data/dictionary-data.json';

const wordsData = rawWordsData as DictionaryWord[];

export default function FavoritesScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { favoriteIds, isFavorite, toggleFavorite, isLoading } = useFavorites();
  const [searchQuery, setSearchQuery] = useState<string>('');

  // All favorite words matching the stored IDs
  const favoriteWords = useMemo(() => {
    const idSet = new Set(favoriteIds);
    return wordsData.filter((w) => idSet.has(w.id));
  }, [favoriteIds]);

  // Filtered by search query if any
  const displayedFavorites = useMemo(() => {
    const q = searchQuery.toLocaleLowerCase('tr-TR').trim();
    if (!q) return favoriteWords;
    return favoriteWords.filter(
      (w) =>
        w.word.toLocaleLowerCase('tr-TR').includes(q) ||
        w.meaning.toLocaleLowerCase('tr-TR').includes(q)
    );
  }, [favoriteWords, searchQuery]);

  const handleWordPress = (wordId: string) => {
    router.push({
      pathname: '/word/[id]',
      params: { id: wordId },
    });
  };

  const handleGoToDictionary = () => {
    router.push('/(tabs)/dictionary');
  };

  return (
    <View style={[styles.screen, { paddingTop: insets.top }]}>
      <Header
        title="Favorilerim"
        subtitle="Kaydettiğiniz ve öğrendiğiniz yöresel kelimeler"
      />

      {/* Show search bar only if user has at least 3 favorites */}
      {favoriteWords.length >= 3 ? (
        <View style={styles.searchContainer}>
          <SearchBar
            value={searchQuery}
            onChangeText={setSearchQuery}
            onClear={() => setSearchQuery('')}
            placeholder="Favorileriniz içinde arayın..."
          />
        </View>
      ) : null}

      {/* Counter bar */}
      {favoriteWords.length > 0 ? (
        <View style={styles.counterBar}>
          <Text style={styles.counterText}>
            Toplam {favoriteWords.length} favori kelime kaydedildi
          </Text>
        </View>
      ) : null}

      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.primary} />
        </View>
      ) : (
        <FlatList
          data={displayedFavorites}
          keyExtractor={(item) => item.id}
          contentContainerStyle={[
            styles.listContent,
            { paddingBottom: insets.bottom + Spacing.xxxl },
          ]}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          renderItem={({ item }) => (
            <WordCard
              word={item}
              isFavorite={isFavorite(item.id)}
              onToggleFavorite={() => toggleFavorite(item.id)}
              onPress={() => handleWordPress(item.id)}
            />
          )}
          ListEmptyComponent={
            favoriteWords.length === 0 ? (
              <EmptyState
                title="Henüz Favori Eklenmedi"
                description="Beğendiğiniz veya unutmak istemediğiniz Denizli yöresel kelimelerinin yanındaki kalp simgesine dokunarak listenize ekleyebilirsiniz."
                actionText="Sözlüğü Keşfet"
                onAction={handleGoToDictionary}
                iconName="heart-outline"
              />
            ) : (
              <EmptyState
                title="Sonuç Bulunamadı"
                description={`Favorileriniz arasında "${searchQuery}" ifadesiyle eşleşen kelime bulunamadı.`}
                actionText="Aramayı Temizle"
                onAction={() => setSearchQuery('')}
                iconName="search-outline"
              />
            )
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  searchContainer: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.xs,
    paddingBottom: Spacing.sm,
  },
  counterBar: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.xs,
  },
  counterText: {
    fontSize: Typography.fontSize.xs,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.textSecondary,
  },
  listContent: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.xs,
    flexGrow: 1,
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
