import React, { useMemo } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Share,
  Platform,
} from 'react-native';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import {
  AudioButton,
  WordCard,
  EmptyState,
} from '../../components';
import { useFavorites } from '../../hooks/useFavorites';
import {
  Colors,
  Spacing,
  Typography,
  BorderRadius,
  Shadows,
  CATEGORIES,
} from '../../constants/theme';
import { DictionaryWord } from '../../types/dictionary';
import rawWordsData from '../../data/dictionary-data.json';

const wordsData = rawWordsData as DictionaryWord[];

type IconName = React.ComponentProps<typeof Ionicons>['name'];

export default function WordDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { isFavorite, toggleFavorite } = useFavorites();

  const currentWord = useMemo(() => {
    return wordsData.find((w) => w.id === id);
  }, [id]);

  const categoryInfo = currentWord?.category
    ? CATEGORIES.find((c) => c.id === currentWord.category)
    : null;

  // Words from the same category for the "Benzer Kelimeler" section
  const relatedWords = useMemo(() => {
    if (!currentWord) return [];
    return wordsData
      .filter((w) => w.category === currentWord.category && w.id !== currentWord.id)
      .slice(0, 4);
  }, [currentWord]);

  const isWordFav = currentWord ? isFavorite(currentWord.id) : false;

  const handleShare = async () => {
    if (!currentWord) return;
    try {
      const message = `${currentWord.word} (Denizli Ağzı)\n\nAnlamı: ${currentWord.meaning}${
        currentWord.example_sentence ? `\n\nÖrnek: "${currentWord.example_sentence}"` : ''
      }\n\n— Denizli Yöresel Sözlük`;

      await Share.share({
        message,
        title: `${currentWord.word} - Denizli Yöresel Sözlük`,
      });
    } catch {
      // Ignore share dismissal or cancel
    }
  };

  if (!currentWord) {
    return (
      <View style={[styles.screen, { paddingTop: insets.top }]}>
        <Stack.Screen options={{ title: 'Kelime Bulunamadı' }} />
        <EmptyState
          title="Kelime Bulunamadı"
          description="Aradığınız kelime sözlük veri tabanında bulunamadı veya silinmiş olabilir."
          actionText="Sözlüğe Dön"
          onAction={() => router.back()}
          iconName="alert-circle-outline"
        />
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      <Stack.Screen
        options={{
          title: currentWord.word,
          headerRight: () => (
            <View style={styles.headerActions}>
              <TouchableOpacity
                onPress={handleShare}
                activeOpacity={0.7}
                style={styles.headerActionButton}
                accessibilityRole="button"
                accessibilityLabel="Kelimeyi paylaş"
                accessibilityHint="Kelimeyi ve anlamını paylaşır"
              >
                <Ionicons
                  name={Platform.OS === 'ios' ? 'share-outline' : 'share-social-outline'}
                  size={22}
                  color={Colors.primary}
                />
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => toggleFavorite(currentWord.id)}
                activeOpacity={0.7}
                style={styles.headerActionButton}
                accessibilityRole="button"
                accessibilityLabel={
                  isWordFav
                    ? `${currentWord.word} kelimesini favorilerden çıkar`
                    : `${currentWord.word} kelimesini favorilere ekle`
                }
                accessibilityHint="Favori durumunu değiştirir"
              >
                <Ionicons
                  name={isWordFav ? 'heart' : 'heart-outline'}
                  size={24}
                  color={isWordFav ? Colors.heart : Colors.textSecondary}
                />
              </TouchableOpacity>
            </View>
          ),
        }}
      />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[
          styles.contentContainer,
          { paddingBottom: insets.bottom + Spacing.xxxl },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Main Word Header Card */}
        <View style={styles.card}>
          <View style={styles.wordHeaderRow}>
            <View style={styles.wordTitleContainer}>
              <Text style={styles.wordTitle}>{currentWord.word}</Text>
              {categoryInfo ? (
                <View style={styles.categoryBadge}>
                  <Ionicons
                    name={(categoryInfo.iconName as IconName) || 'pricetag-outline'}
                    size={14}
                    color={Colors.primary}
                    style={styles.categoryIcon}
                  />
                  <Text style={styles.categoryLabel}>{categoryInfo.label}</Text>
                </View>
              ) : null}
            </View>

            {/* Audio Button */}
            <View style={styles.audioWrapper}>
              <AudioButton word={currentWord.word} size="lg" />
            </View>
          </View>

          {/* Meaning Section */}
          <View style={styles.meaningSection}>
            <Text style={styles.sectionLabel}>ANLAMI</Text>
            <Text style={styles.meaningText}>{currentWord.meaning}</Text>
          </View>

          {/* Example Sentence Section */}
          {currentWord.example_sentence ? (
            <View style={styles.exampleSection}>
              <Text style={styles.sectionLabel}>CÜMLE İÇİNDE KULLANIMI</Text>
              <View style={styles.exampleBox}>
                <Ionicons
                  name="chatbubble-ellipses-outline"
                  size={20}
                  color={Colors.accent}
                  style={styles.quoteIcon}
                />
                <Text style={styles.exampleText}>
                  "{currentWord.example_sentence}"
                </Text>
              </View>
            </View>
          ) : null}
        </View>

        {/* Action Buttons Row */}
        <View style={styles.actionsRow}>
          <TouchableOpacity
            onPress={() => toggleFavorite(currentWord.id)}
            activeOpacity={0.8}
            style={[
              styles.actionButton,
              isWordFav ? styles.actionButtonActive : styles.actionButtonOutline,
            ]}
            accessibilityRole="button"
            accessibilityLabel={isWordFav ? 'Favorilerden Çıkar' : 'Favorilere Ekle'}
          >
            <Ionicons
              name={isWordFav ? 'heart' : 'heart-outline'}
              size={20}
              color={isWordFav ? Colors.textInverse : Colors.heart}
              style={styles.actionButtonIcon}
            />
            <Text
              style={[
                styles.actionButtonText,
                isWordFav ? styles.actionButtonTextActive : styles.actionButtonTextOutline,
              ]}
            >
              {isWordFav ? 'Favorilerde' : 'Favorilere Ekle'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleShare}
            activeOpacity={0.8}
            style={[styles.actionButton, styles.actionButtonSecondary]}
            accessibilityRole="button"
            accessibilityLabel="Kelimeyi Paylaş"
          >
            <Ionicons
              name={Platform.OS === 'ios' ? 'share-outline' : 'share-social-outline'}
              size={20}
              color={Colors.primary}
              style={styles.actionButtonIcon}
            />
            <Text style={styles.actionButtonSecondaryText}>Paylaş</Text>
          </TouchableOpacity>
        </View>

        {/* Cultural Fact Box */}
        <View style={styles.culturalCard}>
          <View style={styles.culturalHeader}>
            <Ionicons name="sparkles" size={18} color={Colors.accent} />
            <Text style={styles.culturalTitle}>Biliyor muydunuz?</Text>
          </View>
          <Text style={styles.culturalText}>
            Denizli ağzındaki kelimelerin büyük kısmı 13. yüzyıldan itibaren bölgeye yerleşen
            Oğuz boylarının öz Türkçe söz varlığını günümüze taşımaktadır.
          </Text>
        </View>

        {/* Related Words Section */}
        {relatedWords.length > 0 ? (
          <View style={styles.relatedSection}>
            <Text style={styles.relatedHeader}>
              Aynı Kategorideki Diğer Kelimeler
            </Text>
            {relatedWords.map((word) => (
              <WordCard
                key={word.id}
                word={word}
                isFavorite={isFavorite(word.id)}
                onToggleFavorite={() => toggleFavorite(word.id)}
                onPress={() => {
                  router.push({
                    pathname: '/word/[id]',
                    params: { id: word.id },
                  });
                }}
              />
            ))}
          </View>
        ) : null}
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
    paddingTop: Spacing.md,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerActionButton: {
    width: Spacing.minTouchTarget,
    height: Spacing.minTouchTarget,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: Spacing.xs,
  },
  card: {
    backgroundColor: Colors.card,
    borderRadius: BorderRadius.xl,
    padding: Spacing.xl,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    ...Shadows.medium,
    marginBottom: Spacing.lg,
  },
  wordHeaderRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: Spacing.lg,
  },
  wordTitleContainer: {
    flex: 1,
    marginRight: Spacing.md,
  },
  wordTitle: {
    fontSize: Typography.fontSize.hero,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.primaryDark,
    letterSpacing: -0.5,
  },
  categoryBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: Colors.primarySubtle,
    borderRadius: BorderRadius.pill,
    paddingHorizontal: Spacing.md,
    paddingVertical: 5,
    marginTop: Spacing.sm,
  },
  categoryIcon: {
    marginRight: 6,
  },
  categoryLabel: {
    fontSize: Typography.fontSize.xs,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.primaryDark,
  },
  audioWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  meaningSection: {
    marginBottom: Spacing.lg,
    paddingTop: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: Colors.divider,
  },
  sectionLabel: {
    fontSize: Typography.fontSize.xs,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.textMuted,
    letterSpacing: 0.8,
    marginBottom: Spacing.xs + 2,
  },
  meaningText: {
    fontSize: Typography.fontSize.lg,
    fontWeight: Typography.fontWeight.regular,
    color: Colors.textPrimary,
    lineHeight: 28,
  },
  exampleSection: {
    paddingTop: Spacing.sm,
  },
  exampleBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: Colors.surfaceVariant,
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    marginTop: Spacing.xs,
  },
  quoteIcon: {
    marginRight: Spacing.sm,
    marginTop: 2,
  },
  exampleText: {
    flex: 1,
    fontSize: Typography.fontSize.base,
    fontStyle: 'italic',
    color: Colors.textPrimary,
    lineHeight: 24,
  },
  actionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.lg,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: Spacing.minTouchTarget,
    borderRadius: BorderRadius.lg,
    paddingHorizontal: Spacing.md,
  },
  actionButtonActive: {
    backgroundColor: Colors.heart,
    marginRight: Spacing.sm,
  },
  actionButtonOutline: {
    backgroundColor: Colors.surface,
    borderWidth: 1.5,
    borderColor: Colors.heart,
    marginRight: Spacing.sm,
  },
  actionButtonIcon: {
    marginRight: 6,
  },
  actionButtonText: {
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.semibold,
  },
  actionButtonTextActive: {
    color: Colors.textInverse,
  },
  actionButtonTextOutline: {
    color: Colors.heart,
  },
  actionButtonSecondary: {
    backgroundColor: Colors.surface,
    borderWidth: 1.5,
    borderColor: Colors.cardBorder,
  },
  actionButtonSecondaryText: {
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.textPrimary,
  },
  culturalCard: {
    backgroundColor: Colors.accentLight,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    borderLeftWidth: 4,
    borderLeftColor: Colors.accent,
    marginBottom: Spacing.xl,
  },
  culturalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.xs,
  },
  culturalTitle: {
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.accent,
    marginLeft: Spacing.xs,
  },
  culturalText: {
    fontSize: Typography.fontSize.xs,
    color: Colors.textPrimary,
    lineHeight: 18,
  },
  relatedSection: {
    marginTop: Spacing.sm,
  },
  relatedHeader: {
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.textPrimary,
    marginBottom: Spacing.sm,
  },
});
